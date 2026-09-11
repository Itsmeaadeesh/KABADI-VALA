import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { localDB, type SyncMutation } from '../db/dexieDB';
import { ApiService } from '../services/api';

export type SyncState = 'synced' | 'offline' | 'syncing' | 'failed';

interface OfflineSyncContextType {
  isOnline: boolean;
  syncStatus: SyncState;
  pendingQueueCount: number;
  toggleSimulateOffline: () => void;
  triggerSync: () => Promise<void>;
}

const OfflineSyncContext = createContext<OfflineSyncContextType | undefined>(undefined);

export const OfflineSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [actualOnline, setActualOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [simulatedOffline, setSimulatedOffline] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncState>('synced');
  const [pendingQueueCount, setPendingQueueCount] = useState(0);

  const effectiveOnline = actualOnline && !simulatedOffline;

  // Refresh queue count
  const refreshQueueCount = useCallback(async () => {
    try {
      const count = await localDB.syncQueue.count();
      setPendingQueueCount(count);
      if (!effectiveOnline) {
        setSyncStatus('offline');
      } else if (count > 0) {
        setSyncStatus('syncing');
      } else {
        setSyncStatus('synced');
      }
    } catch (e) {
      console.error('Error counting sync queue:', e);
    }
  }, [effectiveOnline]);

  // Sync runner
  const triggerSync = useCallback(async () => {
    if (!effectiveOnline) return;

    try {
      const pendingMutations = await localDB.syncQueue.toArray();
      if (pendingMutations.length === 0) {
        setSyncStatus('synced');
        return;
      }

      setSyncStatus('syncing');
      console.log(`[OfflineSync] Flushing ${pendingMutations.length} mutations from IndexedDB to server...`);

      const res = await ApiService.syncOfflineMutations(pendingMutations);

      if (res && res.success) {
        // Clear successfully synced mutations from queue
        await localDB.syncQueue.clear();
        setPendingQueueCount(0);
        setSyncStatus('synced');
        console.log('[OfflineSync] Batch sync completed successfully');
      } else {
        setSyncStatus('failed');
      }
    } catch (err) {
      console.error('Batch sync error:', err);
      setSyncStatus('failed');
    }
  }, [effectiveOnline]);

  // Listen to network events
  useEffect(() => {
    const handleOnline = () => {
      setActualOnline(true);
      ApiService.setOnlineStatus(!simulatedOffline);
      triggerSync();
    };

    const handleOffline = () => {
      setActualOnline(false);
      ApiService.setOnlineStatus(false);
      setSyncStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    refreshQueueCount();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [simulatedOffline, triggerSync, refreshQueueCount]);

  const toggleSimulateOffline = () => {
    const nextState = !simulatedOffline;
    setSimulatedOffline(nextState);
    const newEffectiveOnline = actualOnline && !nextState;
    ApiService.setOnlineStatus(newEffectiveOnline);

    if (!newEffectiveOnline) {
      setSyncStatus('offline');
    } else {
      triggerSync();
    }
  };

  return (
    <OfflineSyncContext.Provider
      value={{
        isOnline: effectiveOnline,
        syncStatus,
        pendingQueueCount,
        toggleSimulateOffline,
        triggerSync
      }}
    >
      {children}
    </OfflineSyncContext.Provider>
  );
};

export const useOfflineSync = () => {
  const context = useContext(OfflineSyncContext);
  if (!context) throw new Error('useOfflineSync must be used within OfflineSyncProvider');
  return context;
};
