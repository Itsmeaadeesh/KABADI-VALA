# Kabadiwala Connect — Offline-First Architecture & Sync Engine

**Smart India Hackathon Problem Statement ID: 26229**  
**"Kabadiwala Connect – Bringing the Informal Collector into the Formal Recycling Chain"**

---

## 1. The Challenge in Emerging Markets

Informal waste pickers and scrap dealers frequently operate in dense, shielded urban slums, peri-urban landfill peripheries, and transit hubs with intermittent or zero cellular connectivity (2G/3G dead zones). 

A traditional web app that blocks submissions on network timeouts leads to:
- Abandoned transactions
- Collectors reverting to informal cash middlemen
- Permanent loss of lot handover proof

**Kabadiwala Connect** implements a resilient **Offline-First Reactive Architecture** where every critical write operation occurs locally first in browser IndexedDB via **Dexie.js**, while a background synchronization manager orchestrates reconciliation once connectivity is restored.

---

## 2. Sync Engine Architecture Flow

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        COLLECTOR ACTION (e.g., Sell Lot)               │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               IndexedDB (Dexie.js) Local Mutation Store                │
│                                                                        │
│  1. Insert into local `lots` table with status: "LOCAL_PENDING_SYNC"  │
│  2. Enqueue into `syncQueue` with UUID, timestamp, and action payload  │
│  3. Optimistically update UI & Khata balance immediately               │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                         Is Browser Online?
                         /               \
                       YES                NO
                       /                    \
                      ▼                      ▼
┌───────────────────────────────┐ ┌──────────────────────────────────────┐
│ Trigger Background Batch Sync │ │ Display Badge:                       │
│ POST /api/sync/batch          │ │ 🟠 Offline — Saved Locally           │
│                               │ │ Listen to 'online' event / heartbeat │
└──────────────┬────────────────┘ └──────────────────┬───────────────────┘
               │                                     │
               ▼                                     │
┌───────────────────────────────┐                    │
│     Backend Reconciliation    │                    │
│ • Idempotent UUID resolution  │                    │
│ • Conflict resolution (server)│                    │
│ • Traceability event logged   │                    │
└──────────────┬────────────────┘                    │
               │                                     │
             SUCCESS                                 │
               │                                     │
               ▼                                     ▼
┌───────────────────────────────┐ ┌──────────────────────────────────────┐
│ Clear item from `syncQueue`   │ │ Reconnection detected!               │
│ Update local status: "SYNCED" │ │ Batch sync automatically fires       │
│ Display Badge: 🟢 Synced     │ │ Progress indicator: 🔄 Syncing...    │
└───────────────────────────────┘ └──────────────────────────────────────┘
```

---

## 3. Local IndexedDB Schema (Dexie.js)

```typescript
export class KabadiwalaDatabase extends Dexie {
  lots!: Table<LocalLot>;
  transactions!: Table<LocalTransaction>;
  syncQueue!: Table<SyncQueueItem>;
  cachedPrices!: Table<CachedPrice>;
  cachedRecyclers!: Table<CachedRecycler>;

  constructor() {
    super('KabadiwalaConnectDB');
    this.version(1).stores({
      lots: 'id, collectorId, materialId, status, createdAt',
      transactions: 'id, lotId, status, createdAt',
      syncQueue: 'id, action, timestamp, retryCount',
      cachedPrices: 'materialId, benchmarkRate, updatedAt',
      cachedRecyclers: 'id, name, distance'
    });
  }
}
```

---

## 4. UI Indicators & Low-Literacy Messaging

Visual cues replace cryptic technical alerts:

| State | Visual Indicator | Low-Literacy Vernacular Message |
| :--- | :--- | :--- |
| **Online & Synced** | 🟢 **Synced** | “सब कुछ सुरक्षित है” / “डेटा सेव्ह झाला आहे” |
| **Offline Mode** | 🟠 **Offline — Saved Locally** | “इंटरनेट नहीं है। डेटा फ़ोन में सुरक्षित है। इंटरनेट आते ही भेज देंगे।” |
| **Syncing in Progress** | 🔄 **Syncing 3 records...** | “डेटा सर्वर पर भेजा जा रहा है...” |
| **Network Error / Retry** | 🔴 **Sync failed — Tap to retry** | “सर्वर से संपर्क नहीं हुआ। पुनः प्रयास करें।” |

Refreshing the browser never discards locally created lots, photos, or transaction records.
