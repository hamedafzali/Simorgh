import AsyncStorage from "@react-native-async-storage/async-storage";
import { LocalDatabase } from "./local-db";

export interface SyncStatus {
  lastSync: number;
  isOnline: boolean;
  pendingChanges: number;
  conflicts: number;
}

export interface SyncResult {
  success: boolean;
  synced: number;
  errors: string[];
  conflicts: any[];
}

export class SyncService {
  private static instance: SyncService;
  private db = LocalDatabase.getInstance();
  private syncInterval: NodeJS.Timeout | null = null;
  private isOnline = false;

  static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  async getSyncStatus(): Promise<SyncStatus> {
    try {
      const stored = await AsyncStorage.getItem("sync_status");
      if (stored) {
        return JSON.parse(stored);
      }
      
      return {
        lastSync: 0,
        isOnline: false,
        pendingChanges: 0,
        conflicts: 0,
      };
    } catch (error) {
      console.error("Error getting sync status:", error);
      return {
        lastSync: 0,
        isOnline: false,
        pendingChanges: 0,
        conflicts: 0,
      };
    }
  }

  async updateSyncStatus(updates: Partial<SyncStatus>): Promise<void> {
    try {
      const current = await this.getSyncStatus();
      const updated = { ...current, ...updates };
      await AsyncStorage.setItem("sync_status", JSON.stringify(updated));
    } catch (error) {
      console.error("Error updating sync status:", error);
    }
  }

  async startSync(): Promise<SyncResult> {
    const result: SyncResult = {
      success: false,
      synced: 0,
      errors: [],
      conflicts: [],
    };

    try {
      // Check if online
      if (!this.isOnline) {
        result.errors.push("Device is offline");
        return result;
      }

      // Get pending changes
      const pendingChanges = await this.db.getPendingChanges();
      
      if (pendingChanges.length === 0) {
        result.success = true;
        await this.updateSyncStatus({
          lastSync: Date.now(),
          pendingChanges: 0,
        });
        return result;
      }

      // Sync changes to server (mock implementation)
      for (const change of pendingChanges) {
        try {
          await this.syncChangeToServer(change);
          await this.db.markChangeAsSynced(change.id);
          result.synced++;
        } catch (error) {
          result.errors.push(`Failed to sync change ${change.id}: ${error}`);
        }
      }

      // Pull latest data from server
      await this.pullFromServer();

      // Update status
      result.success = result.errors.length === 0;
      await this.updateSyncStatus({
        lastSync: Date.now(),
        pendingChanges: Math.max(0, pendingChanges.length - result.synced),
      });

    } catch (error) {
      result.errors.push(`Sync failed: ${error}`);
    }

    return result;
  }

  async enableAutoSync(intervalMinutes: number = 30): Promise<void> {
    // Clear existing interval
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    // Set up new interval
    this.syncInterval = setInterval(async () => {
      if (this.isOnline) {
        await this.startSync();
      }
    }, intervalMinutes * 60 * 1000);

    await this.updateSyncStatus({ isOnline: true });
  }

  async disableAutoSync(): Promise<void> {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }

    await this.updateSyncStatus({ isOnline: false });
  }

  async setOnlineStatus(isOnline: boolean): Promise<void> {
    this.isOnline = isOnline;
    await this.updateSyncStatus({ isOnline });

    if (isOnline && this.syncInterval) {
      // Trigger immediate sync when coming online
      await this.startSync();
    }
  }

  async forceSync(): Promise<SyncResult> {
    return this.startSync();
  }

  async resolveConflict(conflictId: string, resolution: any): Promise<void> {
    try {
      await this.db.resolveConflict(conflictId, resolution);
      
      const status = await this.getSyncStatus();
      await this.updateSyncStatus({
        conflicts: Math.max(0, status.conflicts - 1),
      });
    } catch (error) {
      console.error("Error resolving conflict:", error);
      throw error;
    }
  }

  private async syncChangeToServer(change: any): Promise<void> {
    // Mock implementation - in real app this would make API calls
    console.log("Syncing change to server:", change);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Simulate occasional sync failures
    if (Math.random() < 0.1) {
      throw new Error("Network error");
    }
  }

  private async pullFromServer(): Promise<void> {
    try {
      // Mock implementation - in real app this would fetch latest data
      console.log("Pulling latest data from server");
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error("Error pulling from server:", error);
    }
  }

  async getPendingChangesCount(): Promise<number> {
    try {
      const pendingChanges = await this.db.getPendingChanges();
      return pendingChanges.length;
    } catch (error) {
      console.error("Error getting pending changes count:", error);
      return 0;
    }
  }

  async getLastSyncTime(): Promise<number> {
    try {
      const status = await this.getSyncStatus();
      return status.lastSync;
    } catch (error) {
      console.error("Error getting last sync time:", error);
      return 0;
    }
  }

  async clearSyncData(): Promise<void> {
    try {
      await AsyncStorage.removeItem("sync_status");
      await this.db.clearPendingChanges();
    } catch (error) {
      console.error("Error clearing sync data:", error);
    }
  }
}

export const syncService = SyncService.getInstance();

// Export individual functions for convenience
export const getSyncStatus = () => syncService.getSyncStatus();
export const startSync = () => syncService.startSync();
export const enableAutoSync = (intervalMinutes?: number) => syncService.enableAutoSync(intervalMinutes);
export const disableAutoSync = () => syncService.disableAutoSync();
export const setOnlineStatus = (isOnline: boolean) => syncService.setOnlineStatus(isOnline);
export const forceSync = () => syncService.forceSync();
export const resolveConflict = (conflictId: string, resolution: any) => 
  syncService.resolveConflict(conflictId, resolution);
export const getPendingChangesCount = () => syncService.getPendingChangesCount();
export const getLastSyncTime = () => syncService.getLastSyncTime();
export const clearSyncData = () => syncService.clearSyncData();
