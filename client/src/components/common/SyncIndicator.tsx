import React from 'react';
import { useOfflineSync } from '../../context/OfflineSyncContext';
import { useLanguage } from '../../context/LanguageContext';
import { CheckCircle2, CloudOff, RefreshCw, AlertCircle } from 'lucide-react';

export const SyncIndicator: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { syncStatus, pendingQueueCount, triggerSync } = useOfflineSync();
  const { t } = useLanguage();

  if (syncStatus === 'synced') {
    return (
      <div className={`inline-flex items-center gap-1.5 ${compact ? 'px-2 py-1' : 'px-2.5 py-1'} rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold whitespace-nowrap`}>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
        <span className={compact ? 'hidden sm:inline' : ''}>{t('online')}</span>
      </div>
    );
  }

  if (syncStatus === 'offline') {
    return (
      <div className={`inline-flex items-center gap-1.5 ${compact ? 'px-2 py-1' : 'px-2.5 py-1'} rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold animate-pulse whitespace-nowrap`}>
        <CloudOff className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
        <span className={compact ? 'hidden sm:inline' : ''}>{t('offline_saved')}</span>
      </div>
    );
  }

  if (syncStatus === 'syncing') {
    return (
      <div className={`inline-flex items-center gap-1.5 ${compact ? 'px-2 py-1' : 'px-2.5 py-1'} rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold whitespace-nowrap`}>
        <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin flex-shrink-0" />
        <span className={compact ? 'hidden sm:inline' : ''}>{t('syncing')} ({pendingQueueCount})</span>
      </div>
    );
  }

  return (
    <button
      onClick={() => triggerSync()}
      className={`inline-flex items-center gap-1.5 ${compact ? 'px-2 py-1' : 'px-2.5 py-1'} rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold hover:bg-red-500/30 transition whitespace-nowrap`}
      title="Tap to retry syncing"
    >
      <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
      <span className={compact ? 'hidden sm:inline' : ''}>{t('sync_failed')}</span>
    </button>
  );
};
