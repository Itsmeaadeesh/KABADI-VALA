import Dexie, { type Table } from 'dexie';
import type { Lot, Transaction, Material } from '../types/schema';

export interface SyncMutation {
  id: string;
  action: 'CREATE_LOT' | 'REQUEST_PICKUP' | 'VERIFY_HANDOVER';
  payload: any;
  timestamp: number;
  retryCount: number;
  status: 'PENDING' | 'SYNCING' | 'FAILED';
}

export class KabadiwalaDatabase extends Dexie {
  lots!: Table<Lot, string>;
  transactions!: Table<Transaction, string>;
  syncQueue!: Table<SyncMutation, string>;
  cachedMaterials!: Table<Material, string>;

  constructor() {
    super('KabadiwalaConnectDB');
    this.version(1).stores({
      lots: 'id, code, collector_id, material_id, status, created_at',
      transactions: 'id, lot_id, collector_id, status, created_at',
      syncQueue: 'id, action, timestamp, status',
      cachedMaterials: 'id, code, category'
    });
  }
}

export const localDB = new KabadiwalaDatabase();
