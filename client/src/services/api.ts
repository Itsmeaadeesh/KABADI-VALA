import { localDB, type SyncMutation } from '../db/dexieDB';
import type { Material, Lot, RecyclerFacility, SafetyGuide, AnalyticsData, PriceRecord, Transaction } from '../types/schema';
import {
  MOCK_MATERIALS,
  MOCK_PRICES,
  MOCK_RECYCLERS,
  MOCK_LOTS,
  MOCK_TRANSACTIONS,
  MOCK_SAFETY_GUIDES,
  MOCK_ANALYTICS
} from '../data/mockData';

const API_BASE = '/api';

async function safeFetch<T>(url: string, fallback: T, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) return fallback;
    const ct = res.headers.get('content-type');
    if (ct && ct.includes('application/json')) {
      return await res.json();
    }
    return fallback;
  } catch {
    return fallback;
  }
}

export class ApiService {
  private static isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  static setOnlineStatus(online: boolean) {
    this.isOnline = online;
  }

  static getOnlineStatus() {
    return this.isOnline;
  }

  // 1. MATERIALS
  static async getMaterials(): Promise<Material[]> {
    const data = await safeFetch<Material[]>(`${API_BASE}/materials`, MOCK_MATERIALS);
    try {
      await localDB.cachedMaterials.clear();
      await localDB.cachedMaterials.bulkPut(data);
    } catch {}
    return data;
  }

  // 2. PRICES
  static async getPrices(): Promise<PriceRecord[]> {
    return safeFetch<PriceRecord[]>(`${API_BASE}/prices`, MOCK_PRICES);
  }

  static async getPriceHistory(materialId?: string, days = 30) {
    const query = new URLSearchParams();
    if (materialId) query.set('materialId', materialId);
    query.set('days', days.toString());
    const fallback = {
      materialId: materialId || 'PCB',
      days,
      chartData: [
        { date: '1 Sep', benchmark: 395, marketHigh: 410, marketLow: 385 },
        { date: '3 Sep', benchmark: 398, marketHigh: 412, marketLow: 388 },
        { date: '5 Sep', benchmark: 402, marketHigh: 416, marketLow: 392 },
        { date: '7 Sep', benchmark: 405, marketHigh: 420, marketLow: 395 },
        { date: '9 Sep', benchmark: 408, marketHigh: 422, marketLow: 398 },
        { date: '11 Sep', benchmark: 410, marketHigh: 425, marketLow: 400 }
      ]
    };
    return safeFetch(`${API_BASE}/prices/history?${query.toString()}`, fallback);
  }

  static async updatePrice(materialId: string, benchmarkRate: number) {
    return safeFetch(`${API_BASE}/prices/${materialId}`, { success: true, benchmarkRate }, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ benchmarkRate })
    });
  }

  // 3. LOTS
  static async getLots(params?: { collectorId?: string; recyclerId?: string; status?: string }): Promise<Lot[]> {
    const query = new URLSearchParams(params as any);
    const serverLots = await safeFetch<Lot[]>(`${API_BASE}/lots?${query.toString()}`, MOCK_LOTS);
    try {
      for (const l of serverLots) {
        await localDB.lots.put(l);
      }
      let coll = localDB.lots.toCollection();
      if (params?.collectorId) {
        coll = localDB.lots.where('collector_id').equals(params.collectorId);
      }
      const localLots = await coll.toArray();
      if (localLots.length > 0) return localLots;
    } catch {}
    return serverLots;
  }

  static async getLot(id: string): Promise<Lot> {
    const fallback = MOCK_LOTS.find((l) => l.id === id || l.code === id) || MOCK_LOTS[0];
    try {
      const local = await localDB.lots.get(id);
      if (local) return local;
    } catch {}
    return safeFetch<Lot>(`${API_BASE}/lots/${id}`, fallback);
  }

  static async createLot(lotData: Partial<Lot>): Promise<Lot> {
    const tempId = 'lot-local-' + Date.now();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const code = `LOT-2026-MH-${randomSuffix}`;

    const newLot: Lot = {
      id: tempId,
      code,
      collector_id: lotData.collector_id || 'col-ramesh-1',
      material_id: lotData.material_id!,
      weight: lotData.weight!,
      condition: lotData.condition || 'INTACT',
      estimated_price: lotData.estimated_price || 0,
      photo_url: lotData.photo_url || '',
      ai_predicted_category: lotData.ai_predicted_category,
      ai_confidence: lotData.ai_confidence || 0.94,
      status: this.isOnline ? 'NEW' : 'LOCAL_PENDING_SYNC',
      recycler_id: lotData.recycler_id || null,
      created_at: new Date().toISOString()
    };

    // Always save to IndexedDB immediately
    await localDB.lots.put(newLot);

    // If online, attempt POST to server
    try {
      const res = await fetch(`${API_BASE}/lots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectorId: newLot.collector_id,
          materialId: newLot.material_id,
          weight: newLot.weight,
          condition: newLot.condition,
          photoUrl: newLot.photo_url,
          aiPredictedCategory: newLot.ai_predicted_category,
          aiConfidence: newLot.ai_confidence,
          recyclerId: newLot.recycler_id
        })
      });

      if (res.ok) {
        const ct = res.headers.get('content-type');
        if (ct && ct.includes('application/json')) {
          const savedServerLot: Lot = await res.json();
          await localDB.lots.delete(tempId);
          await localDB.lots.put(savedServerLot);
          return savedServerLot;
        }
      }
    } catch {
      // Offline fallback: keep in syncQueue
      const mutation: SyncMutation = {
        id: 'mut-' + Date.now(),
        action: 'CREATE_LOT',
        payload: newLot,
        timestamp: Date.now(),
        retryCount: 0,
        status: 'PENDING'
      };
      await localDB.syncQueue.put(mutation);
    }

    return newLot;
  }

  // 4. RECYCLERS
  static async getRecyclers(): Promise<RecyclerFacility[]> {
    return safeFetch<RecyclerFacility[]>(`${API_BASE}/recyclers`, MOCK_RECYCLERS);
  }

  static async getNearbyRecyclers(params?: {
    lat?: number;
    lng?: number;
    materialCode?: string;
    maxDistance?: number;
  }): Promise<RecyclerFacility[]> {
    const query = new URLSearchParams();
    if (params?.lat) query.set('lat', params.lat.toString());
    if (params?.lng) query.set('lng', params.lng.toString());
    if (params?.materialCode) query.set('materialCode', params.materialCode);
    if (params?.maxDistance) query.set('maxDistance', params.maxDistance.toString());

    return safeFetch<RecyclerFacility[]>(`${API_BASE}/recyclers/nearby?${query.toString()}`, MOCK_RECYCLERS);
  }

  static async updateRecyclerRates(recyclerId: string, rates: Record<string, number>) {
    return safeFetch(`${API_BASE}/recyclers/${recyclerId}/rates`, { success: true }, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rates })
    });
  }

  // 5. PICKUPS
  static async getPickups(params?: { recyclerId?: string; collectorId?: string }) {
    const query = new URLSearchParams(params as any);
    const fallback = [
      {
        id: 'pkp-1',
        lot_id: 'lot-demo-2',
        lot_code: 'LOT-202609-002',
        collector_name: 'Ramesh Kumar',
        collector_phone: '9999999999',
        material_name: 'Copper Cables & Wiring',
        weight: 8.2,
        estimated_price: 4264,
        pickup_address: 'Dharavi Sector 3, Near Kumbharwada, Mumbai',
        requested_date: '2026-09-12',
        scheduled_time_slot: 'Morning (10 AM - 1 PM)',
        status: 'SCHEDULED'
      }
    ];
    return safeFetch(`${API_BASE}/pickups?${query.toString()}`, fallback);
  }

  static async requestPickup(payload: {
    lotId: string;
    collectorId?: string;
    recyclerId: string;
    requestedDate?: string;
    scheduledTimeSlot?: string;
    notes?: string;
  }) {
    return safeFetch(`${API_BASE}/pickups`, { success: true, id: 'pkp-' + Date.now(), ...payload }, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  // 6. HANDOVER
  static async getHandover(lotId: string) {
    const fallback = {
      lot: MOCK_LOTS.find((l) => l.id === lotId || l.code === lotId) || MOCK_LOTS[0],
      collector: { name: 'Ramesh Kumar', phone: '9999999999' }
    };
    return safeFetch(`${API_BASE}/handover/${lotId}`, fallback);
  }

  static async verifyHandover(payload: {
    lotCodeOrId: string;
    verifiedWeight: number;
    ratePerKg?: number;
    recyclerId?: string;
    paymentMethod?: 'UPI' | 'CASH';
    notes?: string;
  }) {
    const fallback = {
      success: true,
      data: {
        lot_code: payload.lotCodeOrId,
        verified_weight: payload.verifiedWeight,
        material_name: 'Printed Circuit Boards (High Grade)',
        initial_weight: payload.verifiedWeight,
        final_price: payload.verifiedWeight * (payload.ratePerKg || 425),
        reference_id: 'UPI/' + Date.now().toString().slice(-8),
        collector_name: 'Ramesh Kumar'
      },
      transactionId: 'txn-' + Date.now(),
      amount: payload.verifiedWeight * (payload.ratePerKg || 425),
      referenceId: 'UPI/' + Date.now().toString().slice(-8),
      manifestNumber: 'CPCB/MANIFEST/2026/' + Math.floor(10000 + Math.random() * 90000)
    };
    return safeFetch<any>(`${API_BASE}/handover`, fallback, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  // 7. KHATA & TRANSACTIONS
  static async getCollectorKhata(collectorId = 'col-ramesh-1') {
    const fallback = {
      summary: {
        thisMonthEarnings: 18450,
        pendingAmount: 3250,
        completedLotsCount: 17,
        inTransitCount: 2
      },
      transactions: MOCK_TRANSACTIONS
    };
    return safeFetch(`${API_BASE}/transactions/collector/${collectorId}`, fallback);
  }

  static async getTransactions(): Promise<Transaction[]> {
    return safeFetch<Transaction[]>(`${API_BASE}/transactions`, MOCK_TRANSACTIONS);
  }

  // 8. ANALYTICS
  static async getAnalytics(): Promise<AnalyticsData> {
    return safeFetch<AnalyticsData>(`${API_BASE}/analytics`, MOCK_ANALYTICS);
  }

  // 9. SAFETY
  static async getSafetyGuides(): Promise<SafetyGuide[]> {
    return safeFetch<SafetyGuide[]>(`${API_BASE}/safety`, MOCK_SAFETY_GUIDES);
  }

  // 10. BATCH SYNC
  static async syncOfflineMutations(mutations: SyncMutation[]) {
    return safeFetch(`${API_BASE}/sync/batch`, { success: true, synced: mutations.length }, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mutations })
    });
  }
}
