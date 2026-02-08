import { database } from "../database";

export interface LearningStats {
  totalWords: number;
  masteredWords: number;
  accuracy: number;
  streakDays: number;
  totalReviews: number;
  currentLevel: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  wordsByLevel: Record<string, number>;
  grammarProgress: Record<string, number>;
}

export interface Word {
  id: string;
  german: string;
  english: string;
  persian: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  category: string;
  difficulty: number;
  pronunciation?: string;
  examples?: Array<{
    german: string;
    english: string;
    persian: string;
    _id: string;
  }>;
}

class LearningService {
  async getUserStats(userId: string = "default"): Promise<LearningStats> {
    try {
      const db = database.getDatabase();

      // Get total words count
      const wordsResult = (await db.getFirstAsync(
        "SELECT COUNT(*) as count FROM words"
      )) as { count: number } | null;
      const totalWords = wordsResult?.count || 0;

      // Get mock stats for now (can be enhanced later with actual progress tracking)
      const stats: LearningStats = {
        totalWords,
        masteredWords: Math.floor(totalWords * 0.3), // Mock: 30% mastered
        accuracy: 85, // Mock: 85% accuracy
        streakDays: 7, // Mock: 7 day streak
        totalReviews: totalWords * 2, // Mock: 2 reviews per word
        currentLevel: "A1",
        wordsByLevel: {
          A1: Math.floor(totalWords * 0.4),
          A2: Math.floor(totalWords * 0.3),
          B1: Math.floor(totalWords * 0.2),
          B2: Math.floor(totalWords * 0.1),
        },
        grammarProgress: {
          nouns: 80,
          verbs: 65,
          adjectives: 45,
        },
      };

      return stats;
    } catch (error) {
      console.error("Error fetching user stats:", error);
      throw error;
    }
  }

  async getWords(filters?: {
    level?: string;
    wordType?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
  }): Promise<Word[]> {
    try {
      const db = database.getDatabase();

      let query = "SELECT * FROM words WHERE 1=1";
      const params: any[] = [];

      if (filters?.level) {
        query += " AND level = ?";
        params.push(filters.level);
      }

      if (filters?.wordType) {
        query += " AND wordType = ?";
        params.push(filters.wordType);
      }

      query += " ORDER BY frequency DESC";

      if (filters?.limit) {
        query += " LIMIT ?";
        params.push(filters.limit);
      }

      const words = (await db.getAllAsync(query, params)) as any[];

      // Transform database results to match expected interface
      return words.map((word: any) => ({
        id: word.id,
        german: word.german,
        english: word.english,
        persian: word.english, // Use English as fallback for Persian
        level: word.level,
        category: word.category,
        difficulty: word.frequency,
        pronunciation: word.phonetic,
      }));
    } catch (error) {
      console.error("Error fetching words:", error);
      throw error;
    }
  }

  async getWordById(id: string): Promise<Word | null> {
    try {
      const db = database.getDatabase();
      const word = (await db.getFirstAsync("SELECT * FROM words WHERE id = ?", [
        id,
      ])) as any;

      if (!word) return null;

      // Transform database result to match expected interface
      return {
        id: word.id,
        german: word.german,
        english: word.english,
        persian: word.english, // Use English as fallback for Persian
        level: word.level,
        category: word.category,
        difficulty: word.frequency,
        pronunciation: word.phonetic,
      };
    } catch (error) {
      console.error("Error fetching word:", error);
      throw error;
    }
  }

  // Stub methods for other functionality - can be implemented as needed
  async searchWords(query: string, filters?: any): Promise<Word[]> {
    try {
      const db = database.getDatabase();
      const words = (await db.getAllAsync(
        "SELECT * FROM words WHERE german LIKE ? OR english LIKE ? ORDER BY frequency DESC LIMIT 20",
        [`%${query}%`, `%${query}%`]
      )) as any[];

      return words.map((word: any) => ({
        id: word.id,
        german: word.german,
        english: word.english,
        persian: word.english,
        level: word.level,
        category: word.category,
        difficulty: word.frequency,
        pronunciation: word.phonetic,
      }));
    } catch (error) {
      console.error("Error searching words:", error);
      throw error;
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const db = database.getDatabase();
      const result = (await db.getAllAsync(
        "SELECT DISTINCT category FROM words"
      )) as any[];
      return result.map((row: any) => row.category);
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  async getExams(filters?: any): Promise<any[]> {
    try {
      return await database.getExams(
        filters?.level,
        filters?.category,
        true,
        filters?.limit
      );
    } catch (error) {
      console.error("Error fetching exams:", error);
      throw error;
    }
  }

  async getExamById(id: string): Promise<any> {
    try {
      return await database.getExamById(id);
    } catch (error) {
      console.error("Error fetching exam:", error);
      throw error;
    }
  }

  async submitExamResult(examId: string, answers: any[]): Promise<any> {
    try {
      // Calculate score (mock implementation)
      const score = Math.floor(Math.random() * 100);
      await database.saveExamResult(examId, score, 100, answers);
      return { success: true, score };
    } catch (error) {
      console.error("Error submitting exam:", error);
      throw error;
    }
  }
}

export default new LearningService();
