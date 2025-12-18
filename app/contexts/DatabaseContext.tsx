import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  database,
  Word,
  Flashcard,
  Exam,
  DatabaseVersion,
  UpdateCheckResult,
} from "../database";
import { syncService, SyncResult, SyncProgress } from "../services/syncService";
import NetInfo from "@react-native-community/netinfo";

// Database context types
interface DatabaseContextType {
  // Database state
  isInitialized: boolean;
  isOnline: boolean;
  isSyncing: boolean;
  lastSync: number;

  // Sync operations
  fullSync: () => Promise<SyncResult[]>;
  isSyncNeeded: () => Promise<boolean>;
  getSyncStatus: () => Promise<{
    lastSync: number;
    isOnline: boolean;
    isSyncing: boolean;
    entityStatus: Record<
      string,
      { lastSync: number; count: number; version: string } | null
    >;
    databaseVersion?: DatabaseVersion;
    hasUpdate?: boolean;
  }>;

  // Database version operations
  getCurrentDatabaseVersion: () => Promise<DatabaseVersion | null>;
  checkForDatabaseUpdates: () => Promise<UpdateCheckResult>;
  syncDatabaseVersion: () => Promise<boolean>;

  // Data access methods
  getWords: (
    level?: string,
    category?: string,
    limit?: number
  ) => Promise<Word[]>;
  getFlashcards: (
    level?: string,
    category?: string,
    dueOnly?: boolean,
    limit?: number
  ) => Promise<Flashcard[]>;
  getExams: (
    level?: string,
    category?: string,
    activeOnly?: boolean,
    limit?: number
  ) => Promise<Exam[]>;
  getWordById: (id: string) => Promise<Word | null>;
  getFlashcardById: (id: string) => Promise<Flashcard | null>;
  getExamById: (id: string) => Promise<Exam | null>;

  // Update methods
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => Promise<void>;
  saveExamResult: (
    examId: string,
    score: number,
    totalPoints: number,
    answers: any[]
  ) => Promise<void>;

  // Sync progress
  onSyncProgress: (callback: (progress: SyncProgress) => void) => void;
  offSyncProgress: (callback: (progress: SyncProgress) => void) => void;
}

// Create context
const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined
);

// Provider props
interface DatabaseProviderProps {
  children: ReactNode;
}

// Database Provider Component
export function DatabaseProvider({ children }: DatabaseProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(0);

  // Initialize database and sync service
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        // Initialize database
        await database.init();

        // Initialize sync service
        await syncService.init();

        // Set up network monitoring
        const unsubscribe = NetInfo.addEventListener((state) => {
          const online = state.isConnected === true;
          setIsOnline(online);
          syncService.setOnlineStatus(online);
        });

        // Get initial network state
        const netState = await NetInfo.fetch();
        const initialOnline = netState.isConnected === true;
        setIsOnline(initialOnline);
        syncService.setOnlineStatus(initialOnline);

        // Get last sync status
        const syncStatus = await syncService.getSyncStatus();
        setLastSync(syncStatus.lastSync);

        setIsInitialized(true);

        // Cleanup on unmount
        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error("Database initialization failed:", error);
      }
    };

    const cleanup = initializeDatabase();

    return () => {
      cleanup.then((cleanupFn) => {
        if (cleanupFn) cleanupFn();
      });
    };
  }, []);

  // Sync progress handlers
  const handleSyncProgress = (progress: SyncProgress) => {
    // Sync progress can be handled here if needed
    console.log(
      `Sync progress: ${progress.entity} - ${progress.processed}/${progress.total} (${progress.percentage}%)`
    );
  };

  // Full sync
  const fullSync = async (): Promise<SyncResult[]> => {
    setIsSyncing(true);
    try {
      const results = await syncService.fullSync();

      // Update last sync timestamp
      const syncStatus = await syncService.getSyncStatus();
      setLastSync(syncStatus.lastSync);

      return results;
    } finally {
      setIsSyncing(false);
    }
  };

  // Check if sync is needed
  const isSyncNeeded = async (): Promise<boolean> => {
    return await syncService.isSyncNeeded();
  };

  // Get sync status
  const getSyncStatus = async () => {
    return await syncService.getSyncStatus();
  };

  // Database version operations
  const getCurrentDatabaseVersion =
    async (): Promise<DatabaseVersion | null> => {
      return await database.getCurrentDatabaseVersion();
    };

  const checkForDatabaseUpdates = async (): Promise<UpdateCheckResult> => {
    return await syncService.checkForDatabaseUpdates();
  };

  const syncDatabaseVersion = async (): Promise<boolean> => {
    return await syncService.syncDatabaseVersion();
  };

  // Data access methods
  const getWords = async (
    level?: string,
    category?: string,
    limit?: number
  ): Promise<Word[]> => {
    const db = database.getDatabase();

    let query = "SELECT * FROM words WHERE 1=1";
    const params: any[] = [];

    if (level) {
      query += " AND level = ?";
      params.push(level);
    }

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }

    query += " ORDER BY frequency DESC";

    if (limit) {
      query += " LIMIT ?";
      params.push(limit);
    }

    const results = (await db.getAllAsync(query, params)) as any[];

    return results.map((row) => ({
      ...row,
      examples: JSON.parse(row.examples || "[]"),
      translations: JSON.parse(row.translations || "[]"),
      definitions: JSON.parse(row.definitions || "[]"),
      tags: JSON.parse(row.tags || "[]"),
    }));
  };

  const getFlashcards = async (
    level?: string,
    category?: string,
    dueOnly?: boolean,
    limit?: number
  ): Promise<Flashcard[]> => {
    const db = database.getDatabase();

    let query = "SELECT * FROM flashcards WHERE 1=1";
    const params: any[] = [];

    if (level) {
      query += " AND level = ?";
      params.push(level);
    }

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }

    if (dueOnly) {
      query += " AND nextReview <= ?";
      params.push(Date.now());
    }

    query += " ORDER BY nextReview ASC";

    if (limit) {
      query += " LIMIT ?";
      params.push(limit);
    }

    return (await db.getAllAsync(query, params)) as Flashcard[];
  };

  const getExams = async (
    level?: string,
    category?: string,
    activeOnly?: boolean,
    limit?: number
  ): Promise<Exam[]> => {
    const db = database.getDatabase();

    let query = "SELECT * FROM exams WHERE 1=1";
    const params: any[] = [];

    if (level) {
      query += " AND level = ?";
      params.push(level);
    }

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }

    if (activeOnly) {
      query += " AND isActive = 1";
    }

    query += " ORDER BY createdAt DESC";

    if (limit) {
      query += " LIMIT ?";
      params.push(limit);
    }

    const results = (await db.getAllAsync(query, params)) as any[];

    return results.map((row) => ({
      ...row,
      questions: JSON.parse(row.questions || "[]"),
      isActive: row.isActive === 1,
    }));
  };

  const getWordById = async (id: string): Promise<Word | null> => {
    const db = database.getDatabase();

    const result = (await db.getFirstAsync("SELECT * FROM words WHERE id = ?", [
      id,
    ])) as any;

    if (!result) return null;

    return {
      ...result,
      examples: JSON.parse(result.examples || "[]"),
      translations: JSON.parse(result.translations || "[]"),
      definitions: JSON.parse(result.definitions || "[]"),
      tags: JSON.parse(result.tags || "[]"),
    };
  };

  const getFlashcardById = async (id: string): Promise<Flashcard | null> => {
    const db = database.getDatabase();

    return (await db.getFirstAsync("SELECT * FROM flashcards WHERE id = ?", [
      id,
    ])) as Flashcard | null;
  };

  const getExamById = async (id: string): Promise<Exam | null> => {
    const db = database.getDatabase();

    const result = (await db.getFirstAsync("SELECT * FROM exams WHERE id = ?", [
      id,
    ])) as any;

    if (!result) return null;

    return {
      ...result,
      questions: JSON.parse(result.questions || "[]"),
      isActive: result.isActive === 1,
    };
  };

  // Update methods
  const updateFlashcard = async (
    id: string,
    updates: Partial<Flashcard>
  ): Promise<void> => {
    const db = database.getDatabase();

    const fields = [];
    const values = [];

    if (updates.nextReview !== undefined) {
      fields.push("nextReview = ?");
      values.push(updates.nextReview);
    }

    if (updates.reviewCount !== undefined) {
      fields.push("reviewCount = ?");
      values.push(updates.reviewCount);
    }

    if (updates.difficulty !== undefined) {
      fields.push("difficulty = ?");
      values.push(updates.difficulty);
    }

    if (updates.interval !== undefined) {
      fields.push("interval = ?");
      values.push(updates.interval);
    }

    if (updates.easeFactor !== undefined) {
      fields.push("easeFactor = ?");
      values.push(updates.easeFactor);
    }

    fields.push("updatedAt = ?");
    values.push(new Date().toISOString());

    values.push(id);

    await db.runAsync(
      `UPDATE flashcards SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
  };

  const saveExamResult = async (
    examId: string,
    score: number,
    totalPoints: number,
    answers: any[]
  ): Promise<void> => {
    const db = database.getDatabase();
    const resultId = `result_${examId}_${Date.now()}`;

    await db.runAsync(
      `
      INSERT INTO exam_results (
        id, examId, score, totalPoints, passed, answers, startedAt, completedAt, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        resultId,
        examId,
        score,
        totalPoints,
        score >= totalPoints * 0.7 ? 1 : 0, // 70% passing
        JSON.stringify(answers),
        new Date().toISOString(),
        new Date().toISOString(),
        new Date().toISOString(),
      ]
    );
  };

  // Sync progress handlers
  const onSyncProgress = (callback: (progress: SyncProgress) => void) => {
    syncService.onProgress(callback);
  };

  const offSyncProgress = (callback: (progress: SyncProgress) => void) => {
    syncService.offProgress(callback);
  };

  // Context value
  const value: DatabaseContextType = {
    isInitialized,
    isOnline,
    isSyncing,
    lastSync,
    fullSync,
    isSyncNeeded,
    getSyncStatus,
    getCurrentDatabaseVersion,
    checkForDatabaseUpdates,
    syncDatabaseVersion,
    getWords,
    getFlashcards,
    getExams,
    getWordById,
    getFlashcardById,
    getExamById,
    updateFlashcard,
    saveExamResult,
    onSyncProgress,
    offSyncProgress,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}

// Hook to use database context
export function useDatabase(): DatabaseContextType {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
}
