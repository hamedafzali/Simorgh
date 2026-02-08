import { useState, useEffect } from "react";
import SyncService from "../services/sync-service";

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  queueStats: {
    pending: number;
    failed: number;
    total: number;
  };
}

export const useSync = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: false,
    isSyncing: false,
    queueStats: {
      pending: 0,
      failed: 0,
      total: 0,
    },
  });

  const syncService = SyncService.getInstance();

  useEffect(() => {
    const updateStatus = () => {
      setSyncStatus({
        isOnline: syncService.getNetworkStatus(),
        isSyncing: syncService.getSyncStatus(),
        queueStats: syncService.getSyncQueueStats(),
      });
    };

    updateStatus();

    const unsubscribe = syncService.addNetworkListener(updateStatus);

    const interval = setInterval(updateStatus, 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [syncService]);

  const forceSyncAll = async () => {
    const success = await syncService.forceSyncAll();
    setSyncStatus({
      isOnline: syncService.getNetworkStatus(),
      isSyncing: syncService.getSyncStatus(),
      queueStats: syncService.getSyncQueueStats(),
    });
    return success;
  };

  const clearFailedSyncs = async () => {
    await syncService.clearFailedSyncs();
    setSyncStatus({
      isOnline: syncService.getNetworkStatus(),
      isSyncing: syncService.getSyncStatus(),
      queueStats: syncService.getSyncQueueStats(),
    });
  };

  const retryFailedSyncs = async () => {
    await syncService.retryFailedSyncs();
    setSyncStatus({
      isOnline: syncService.getNetworkStatus(),
      isSyncing: syncService.getSyncStatus(),
      queueStats: syncService.getSyncQueueStats(),
    });
  };

  return {
    ...syncStatus,
    forceSyncAll,
    clearFailedSyncs,
    retryFailedSyncs,
    syncService,
  };
};
