import AsyncStorage from "@react-native-async-storage/async-storage";
import { learningService } from "./learningService";

export interface LearnProgressSummary {
  totalWords: number;
  masteredWords: number;
  reviewedToday: number;
  streak: number;
  averageScore: number;
  timeSpent: number;
  lastStudyDate: number;
  dailyGoal: number;
  weeklyGoal: number;
}

export interface WordProgress {
  wordId: string;
  correctCount: number;
  incorrectCount: number;
  lastReviewed: number;
  masteryLevel: number;
  nextReview: number;
}

export interface ChapterProgress {
  chapterId: string;
  completed: boolean;
  score: number;
  completedAt: number;
  timeSpent: number;
}

export interface QuizProgress {
  quizId: string;
  attempts: number;
  bestScore: number;
  lastAttempt: number;
  completed: boolean;
}

const PROGRESS_KEY = "simorgh_learn_progress";
const WORD_PROGRESS_KEY = "simorgh_word_progress";
const CHAPTER_PROGRESS_KEY = "simorgh_chapter_progress";
const QUIZ_PROGRESS_KEY = "simorgh_quiz_progress";

export class LearnProgressService {
  private static instance: LearnProgressService;

  static getInstance(): LearnProgressService {
    if (!LearnProgressService.instance) {
      LearnProgressService.instance = new LearnProgressService();
    }
    return LearnProgressService.instance;
  }

  async getProgressSummary(): Promise<LearnProgressSummary> {
    try {
      const stored = await AsyncStorage.getItem(PROGRESS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      
      // Return default values if no data exists
      return {
        totalWords: 0,
        masteredWords: 0,
        reviewedToday: 0,
        streak: 0,
        averageScore: 0,
        timeSpent: 0,
        lastStudyDate: 0,
        dailyGoal: 10,
        weeklyGoal: 50,
      };
    } catch (error) {
      console.error("Error loading progress summary:", error);
      return this.getDefaultSummary();
    }
  }

  async updateProgressSummary(updates: Partial<LearnProgressSummary>): Promise<void> {
    try {
      const current = await this.getProgressSummary();
      const updated = { ...current, ...updates };
      await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Error updating progress summary:", error);
    }
  }

  async getWordProgress(wordId: string): Promise<WordProgress | null> {
    try {
      const stored = await AsyncStorage.getItem(WORD_PROGRESS_KEY);
      const progress: Record<string, WordProgress> = stored ? JSON.parse(stored) : {};
      return progress[wordId] || null;
    } catch (error) {
      console.error("Error loading word progress:", error);
      return null;
    }
  }

  async updateWordProgress(wordId: string, progress: Partial<WordProgress>): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(WORD_PROGRESS_KEY);
      const allProgress: Record<string, WordProgress> = stored ? JSON.parse(stored) : {};
      
      allProgress[wordId] = {
        ...allProgress[wordId],
        ...progress,
        wordId,
        lastReviewed: Date.now(),
      };
      
      await AsyncStorage.setItem(WORD_PROGRESS_KEY, JSON.stringify(allProgress));
      await this.recalculateSummary();
    } catch (error) {
      console.error("Error updating word progress:", error);
    }
  }

  async getChapterProgress(chapterId: string): Promise<ChapterProgress | null> {
    try {
      const stored = await AsyncStorage.getItem(CHAPTER_PROGRESS_KEY);
      const progress: Record<string, ChapterProgress> = stored ? JSON.parse(stored) : {};
      return progress[chapterId] || null;
    } catch (error) {
      console.error("Error loading chapter progress:", error);
      return null;
    }
  }

  async updateChapterProgress(chapterId: string, progress: Partial<ChapterProgress>): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(CHAPTER_PROGRESS_KEY);
      const allProgress: Record<string, ChapterProgress> = stored ? JSON.parse(stored) : {};
      
      allProgress[chapterId] = {
        ...allProgress[chapterId],
        ...progress,
        chapterId,
      };
      
      await AsyncStorage.setItem(CHAPTER_PROGRESS_KEY, JSON.stringify(allProgress));
      await this.recalculateSummary();
    } catch (error) {
      console.error("Error updating chapter progress:", error);
    }
  }

  async getQuizProgress(quizId: string): Promise<QuizProgress | null> {
    try {
      const stored = await AsyncStorage.getItem(QUIZ_PROGRESS_KEY);
      const progress: Record<string, QuizProgress> = stored ? JSON.parse(stored) : {};
      return progress[quizId] || null;
    } catch (error) {
      console.error("Error loading quiz progress:", error);
      return null;
    }
  }

  async updateQuizProgress(quizId: string, progress: Partial<QuizProgress>): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(QUIZ_PROGRESS_KEY);
      const allProgress: Record<string, QuizProgress> = stored ? JSON.parse(stored) : {};
      
      allProgress[quizId] = {
        ...allProgress[quizId],
        ...progress,
        quizId,
        lastAttempt: Date.now(),
      };
      
      await AsyncStorage.setItem(QUIZ_PROGRESS_KEY, JSON.stringify(allProgress));
      await this.recalculateSummary();
    } catch (error) {
      console.error("Error updating quiz progress:", error);
    }
  }

  async recordStudySession(timeSpent: number, wordsReviewed: number): Promise<void> {
    try {
      const summary = await this.getProgressSummary();
      const today = new Date().toDateString();
      const lastStudyDate = new Date(summary.lastStudyDate).toDateString();
      
      // Update streak
      let streak = summary.streak;
      if (lastStudyDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastStudyDate === yesterday.toDateString()) {
          streak += 1;
        } else {
          streak = 1;
        }
      }

      await this.updateProgressSummary({
        timeSpent: summary.timeSpent + timeSpent,
        reviewedToday: summary.reviewedToday + wordsReviewed,
        lastStudyDate: Date.now(),
        streak,
      });
    } catch (error) {
      console.error("Error recording study session:", error);
    }
  }

  async resetDailyProgress(): Promise<void> {
    try {
      const summary = await this.getProgressSummary();
      await this.updateProgressSummary({
        reviewedToday: 0,
      });
    } catch (error) {
      console.error("Error resetting daily progress:", error);
    }
  }

  private async recalculateSummary(): Promise<void> {
    try {
      // Get all word progress
      const wordStored = await AsyncStorage.getItem(WORD_PROGRESS_KEY);
      const wordProgress: Record<string, WordProgress> = wordStored ? JSON.parse(wordStored) : {};
      
      // Get quiz results from learning service
      const examResults = await learningService.getExamResults();
      
      // Calculate metrics
      const totalWords = Object.keys(wordProgress).length;
      const masteredWords = Object.values(wordProgress).filter(wp => wp.masteryLevel >= 0.8).length;
      const averageScore = examResults.length > 0 
        ? examResults.reduce((sum, result) => sum + result.score, 0) / examResults.length 
        : 0;

      await this.updateProgressSummary({
        totalWords,
        masteredWords,
        averageScore,
      });
    } catch (error) {
      console.error("Error recalculating summary:", error);
    }
  }

  private getDefaultSummary(): LearnProgressSummary {
    return {
      totalWords: 0,
      masteredWords: 0,
      reviewedToday: 0,
      streak: 0,
      averageScore: 0,
      timeSpent: 0,
      lastStudyDate: 0,
      dailyGoal: 10,
      weeklyGoal: 50,
    };
  }
}

export const learnProgressService = LearnProgressService.getInstance();

// Export individual functions for convenience
export const loadProgressSummary = () => learnProgressService.getProgressSummary();
export const updateProgress = (updates: Partial<LearnProgressSummary>) => 
  learnProgressService.updateProgressSummary(updates);
export const getWordProgress = (wordId: string) => learnProgressService.getWordProgress(wordId);
export const updateWordProgress = (wordId: string, progress: Partial<WordProgress>) => 
  learnProgressService.updateWordProgress(wordId, progress);
export const getChapterProgress = (chapterId: string) => learnProgressService.getChapterProgress(chapterId);
export const updateChapterProgress = (chapterId: string, progress: Partial<ChapterProgress>) => 
  learnProgressService.updateChapterProgress(chapterId, progress);
export const getQuizProgress = (quizId: string) => learnProgressService.getQuizProgress(quizId);
export const updateQuizProgress = (quizId: string, progress: Partial<QuizProgress>) => 
  learnProgressService.updateQuizProgress(quizId, progress);
