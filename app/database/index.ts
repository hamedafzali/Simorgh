import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";

// Database configuration
export const DB_NAME = "simorgh_local.db";
export const DB_VERSION = "1.0.0";
export const BACKEND_BASE_URL = "http://192.168.178.78:3001/api";

// Database interface definitions
export interface Word {
  id: string;
  german: string;
  english: string;
  article?: string;
  wordType: string;
  level: string;
  frequency: number;
  examples: string[];
  category: string;
  phonetic?: string;
  translations: Array<{
    language: string;
    text: string;
    isPrimary: boolean;
  }>;
  definitions: Array<{
    text: string;
    example?: string;
    level: string;
  }>;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  type: string;
  level: string;
  category: string;
  wordId?: string;
  nextReview: number;
  reviewCount: number;
  difficulty: number;
  interval: number;
  easeFactor: number;
  createdAt: string;
  updatedAt: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  duration: number;
  questionCount: number;
  passingScore: number;
  maxAttempts: number;
  questions: ExamQuestion[];
  instructions: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExamQuestion {
  id: string;
  question: string;
  type: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  points: number;
  orderIndex: number;
}

export interface UserSettings {
  id: string;
  key: string;
  value: string;
  updatedAt: string;
}

export interface SyncTracking {
  id: string;
  entityType: string;
  lastSyncTimestamp: number;
  lastSyncVersion: string;
  syncedCount: number;
  updatedAt: string;
}

export interface DatabaseVersion {
  version: string;
  buildNumber: number;
  isPublished: boolean;
  isForced: boolean;
  description: string;
  changelog: string[];
  releaseDate: string;
  minAppVersion: string;
  dataStats: {
    words: number;
    flashcards: number;
    exams: number;
    exercises: number;
  };
}

export interface UpdateCheckResult {
  hasUpdate: boolean;
  isForced: boolean;
  currentVersion: string;
  latestVersion?: DatabaseVersion;
  appVersionCompatible: boolean;
  reason: string;
}

export interface ExamResult {
  id: string;
  examId: string;
  score: number;
  totalPoints: number;
  passed: boolean;
  answers: Array<{
    questionId: string;
    answer: string | number;
    isCorrect: boolean;
    points: number;
  }>;
  startedAt: string;
  completedAt: string;
  createdAt: string;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  // Initialize database
  async init(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync(DB_NAME);
      await this.createTables();
      console.log("Database initialized successfully");
    } catch (error) {
      console.error("Database initialization failed:", error);
      throw error;
    }
  }

  // Create database tables
  private async createTables(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    // Database version table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS database_version (
        id TEXT PRIMARY KEY,
        version TEXT NOT NULL UNIQUE,
        buildNumber INTEGER NOT NULL,
        isPublished INTEGER DEFAULT 0,
        isForced INTEGER DEFAULT 0,
        description TEXT,
        changelog TEXT,
        releaseDate TEXT,
        minAppVersion TEXT,
        dataStats TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);

    // Words table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS words (
        id TEXT PRIMARY KEY,
        german TEXT NOT NULL,
        english TEXT NOT NULL,
        article TEXT,
        wordType TEXT NOT NULL,
        level TEXT NOT NULL,
        frequency INTEGER DEFAULT 1,
        examples TEXT,
        category TEXT DEFAULT 'general',
        phonetic TEXT,
        translations TEXT,
        definitions TEXT,
        tags TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);

    // Flashcards table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS flashcards (
        id TEXT PRIMARY KEY,
        front TEXT NOT NULL,
        back TEXT NOT NULL,
        type TEXT DEFAULT 'general',
        level TEXT DEFAULT 'A1',
        category TEXT DEFAULT 'general',
        wordId TEXT,
        nextReview INTEGER DEFAULT ${Date.now()},
        reviewCount INTEGER DEFAULT 0,
        difficulty INTEGER DEFAULT 1,
        interval INTEGER DEFAULT 1,
        easeFactor REAL DEFAULT 2.5,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (wordId) REFERENCES words(id)
      );
    `);

    // Exams table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS exams (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        level TEXT NOT NULL,
        category TEXT,
        duration INTEGER NOT NULL,
        questionCount INTEGER NOT NULL,
        passingScore INTEGER NOT NULL,
        maxAttempts INTEGER DEFAULT 3,
        questions TEXT NOT NULL,
        instructions TEXT,
        isActive INTEGER DEFAULT 1,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);

    // User settings table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_settings (
        id TEXT PRIMARY KEY,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);

    // Sync tracking table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS sync_tracking (
        id TEXT PRIMARY KEY,
        entityType TEXT UNIQUE NOT NULL,
        lastSyncTimestamp INTEGER NOT NULL,
        lastSyncVersion TEXT NOT NULL,
        syncedCount INTEGER DEFAULT 0,
        updatedAt TEXT NOT NULL
      );
    `);

    // Exam results table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS exam_results (
        id TEXT PRIMARY KEY,
        examId TEXT NOT NULL,
        score INTEGER NOT NULL,
        totalPoints INTEGER NOT NULL,
        passed INTEGER NOT NULL,
        answers TEXT NOT NULL,
        startedAt TEXT NOT NULL,
        completedAt TEXT,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (examId) REFERENCES exams(id)
      );
    `);

    // Create indexes for performance
    await this.db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_words_level ON words(level);
      CREATE INDEX IF NOT EXISTS idx_words_category ON words(category);
      CREATE INDEX IF NOT EXISTS idx_words_frequency ON words(frequency);
      CREATE INDEX IF NOT EXISTS idx_flashcards_level ON flashcards(level);
      CREATE INDEX IF NOT EXISTS idx_flashcards_nextReview ON flashcards(nextReview);
      CREATE INDEX IF NOT EXISTS idx_flashcards_category ON flashcards(category);
      CREATE INDEX IF NOT EXISTS idx_exams_level ON exams(level);
      CREATE INDEX IF NOT EXISTS idx_exams_category ON exams(category);
      CREATE INDEX IF NOT EXISTS idx_exam_results_examId ON exam_results(examId);
    `);
  }

  // Get database instance
  getDatabase(): SQLite.SQLiteDatabase {
    if (!this.db) {
      throw new Error("Database not initialized. Call init() first.");
    }
    return this.db;
  }

  // Close database
  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
      console.log("Database closed");
    }
  }

  // Reset database (for testing/debugging)
  async reset(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    await this.db.execAsync(`
      DROP TABLE IF EXISTS exam_results;
      DROP TABLE IF EXISTS sync_tracking;
      DROP TABLE IF EXISTS user_settings;
      DROP TABLE IF EXISTS exams;
      DROP TABLE IF EXISTS flashcards;
      DROP TABLE IF EXISTS words;
      DROP TABLE IF EXISTS database_version;
    `);

    await this.createTables();
    console.log("Database reset completed");
  }

  // Database version management
  async getCurrentDatabaseVersion(): Promise<DatabaseVersion | null> {
    if (!this.db) throw new Error("Database not initialized");

    try {
      const result = (await this.db.getFirstAsync(`
        SELECT * FROM database_version WHERE isPublished = 1 ORDER BY buildNumber DESC LIMIT 1
      `)) as any;

      if (!result) return null;

      return {
        version: result.version,
        buildNumber: result.buildNumber,
        isPublished: Boolean(result.isPublished),
        isForced: Boolean(result.isForced),
        description: result.description,
        changelog: JSON.parse(result.changelog || "[]"),
        releaseDate: result.releaseDate,
        minAppVersion: result.minAppVersion,
        dataStats: JSON.parse(result.dataStats || "{}"),
      };
    } catch (error) {
      console.error("Failed to get current database version:", error);
      return null;
    }
  }

  async saveDatabaseVersion(version: DatabaseVersion): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    await this.db.runAsync(
      `
      INSERT OR REPLACE INTO database_version (
        id, version, buildNumber, isPublished, isForced, description, changelog,
        releaseDate, minAppVersion, dataStats, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        `version_${version.version}`,
        version.version,
        version.buildNumber,
        version.isPublished ? 1 : 0,
        version.isForced ? 1 : 0,
        version.description,
        JSON.stringify(version.changelog),
        version.releaseDate,
        version.minAppVersion,
        JSON.stringify(version.dataStats),
        new Date().toISOString(),
        new Date().toISOString(),
      ]
    );
  }

  async checkForDatabaseUpdates(
    currentVersion: string,
    appVersion?: string
  ): Promise<UpdateCheckResult> {
    try {
      // Check if backend is accessible by testing connection first
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // Increased to 10 seconds timeout

      const response = await fetch(
        `${BACKEND_BASE_URL}/database-version/check-update/${currentVersion}${
          appVersion ? `?appVersion=${appVersion}` : ""
        }`,
        {
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Failed to check for database updates:", error);

      // Handle different types of network errors
      if (
        error instanceof TypeError &&
        error.message.includes("Network request failed")
      ) {
        // Return mock data for testing when backend is unavailable
        console.log("Backend server unavailable - using mock data for testing");

        // For testing: simulate an update available after a few checks
        const shouldSimulateUpdate = Math.random() > 0.7; // 30% chance to simulate update

        if (shouldSimulateUpdate && currentVersion === "1.0.0") {
          return {
            hasUpdate: true,
            isForced: false,
            currentVersion,
            latestVersion: {
              version: "1.1.0",
              buildNumber: 2,
              isPublished: true,
              isForced: false,
              description: "Test update with new vocabulary words",
              changelog: [
                "Added 50 new German vocabulary words",
                "Improved flashcard algorithm",
                "Fixed sync issues",
              ],
              releaseDate: new Date().toISOString(),
              minAppVersion: "1.0.0",
              dataStats: {
                words: 150,
                flashcards: 75,
                exams: 10,
                exercises: 25,
              },
            },
            appVersionCompatible: true,
            reason: "Mock update for testing",
          };
        }

        return {
          hasUpdate: false,
          isForced: false,
          currentVersion,
          appVersionCompatible: true,
          reason: "Backend server unavailable - using mock data",
        };
      }

      if (error.name === "AbortError") {
        return {
          hasUpdate: false,
          isForced: false,
          currentVersion,
          appVersionCompatible: true,
          reason: "Connection timeout - increased to 10s",
        };
      }

      return {
        hasUpdate: false,
        isForced: false,
        currentVersion,
        appVersionCompatible: true,
        reason: "Failed to check for updates",
      };
    }
  }
}

// Export singleton instance
export const database = new DatabaseService();
