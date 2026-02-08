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

      const wordsByLevelRows = (await db.getAllAsync(
        "SELECT level, COUNT(*) as count FROM words GROUP BY level"
      )) as Array<{ level: string; count: number }>;

      const wordsByLevel: Record<string, number> = {};
      wordsByLevelRows.forEach((row) => {
        wordsByLevel[row.level] = row.count;
      });

      const flashcardStats = (await db.getFirstAsync(
        "SELECT SUM(reviewCount) as totalReviews FROM flashcards"
      )) as { totalReviews: number | null } | null;
      const totalReviews = flashcardStats?.totalReviews || 0;

      const mastered = (await db.getFirstAsync(
        "SELECT COUNT(DISTINCT wordId) as count FROM flashcards WHERE reviewCount >= 5 AND wordId IS NOT NULL"
      )) as { count: number } | null;
      const masteredWords = mastered?.count || 0;

      const accuracyRow = (await db.getFirstAsync(
        "SELECT AVG(CAST(score AS FLOAT) / NULLIF(totalPoints, 0)) as accuracy FROM exam_results"
      )) as { accuracy: number | null } | null;
      const accuracy = Math.round((accuracyRow?.accuracy || 0) * 100);

      const wordTypeRows = (await db.getAllAsync(
        "SELECT wordType, COUNT(*) as count FROM words GROUP BY wordType"
      )) as Array<{ wordType: string; count: number }>;
      const grammarProgress: Record<string, number> = {};
      wordTypeRows.forEach((row) => {
        grammarProgress[row.wordType] = totalWords
          ? Math.round((row.count / totalWords) * 100)
          : 0;
      });

      const reviewDates = (await db.getAllAsync(
        "SELECT updatedAt FROM flashcards WHERE reviewCount > 0"
      )) as Array<{ updatedAt: string }>;
      const daySet = new Set<string>();
      reviewDates.forEach((row) => {
        if (row.updatedAt) {
          daySet.add(row.updatedAt.slice(0, 10));
        }
      });
      let streakDays = 0;
      if (daySet.size) {
        const today = new Date();
        for (let i = 0; i < 365; i += 1) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          const key = d.toISOString().slice(0, 10);
          if (daySet.has(key)) {
            streakDays += 1;
          } else {
            break;
          }
        }
      }

      const levelOrder = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
      const currentLevel =
        (levelOrder.find((lvl) => (wordsByLevel[lvl] || 0) > 0) ?? "A1");

      const stats: LearningStats = {
        totalWords,
        masteredWords,
        accuracy,
        streakDays,
        totalReviews,
        currentLevel,
        wordsByLevel,
        grammarProgress,
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
        persian: this.getPersianTranslation(word.translations, word.english),
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
        persian: this.getPersianTranslation(word.translations, word.english),
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
        persian: this.getPersianTranslation(word.translations, word.english),
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
      const totalPoints = answers.reduce(
        (sum: number, answer: any) => sum + (answer?.points || 0),
        0
      );
      const earned = answers.reduce(
        (sum: number, answer: any) => sum + (answer?.isCorrect ? answer.points || 0 : 0),
        0
      );
      await database.saveExamResult(examId, earned, totalPoints || 1, answers);
      return { success: true, score: earned, totalPoints: totalPoints || 1 };
    } catch (error) {
      console.error("Error submitting exam:", error);
      throw error;
    }
  }

  private getPersianTranslation(rawTranslations: any, fallback: string): string {
    try {
      const translations = JSON.parse(rawTranslations || "[]") as Array<{
        language: string;
        text: string;
        isPrimary?: boolean;
      }>;
      const fa = translations.find(
        (t) => t.language === "fa" || t.language === "fa-IR"
      );
      if (fa?.text) return fa.text;
    } catch {
      // ignore parsing issues
    }
    return fallback;
  }
}

export default new LearningService();
