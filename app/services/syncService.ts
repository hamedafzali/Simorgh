import {
  database,
  Word,
  Flashcard,
  Exam,
  SyncTracking,
  DatabaseVersion,
  UpdateCheckResult,
} from "../database";
import { NetInfoState } from "@react-native-community/netinfo";
import { API_BASE_URL } from "../config/api";
import { saveFeatureFlags } from "./features";
import { track } from "./analytics";

// Backend API configuration
const BACKEND_BASE_URL = API_BASE_URL;

// App version (should match package.json)
const APP_VERSION = "1.0.0";

// Sync configuration
export interface SyncConfig {
  autoSync: boolean;
  syncInterval: number; // in minutes
  requireWifi: boolean;
  lastSyncTimestamp: number;
}

export interface SyncResult {
  entityType: "words" | "flashcards" | "exams";
  success: boolean;
  syncedCount: number;
  error?: string;
  timestamp: number;
}

export interface SyncProgress {
  entity: string;
  processed: number;
  total: number;
  percentage: number;
}

function isNetworkError(error: unknown): boolean {
  return (
    error instanceof TypeError ||
    (error instanceof Error && (error.name === "AbortError" || /network request failed|network request timed out|aborted/i.test(error.message)))
  );
}

class SyncService {
  private isOnline: boolean = true;
  private isSyncing: boolean = false;
  private syncProgressCallbacks: ((progress: SyncProgress) => void)[] = [];

  // Initialize sync service
  async init(): Promise<void> {
    try {
      await database.init();
      await this.loadSyncConfig();
      console.log("Sync service initialized");
    } catch (error) {
      console.error("Sync service initialization failed:", error);
      throw error;
    }
  }

  // Set online/offline status
  setOnlineStatus(isOnline: boolean): void {
    this.isOnline = isOnline;
    console.log("Network status changed:", isOnline ? "online" : "offline");
  }

  // Register progress callback
  onProgress(callback: (progress: SyncProgress) => void): void {
    this.syncProgressCallbacks.push(callback);
  }

  // Remove progress callback
  offProgress(callback: (progress: SyncProgress) => void): void {
    const index = this.syncProgressCallbacks.indexOf(callback);
    if (index > -1) {
      this.syncProgressCallbacks.splice(index, 1);
    }
  }

  // Notify progress callbacks
  private notifyProgress(progress: SyncProgress): void {
    this.syncProgressCallbacks.forEach((callback) => callback(progress));
  }

  // Load sync configuration
  private async loadSyncConfig(): Promise<SyncConfig> {
    const db = database.getDatabase();

    try {
      const result = (await db.getFirstAsync(`
        SELECT value FROM user_settings WHERE key = 'sync_config'
      `)) as { value: string } | undefined;

      if (result) {
        return JSON.parse(result.value);
      }
    } catch (error) {
      console.log("No sync config found, using defaults");
    }

    // Default configuration
    const defaultConfig: SyncConfig = {
      autoSync: true,
      syncInterval: 60, // 1 hour
      requireWifi: false,
      lastSyncTimestamp: 0,
    };

    await this.saveSyncConfig(defaultConfig);
    return defaultConfig;
  }

  // Save sync configuration
  async saveSyncConfig(config: SyncConfig): Promise<void> {
    const db = database.getDatabase();

    await db.runAsync(
      `
      INSERT OR REPLACE INTO user_settings (id, key, value, updatedAt)
      VALUES (?, ?, ?, ?)
    `,
      [
        "sync_config",
        "sync_config",
        JSON.stringify(config),
        new Date().toISOString(),
      ]
    );
  }

  // Get last sync info for entity type
  private async getLastSync(entityType: string): Promise<SyncTracking | null> {
    const db = database.getDatabase();

    try {
      const result = (await db.getFirstAsync(
        `
        SELECT * FROM sync_tracking WHERE entityType = ?
      `,
        [entityType]
      )) as SyncTracking | undefined;

      return result || null;
    } catch (error) {
      console.error(`Failed to get last sync for ${entityType}:`, error);
      return null;
    }
  }

  // Update sync tracking
  private async updateSyncTracking(
    entityType: string,
    version: string,
    count: number
  ): Promise<void> {
    const db = database.getDatabase();
    const now = Date.now();

    await db.runAsync(
      `
      INSERT OR REPLACE INTO sync_tracking (id, entityType, lastSyncTimestamp, lastSyncVersion, syncedCount, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [
        `sync_${entityType}`,
        entityType,
        now,
        version,
        count,
        new Date().toISOString(),
      ]
    );
  }

  // Fetch data from backend
  private async fetchFromBackend<T>(endpoint: string): Promise<T[]> {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}${endpoint}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return Array.isArray(data)
        ? data
        : data.items || data.words || data.flashcards || data.exams || [];
    } catch (error) {
      console.error(`Failed to fetch from ${endpoint}:`, error);
      throw error;
    }
  }

  // Sync words
  private async syncWords(): Promise<SyncResult> {
    const startTime = Date.now();
    let syncedCount = 0;

    try {
      // Fetch words from backend
      const backendWords = await this.fetchFromBackend<any>("/database/words");
      this.notifyProgress({
        entity: "words",
        processed: 0,
        total: backendWords.length,
        percentage: 0,
      });

      const db = database.getDatabase();

      // Begin transaction
      await db.execAsync("BEGIN TRANSACTION");

      try {
        for (let i = 0; i < backendWords.length; i++) {
          const word = backendWords[i];

          await db.runAsync(
            `
            INSERT OR REPLACE INTO words (
              id, german, english, article, wordType, level, frequency,
              examples, category, phonetic, translations, definitions, tags,
              createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
            [
              word.id,
              word.german,
              word.english,
              word.article || "",
              word.category || "general", // Using category as wordType for now
              word.level || "A1",
              word.frequency || 1,
              JSON.stringify(word.examples || []),
              word.category || "general",
              word.phonetic || "",
              JSON.stringify(word.translations || []),
              JSON.stringify(word.definitions || []),
              JSON.stringify(word.tags || []),
              new Date().toISOString(),
              new Date().toISOString(),
            ]
          );

          syncedCount++;

          // Update progress
          if (i % 10 === 0 || i === backendWords.length - 1) {
            this.notifyProgress({
              entity: "words",
              processed: i + 1,
              total: backendWords.length,
              percentage: Math.round(((i + 1) / backendWords.length) * 100),
            });
          }
        }

        await db.execAsync("COMMIT");
      } catch (error) {
        await db.execAsync("ROLLBACK");
        throw error;
      }

      // Update sync tracking
      await this.updateSyncTracking("words", "1.0.0", syncedCount);

      return {
        entityType: "words",
        success: true,
        syncedCount,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error("Words sync failed:", error);
      return {
        entityType: "words",
        success: false,
        syncedCount: 0,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: Date.now(),
      };
    }
  }

  // Sync flashcards
  private async syncFlashcards(): Promise<SyncResult> {
    const startTime = Date.now();
    let syncedCount = 0;

    try {
      // Fetch flashcards from backend
      const backendFlashcards = await this.fetchFromBackend<any>(
        "/database/flashcards"
      );
      this.notifyProgress({
        entity: "flashcards",
        processed: 0,
        total: backendFlashcards.length,
        percentage: 0,
      });

      const db = database.getDatabase();

      // Begin transaction
      await db.execAsync("BEGIN TRANSACTION");

      try {
        for (let i = 0; i < backendFlashcards.length; i++) {
          const flashcard = backendFlashcards[i];

          await db.runAsync(
            `
            INSERT OR REPLACE INTO flashcards (
              id, front, back, type, level, category, wordId,
              nextReview, reviewCount, difficulty, interval, easeFactor,
              createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
            [
              flashcard.id,
              flashcard.front,
              flashcard.back,
              flashcard.type || "general",
              flashcard.level || "A1",
              flashcard.category || "general",
              flashcard.wordId || null,
              flashcard.nextReview || Date.now(),
              flashcard.reviewCount || 0,
              flashcard.difficulty || 1,
              flashcard.interval || 1,
              flashcard.easeFactor || 2.5,
              new Date().toISOString(),
              new Date().toISOString(),
            ]
          );

          syncedCount++;

          // Update progress
          if (i % 10 === 0 || i === backendFlashcards.length - 1) {
            this.notifyProgress({
              entity: "flashcards",
              processed: i + 1,
              total: backendFlashcards.length,
              percentage: Math.round(
                ((i + 1) / backendFlashcards.length) * 100
              ),
            });
          }
        }

        await db.execAsync("COMMIT");
      } catch (error) {
        await db.execAsync("ROLLBACK");
        throw error;
      }

      // Update sync tracking
      await this.updateSyncTracking("flashcards", "1.0.0", syncedCount);

      return {
        entityType: "flashcards",
        success: true,
        syncedCount,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error("Flashcards sync failed:", error);
      return {
        entityType: "flashcards",
        success: false,
        syncedCount: 0,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: Date.now(),
      };
    }
  }

  // Sync exams
  private async syncExams(): Promise<SyncResult> {
    const startTime = Date.now();
    let syncedCount = 0;

    try {
      // Fetch exams from backend
      const backendExams = await this.fetchFromBackend<any>("/database/exams");
      this.notifyProgress({
        entity: "exams",
        processed: 0,
        total: backendExams.length,
        percentage: 0,
      });

      const db = database.getDatabase();

      // Begin transaction
      await db.execAsync("BEGIN TRANSACTION");

      try {
        for (let i = 0; i < backendExams.length; i++) {
          const exam = backendExams[i];

          await db.runAsync(
            `
            INSERT OR REPLACE INTO exams (
              id, title, description, level, category, duration,
              questionCount, passingScore, maxAttempts, questions,
              instructions, isActive, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
            [
              exam.id,
              exam.title,
              exam.description || "",
              exam.level || "A1",
              exam.category || "general",
              exam.duration || 30,
              exam.questionCount || 0,
              exam.passingScore || 70,
              exam.maxAttempts || 3,
              JSON.stringify(exam.questions || []),
              exam.instructions || "",
              exam.isActive !== false ? 1 : 0,
              new Date().toISOString(),
              new Date().toISOString(),
            ]
          );

          syncedCount++;

          // Update progress
          if (i % 5 === 0 || i === backendExams.length - 1) {
            this.notifyProgress({
              entity: "exams",
              processed: i + 1,
              total: backendExams.length,
              percentage: Math.round(((i + 1) / backendExams.length) * 100),
            });
          }
        }

        await db.execAsync("COMMIT");
      } catch (error) {
        await db.execAsync("ROLLBACK");
        throw error;
      }

      // Update sync tracking
      await this.updateSyncTracking("exams", "1.0.0", syncedCount);

      return {
        entityType: "exams",
        success: true,
        syncedCount,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error("Exams sync failed:", error);
      return {
        entityType: "exams",
        success: false,
        syncedCount: 0,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: Date.now(),
      };
    }
  }

  // Full sync all entities
  async fullSync(): Promise<SyncResult[]> {
    if (!this.isOnline) {
      throw new Error("Cannot sync while offline");
    }

    if (this.isSyncing) {
      throw new Error("Sync already in progress");
    }

    this.isSyncing = true;
    const results: SyncResult[] = [];

    try {
      console.log("Starting full database sync...");

      // Sync in order: words -> flashcards -> exams
      const syncOperations = [
        () => this.syncWords(),
        () => this.syncFlashcards(),
        () => this.syncExams(),
      ];

      for (const operation of syncOperations) {
        try {
          const result = await operation();
          results.push(result);

          if (!result.success) {
            console.error(
              `Sync failed for ${result.entityType}:`,
              result.error
            );
          } else {
            console.log(`Synced ${result.syncedCount} ${result.entityType}`);
          }
        } catch (error) {
          console.error("Sync operation failed:", error);
          // Continue with other operations even if one fails
        }
      }

      // Update last sync timestamp
      const config = await this.loadSyncConfig();
      config.lastSyncTimestamp = Date.now();
      await this.saveSyncConfig(config);

      console.log("Full sync completed");
      const failed = results.filter((r) => !r.success);
      void track(failed.length === 0 ? "sync_completed" : "sync_failed", {
        synced: results.filter((r) => r.success).map((r) => r.entityType),
        failed: failed.map((r) => ({ entity: r.entityType, error: r.error })),
      });
      return results;
    } finally {
      this.isSyncing = false;
    }
  }

  // Check if sync is needed
  async isSyncNeeded(): Promise<boolean> {
    const config = await this.loadSyncConfig();

    if (!config.autoSync || !this.isOnline) {
      return false;
    }

    const timeSinceLastSync = Date.now() - config.lastSyncTimestamp;
    const syncIntervalMs = config.syncInterval * 60 * 1000; // Convert minutes to ms

    return timeSinceLastSync > syncIntervalMs;
  }

  // Check for database version updates
  async checkForDatabaseUpdates(): Promise<UpdateCheckResult> {
    if (!this.isOnline) {
      return {
        hasUpdate: false,
        isForced: false,
        currentVersion: "1.0.0",
        appVersionCompatible: true,
        reason: "Offline",
      };
    }

    try {
      const currentVersion = await database.getCurrentDatabaseVersion();
      const currentVersionString = currentVersion?.version || "1.0.0";

      return await database.checkForDatabaseUpdates(
        currentVersionString,
        APP_VERSION
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      console.warn("Database update check failed:", message);

      if (error instanceof Error && error.name === "AbortError") {
        return {
          hasUpdate: false,
          isForced: false,
          currentVersion: "1.0.0",
          appVersionCompatible: true,
          reason: "Connection timeout",
        };
      }

      if (isNetworkError(error)) {
        return {
          hasUpdate: false,
          isForced: false,
          currentVersion: "1.0.0",
          appVersionCompatible: true,
          reason: "Backend server unavailable",
        };
      }

      return {
        hasUpdate: false,
        isForced: false,
        currentVersion: "1.0.0",
        appVersionCompatible: true,
        reason: "Failed to check for updates",
      };
    }
  }

  // Sync database version update
  async syncDatabaseVersion(): Promise<boolean> {
    if (!this.isOnline) {
      return false;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${BACKEND_BASE_URL}/database-version/current`, {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const latestVersion = await response.json();

      await database.saveDatabaseVersion(latestVersion);
      await saveFeatureFlags(latestVersion.featureFlags);

      console.log(`Database version updated to ${latestVersion.version}`);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      if (isNetworkError(error)) {
        console.warn("Database version sync skipped:", message);
      } else {
        console.error("Failed to sync database version:", error);
      }
      return false;
    }
  }

  // Get sync status
  async getSyncStatus(): Promise<{
    lastSync: number;
    isOnline: boolean;
    isSyncing: boolean;
    entityStatus: Record<
      string,
      { lastSync: number; count: number; version: string } | null
    >;
    databaseVersion?: DatabaseVersion;
    hasUpdate?: boolean;
  }> {
    const config = await this.loadSyncConfig();
    const entities = ["words", "flashcards", "exams"];
    const entityStatus: Record<
      string,
      { lastSync: number; count: number; version: string } | null
    > = {};

    for (const entity of entities) {
      const tracking = await this.getLastSync(entity);
      if (tracking) {
        entityStatus[entity] = {
          lastSync: tracking.lastSyncTimestamp,
          count: tracking.syncedCount,
          version: tracking.lastSyncVersion,
        };
      } else {
        entityStatus[entity] = null;
      }
    }

    const dbVersion = await database.getCurrentDatabaseVersion();

    return {
      lastSync: config.lastSyncTimestamp,
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      entityStatus,
      databaseVersion: dbVersion || undefined,
    };
  }
}

// Export singleton instance
export const syncService = new SyncService();
