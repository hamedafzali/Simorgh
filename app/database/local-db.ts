import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DatabaseSchema,
  DatabaseVersion,
  Exam,
  Flashcard,
  Word,
  UserSettings,
  ExamResult,
} from "./types";

const DB_KEY = "simorgh_local_database";
const DB_VERSION_KEY = "simorgh_db_version";

export class LocalDatabase {
  private static instance: LocalDatabase;
  private db: DatabaseSchema | null = null;
  private currentVersion: DatabaseVersion = {
    version: "1.0.0",
    timestamp: Date.now(),
    description: "Initial database with exams and flashcards",
  };

  static getInstance(): LocalDatabase {
    if (!LocalDatabase.instance) {
      LocalDatabase.instance = new LocalDatabase();
    }
    return LocalDatabase.instance;
  }

  async initialize(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(DB_KEY);
      if (stored) {
        this.db = JSON.parse(stored);
        console.log("Local database loaded:", this.db?.version?.version);
      } else {
        await this.createEmptyDatabase();
      }
    } catch (error) {
      console.error("Failed to initialize local database:", error);
      await this.createEmptyDatabase();
    }
  }

  private async createEmptyDatabase(): Promise<void> {
    this.db = {
      version: this.currentVersion,
      exams: [],
      flashcards: [],
      words: [],
      userSettings: {
        preferredLanguage: "en",
        notificationsEnabled: true,
        studyReminders: true,
        locationmostRecent: null,
        theme: "auto",
      },
      examResults: [],
      lastSync: 0,
    };
    await this.save();
  }

  async save(): Promise<void> {
    if (this.db) {
      await AsyncStorage.setItem(DB_KEY, JSON.stringify(this.db));
    }
  }

  async checkVersion(serverVersion: DatabaseVersion): Promise<boolean> {
    if (!this.db) return true;

    const currentVersion = this.db.version.version;
    const serverVersionStr = serverVersion.version;

    return currentVersion !== serverVersionStr;
  }

  async updateDatabase(
    newData: Partial<DatabaseSchema>,
    newVersion: DatabaseVersion
  ): Promise<void> {
    if (!this.db) return;

    // Preserve user settings and results
    const preservedSettings = this.db.userSettings;
    const preservedResults = this.db.examResults;

    this.db = {
      ...this.db,
      ...newData,
      version: newVersion,
      lastSync: Date.now(),
      userSettings: preservedSettings,
      examResults: preservedResults,
    };

    await this.save();
  }

  // Exams
  async getExams(
    category?: string,
    page = 1,
    limit = 20
  ): Promise<{ exams: Exam[]; total: number; hasMore: boolean }> {
    if (!this.db) return { exams: [], total: 0, hasMore: false };

    let filteredExams = this.db.exams;

    if (category) {
      filteredExams = filteredExams.filter(
        (exam) => exam.category === category
      );
    }

    const total = filteredExams.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const exams = filteredExams.slice(startIndex, endIndex);
    const hasMore = endIndex < total;

    return { exams, total, hasMore };
  }

  async getExamById(id: string): Promise<Exam | null> {
    if (!this.db) return null;
    return this.db.exams.find((exam) => exam.id === id) || null;
  }

  // Flashcards
  async getFlashcards(type?: string, due = false): Promise<Flashcard[]> {
    if (!this.db) return [];

    let flashcards = this.db.flashcards;

    if (type) {
      flashcards = flashcards.filter((card) => card.type === type);
    }

    if (due) {
      const now = Date.now();
      flashcards = flashcards.filter((card) => card.nextReview <= now);
    }

    return flashcards;
  }

  async updateFlashcard(
    id: string,
    updates: Partial<Flashcard>
  ): Promise<void> {
    if (!this.db) return;

    const index = this.db.flashcards.findIndex((card) => card.id === id);
    if (index !== -1) {
      this.db.flashcards[index] = { ...this.db.flashcards[index], ...updates };
      await this.save();
    }
  }

  // User Settings
  async getUserSettings(): Promise<UserSettings> {
    if (!this.db) return this.getDefaultSettings();
    return this.db.userSettings;
  }

  async updateUserSettings(settings: Partial<UserSettings>): Promise<void> {
    if (!this.db) return;

    this.db.userSettings = { ...this.db.userSettings, ...settings };
    await this.save();
  }

  // Exam Results
  async saveExamResult(result: ExamResult): Promise<void> {
    if (!this.db) return;

    this.db.examResults.push(result);
    await this.save();
  }

  async getExamResults(examId?: string): Promise<ExamResult[]> {
    if (!this.db) return [];

    if (examId) {
      return this.db.examResults.filter((result) => result.examId === examId);
    }

    return this.db.examResults;
  }

  // Database Info
  async getDatabaseInfo(): Promise<{
    version: string;
    examCount: number;
    flashcardCount: number;
    lastSync: number;
  }> {
    if (!this.db) {
      return { version: "0.0.0", examCount: 0, flashcardCount: 0, lastSync: 0 };
    }

    return {
      version: this.db.version.version,
      examCount: this.db.exams.length,
      flashcardCount: this.db.flashcards.length,
      lastSync: this.db.lastSync,
    };
  }

  private getDefaultSettings(): UserSettings {
    return {
      preferredLanguage: "en",
      notificationsEnabled: true,
      studyReminders: true,
      locationmostRecent: null,
      theme: "auto",
    };
  }

  // Import data from server
  async importData(
    data: { exams: Exam[]; flashcards: Flashcard[]; words: Word[] },
    version: DatabaseVersion
  ): Promise<void> {
    await this.updateDatabase(data, version);
  }

  // Clear database (for reset)
  async clear(): Promise<void> {
    await this.createEmptyDatabase();
  }
}
