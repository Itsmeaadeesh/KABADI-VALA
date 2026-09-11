import React from 'react';
import { useOfflineSync } from '../../context/OfflineSyncContext';
import { useLanguage } from '../../context/LanguageContext';
import { CheckCircle2, CloudOff, RefreshCw, AlertCircle } from 'lucide-react';

export const SyncIndicator: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { syncStatus, pendingQueueCount, triggerSync } = useOfflineSync();
  const { t } = useLanguage();

  if (syncStatus === 'synced') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>{compact ? 'Synced' : t('online')}</span>
      </div>
    );
  }

  if (syncStatus === 'offline') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-semibold animate-pulse">
        <CloudOff className="w-3.5 h-3.5 text-amber-600" />
        <span>{compact ? 'Offline' : t('offline_saved')}</span>
      </div>
    );
  }

  if (syncStatus === 'syncing') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
        <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
        <span>{compact ? 'Syncing...' : `${t('syncing')} (${pendingQueueCount})`}</span>
      </div>
    );
  }

  return (
    <button
      onClick={() => triggerSync()}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-300 text-xs font-semibold hover:bg-red-100 transition"
      title="Tap to retry syncing"
    >
      <AlertCircle className="w-3.5 h-3.5 text-red-600" />
      <span>{compact ? 'Retry' : t('sync_failed')}</span>
    </button>
  );
};
