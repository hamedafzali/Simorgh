import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

export interface SyncableData {
  id: string;
  type:
    | "word"
    | "flashcard"
    | "exam"
    | "job"
    | "event"
    | "document"
    | "message"
    | "user_profile";
  data: any;
  lastModified: Date;
  syncStatus: "synced" | "pending" | "failed";
  version: number;
}

export interface SyncQueue {
  id: string;
  action: "create" | "update" | "delete";
  dataType: string;
  dataId: string;
  data: any;
  timestamp: Date;
  retryCount: number;
  status: "pending" | "processing" | "completed" | "failed";
}

class SyncService {
  private static instance: SyncService;
  private isOnline: boolean = false;
  private isSyncing: boolean = false;
  private syncQueue: SyncQueue[] = [];
  private listeners: Array<(isOnline: boolean) => void> = [];

  private constructor() {
    this.initializeNetworkListener();
    this.loadSyncQueue();
  }

  static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  private initializeNetworkListener() {
    NetInfo.addEventListener((state) => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected ?? false;

      this.listeners.forEach((listener) => listener(this.isOnline));

      if (wasOffline && this.isOnline) {
        this.processSyncQueue();
      }
    });
  }

  private async loadSyncQueue() {
    try {
      const queueData = await AsyncStorage.getItem("sync_queue");
      if (queueData) {
        this.syncQueue = JSON.parse(queueData).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
      }
    } catch (error) {
      console.error("Error loading sync queue:", error);
    }
  }

  private async saveSyncQueue() {
    try {
      await AsyncStorage.setItem("sync_queue", JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error("Error saving sync queue:", error);
    }
  }

  public addNetworkListener(listener: (isOnline: boolean) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public getNetworkStatus(): boolean {
    return this.isOnline;
  }

  public getSyncStatus(): boolean {
    return this.isSyncing;
  }

  public async addToSyncQueue(
    action: "create" | "update" | "delete",
    dataType: string,
    dataId: string,
    data: any
  ) {
    const queueItem: SyncQueue = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      action,
      dataType,
      dataId,
      data,
      timestamp: new Date(),
      retryCount: 0,
      status: "pending",
    };

    this.syncQueue.push(queueItem);
    await this.saveSyncQueue();

    if (this.isOnline && !this.isSyncing) {
      this.processSyncQueue();
    }
  }

  private async processSyncQueue() {
    if (this.isSyncing || !this.isOnline || this.syncQueue.length === 0) {
      return;
    }

    this.isSyncing = true;

    try {
      const pendingItems = this.syncQueue.filter(
        (item) => item.status === "pending"
      );

      for (const item of pendingItems) {
        try {
          item.status = "processing";
          await this.saveSyncQueue();

          const success = await this.syncItem(item);

          if (success) {
            item.status = "completed";
            // Remove completed items from queue
            this.syncQueue = this.syncQueue.filter((q) => q.id !== item.id);
          } else {
            item.retryCount++;
            if (item.retryCount >= 3) {
              item.status = "failed";
            } else {
              item.status = "pending";
            }
          }
        } catch (error) {
          console.error("Sync item error:", error);
          item.status = "failed";
        }

        await this.saveSyncQueue();
      }
    } finally {
      this.isSyncing = false;
    }
  }

  private async syncItem(item: SyncQueue): Promise<boolean> {
    // Mock API calls - replace with actual API implementation
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

      // Mock success - in real implementation, this would make actual API calls
      console.log(`Syncing ${item.action} ${item.dataType} ${item.dataId}`);

      return Math.random() > 0.1; // 90% success rate for demo
    } catch (error) {
      console.error("Sync item failed:", error);
      return false;
    }
  }

  public async syncData<T>(dataType: string, data: T[]): Promise<T[]> {
    try {
      const storageKey = `${dataType}_data`;

      if (this.isOnline) {
        // Fetch from server (mock)
        const serverData = await this.fetchFromServer<T>(dataType);
        await AsyncStorage.setItem(storageKey, JSON.stringify(serverData));
        return serverData;
      } else {
        // Load from local storage
        const localData = await AsyncStorage.getItem(storageKey);
        return localData ? JSON.parse(localData) : data;
      }
    } catch (error) {
      console.error("Error syncing data:", error);
      return data;
    }
  }

  private async fetchFromServer<T>(dataType: string): Promise<T[]> {
    // Mock server fetch - replace with actual API calls
    await new Promise((resolve) => setTimeout(resolve, 500));

    switch (dataType) {
      case "words":
        return [] as T[]; // Return empty for demo
      case "flashcards":
        return [] as T[];
      case "exams":
        return [] as T[];
      default:
        return [] as T[];
    }
  }

  public async saveLocalData<T>(dataType: string, data: T[]): Promise<void> {
    try {
      const storageKey = `${dataType}_data`;
      await AsyncStorage.setItem(storageKey, JSON.stringify(data));

      if (this.isOnline) {
        await this.addToSyncQueue("update", dataType, "bulk", data);
      }
    } catch (error) {
      console.error("Error saving local data:", error);
    }
  }

  public async getLocalData<T>(dataType: string): Promise<T[]> {
    try {
      const storageKey = `${dataType}_data`;
      const data = await AsyncStorage.getItem(storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting local data:", error);
      return [];
    }
  }

  public async forceSyncAll(): Promise<boolean> {
    if (!this.isOnline) {
      return false;
    }

    try {
      await this.processSyncQueue();
      return true;
    } catch (error) {
      console.error("Force sync failed:", error);
      return false;
    }
  }

  public getSyncQueueStats(): {
    pending: number;
    failed: number;
    total: number;
  } {
    const pending = this.syncQueue.filter(
      (item) => item.status === "pending"
    ).length;
    const failed = this.syncQueue.filter(
      (item) => item.status === "failed"
    ).length;
    const total = this.syncQueue.length;

    return { pending, failed, total };
  }

  public async clearFailedSyncs(): Promise<void> {
    this.syncQueue = this.syncQueue.filter((item) => item.status !== "failed");
    await this.saveSyncQueue();
  }

  public async retryFailedSyncs(): Promise<void> {
    this.syncQueue.forEach((item) => {
      if (item.status === "failed") {
        item.status = "pending";
        item.retryCount = 0;
      }
    });
    await this.saveSyncQueue();

    if (this.isOnline) {
      await this.processSyncQueue();
    }
  }
}

export default SyncService;
