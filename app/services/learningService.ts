import { LocalDatabase } from "@/database/local-db";

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  type: "vocabulary" | "grammar" | "phrase";
  difficulty: number;
  nextReview: number;
  reviewCount: number;
  correctCount: number;
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
  questions: Question[];
  instructions: string;
}

export interface Question {
  id: string;
  type: "multiple-choice" | "translation" | "fill-blank";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface ExamResult {
  id: string;
  examId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  completedAt: number;
  passed: boolean;
}

export interface Word {
  id: string;
  german: string;
  farsi: string;
  english: string;
  pronunciation?: string;
  category: string;
  difficulty: number;
  examples: string[];
}

export interface UserSettings {
  preferredLanguage: "fa" | "de" | "en";
  dailyGoal: number;
  notifications: boolean;
  soundEffects: boolean;
}

export class LearningService {
  private static instance: LearningService;
  private db = LocalDatabase.getInstance();

  static getInstance(): LearningService {
    if (!LearningService.instance) {
      LearningService.instance = new LearningService();
    }
    return LearningService.instance;
  }

  async getFlashcards(type?: string): Promise<Flashcard[]> {
    return this.db.getFlashcards(type);
  }

  async updateFlashcard(id: string, updates: Partial<Flashcard>): Promise<void> {
    await this.db.updateFlashcard(id, updates);
  }

  async getExams(level?: string, category?: string): Promise<Exam[]> {
    return this.db.getExams(level, category);
  }

  async getExamById(id: string): Promise<Exam | null> {
    return this.db.getExamById(id);
  }

  async saveExamResult(result: Omit<ExamResult, "id">): Promise<string> {
    return this.db.saveExamResult(result);
  }

  async getExamResults(examId?: string): Promise<ExamResult[]> {
    return this.db.getExamResults(examId);
  }

  async getWords(search?: string, category?: string): Promise<Word[]> {
    return this.db.getWords(search, category);
  }

  async getUserSettings(): Promise<UserSettings> {
    return this.db.getUserSettings();
  }

  async updateUserSettings(settings: Partial<UserSettings>): Promise<void> {
    await this.db.updateUserSettings(settings);
  }

  async getProgressSummary(): Promise<{
    totalFlashcards: number;
    reviewedToday: number;
    examsCompleted: number;
    averageScore: number;
    streak: number;
  }> {
    return this.db.getProgressSummary();
  }
}

export const learningService = LearningService.getInstance();

// Export individual functions for convenience
export const getFlashcards = (type?: string) => learningService.getFlashcards(type);
export const updateFlashcard = (id: string, updates: Partial<Flashcard>) => 
  learningService.updateFlashcard(id, updates);
export const getExams = (level?: string, category?: string) => learningService.getExams(level, category);
export const getExamById = (id: string) => learningService.getExamById(id);
export const saveExamResult = (result: Omit<ExamResult, "id">) => learningService.saveExamResult(result);
export const getExamResults = (examId?: string) => learningService.getExamResults(examId);
export const getWords = (search?: string, category?: string) => learningService.getWords(search, category);
export const getUserSettings = () => learningService.getUserSettings();
export const updateUserSettings = (settings: Partial<UserSettings>) => 
  learningService.updateUserSettings(settings);
export const getProgressSummary = () => learningService.getProgressSummary();
