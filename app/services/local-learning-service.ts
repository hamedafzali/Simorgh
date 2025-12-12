import { learningService, type Flashcard, type Exam, type Word } from "./learningService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface StudySession {
  id: string;
  startTime: number;
  endTime?: number;
  duration: number;
  flashcardsStudied: number;
  correctAnswers: number;
  type: "flashcards" | "exam" | "practice";
}

export interface StudyStats {
  totalTimeStudied: number;
  sessionsThisWeek: number;
  averageSessionDuration: number;
  streak: number;
  lastStudyDate: number;
}

const SESSIONS_KEY = "simorgh_study_sessions";
const STATS_KEY = "simorgh_study_stats";

export class LocalLearningService {
  private static instance: LocalLearningService;

  static getInstance(): LocalLearningService {
    if (!LocalLearningService.instance) {
      LocalLearningService.instance = new LocalLearningService();
    }
    return LocalLearningService.instance;
  }

  async startStudySession(type: "flashcards" | "exam" | "practice"): Promise<string> {
    try {
      const sessionId = Date.now().toString();
      const session: StudySession = {
        id: sessionId,
        startTime: Date.now(),
        duration: 0,
        flashcardsStudied: 0,
        correctAnswers: 0,
        type,
      };

      const stored = await AsyncStorage.getItem(SESSIONS_KEY);
      const sessions: StudySession[] = stored ? JSON.parse(stored) : [];
      sessions.push(session);
      
      await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
      return sessionId;
    } catch (error) {
      console.error("Error starting study session:", error);
      throw error;
    }
  }

  async endStudySession(
    sessionId: string, 
    flashcardsStudied: number, 
    correctAnswers: number
  ): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(SESSIONS_KEY);
      const sessions: StudySession[] = stored ? JSON.parse(stored) : [];
      
      const sessionIndex = sessions.findIndex(s => s.id === sessionId);
      if (sessionIndex === -1) return;

      const session = sessions[sessionIndex];
      const endTime = Date.now();
      const duration = endTime - session.startTime;

      sessions[sessionIndex] = {
        ...session,
        endTime,
        duration,
        flashcardsStudied,
        correctAnswers,
      };

      await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
      await this.updateStudyStats();
    } catch (error) {
      console.error("Error ending study session:", error);
    }
  }

  async getStudySessions(limit?: number): Promise<StudySession[]> {
    try {
      const stored = await AsyncStorage.getItem(SESSIONS_KEY);
      const sessions: StudySession[] = stored ? JSON.parse(stored) : [];
      
      const sorted = sessions.sort((a, b) => b.startTime - a.startTime);
      return limit ? sorted.slice(0, limit) : sorted;
    } catch (error) {
      console.error("Error loading study sessions:", error);
      return [];
    }
  }

  async getStudyStats(): Promise<StudyStats> {
    try {
      const stored = await AsyncStorage.getItem(STATS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      
      return this.getDefaultStats();
    } catch (error) {
      console.error("Error loading study stats:", error);
      return this.getDefaultStats();
    }
  }

  async updateStudyStats(): Promise<void> {
    try {
      const sessions = await this.getStudySessions();
      const now = Date.now();
      const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
      
      const completedSessions = sessions.filter(s => s.endTime);
      const sessionsThisWeek = completedSessions.filter(s => s.startTime >= oneWeekAgo);
      
      const totalTimeStudied = completedSessions.reduce((sum, s) => sum + s.duration, 0);
      const averageSessionDuration = completedSessions.length > 0 
        ? totalTimeStudied / completedSessions.length 
        : 0;

      // Calculate streak
      let streak = 0;
      const sortedSessions = completedSessions.sort((a, b) => b.startTime - a.startTime);
      
      if (sortedSessions.length > 0) {
        const today = new Date().toDateString();
        const lastStudyDate = new Date(sortedSessions[0].startTime).toDateString();
        
        if (lastStudyDate === today) {
          streak = 1;
          
          for (let i = 1; i < sortedSessions.length; i++) {
            const currentDate = new Date(sortedSessions[i].startTime).toDateString();
            const previousDate = new Date(sortedSessions[i - 1].startTime).toDateString();
            
            const prevDay = new Date(previousDate);
            prevDay.setDate(prevDay.getDate() - 1);
            
            if (currentDate === prevDay.toDateString()) {
              streak++;
            } else {
              break;
            }
          }
        }
      }

      const lastStudyDate = sortedSessions.length > 0 ? sortedSessions[0].startTime : 0;

      const stats: StudyStats = {
        totalTimeStudied,
        sessionsThisWeek: sessionsThisWeek.length,
        averageSessionDuration,
        streak,
        lastStudyDate,
      };

      await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error("Error updating study stats:", error);
    }
  }

  async getTodayProgress(): Promise<{
    timeStudied: number;
    flashcardsStudied: number;
    correctAnswers: number;
    sessions: number;
  }> {
    try {
      const today = new Date().toDateString();
      const sessions = await this.getStudySessions();
      
      const todaySessions = sessions.filter(s => {
        const sessionDate = new Date(s.startTime).toDateString();
        return sessionDate === today && s.endTime;
      });

      const timeStudied = todaySessions.reduce((sum, s) => sum + s.duration, 0);
      const flashcardsStudied = todaySessions.reduce((sum, s) => sum + s.flashcardsStudied, 0);
      const correctAnswers = todaySessions.reduce((sum, s) => sum + s.correctAnswers, 0);

      return {
        timeStudied,
        flashcardsStudied,
        correctAnswers,
        sessions: todaySessions.length,
      };
    } catch (error) {
      console.error("Error getting today's progress:", error);
      return {
        timeStudied: 0,
        flashcardsStudied: 0,
        correctAnswers: 0,
        sessions: 0,
      };
    }
  }

  async getWeakWords(): Promise<Word[]> {
    try {
      const flashcards = await learningService.getFlashcards();
      const weakFlashcards = flashcards.filter(fc => {
        const reviewCount = fc.reviewCount || 0;
        const correctCount = fc.correctCount || 0;
        const accuracy = reviewCount > 0 ? correctCount / reviewCount : 0;
        return accuracy < 0.6 && reviewCount >= 3;
      });

      // Convert to Word format (simplified)
      return weakFlashcards.map(fc => ({
        id: fc.id,
        german: fc.front,
        farsi: fc.back,
        english: fc.back, // Simplified - would need proper translation
        category: fc.type,
        difficulty: 1,
        examples: [],
      }));
    } catch (error) {
      console.error("Error getting weak words:", error);
      return [];
    }
  }

  async getRecommendedFlashcards(count: number = 10): Promise<Flashcard[]> {
    try {
      const flashcards = await learningService.getFlashcards();
      const now = Date.now();
      
      // Sort by next review time, prioritizing overdue cards
      const sorted = flashcards.sort((a, b) => {
        const aOverdue = a.nextReview <= now;
        const bOverdue = b.nextReview <= now;
        
        if (aOverdue && !bOverdue) return -1;
        if (!aOverdue && bOverdue) return 1;
        return a.nextReview - b.nextReview;
      });

      return sorted.slice(0, count);
    } catch (error) {
      console.error("Error getting recommended flashcards:", error);
      return [];
    }
  }

  async resetProgress(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SESSIONS_KEY);
      await AsyncStorage.removeItem(STATS_KEY);
    } catch (error) {
      console.error("Error resetting progress:", error);
    }
  }

  private getDefaultStats(): StudyStats {
    return {
      totalTimeStudied: 0,
      sessionsThisWeek: 0,
      averageSessionDuration: 0,
      streak: 0,
      lastStudyDate: 0,
    };
  }
}

export const localLearningService = LocalLearningService.getInstance();
