import {
  Exam,
  Exercise,
  FlashcardService,
  Grammar,
  initializeDatabase,
  WordService,
} from "../database";
import { IFlashcard } from "../database/models/Flashcard";
import { IWord } from "../database/models/Word";

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

export interface FlashcardData {
  id: string;
  front: string;
  back: string;
  hint?: string;
  difficulty: number;
  nextReview: Date;
  reviewCount: number;
  successRate: number;
}

export interface GrammarTopic {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  difficulty: number;
  rules: Array<{
    name: string;
    description: string;
    examples: string[];
  }>;
}

export interface LearningExercise {
  id: string;
  title: string;
  type: string;
  level: string;
  difficulty: number;
  questionCount: number;
  timeLimit?: number;
}

export interface LearningExam {
  id: string;
  title: string;
  level: string;
  type: string;
  duration: number;
  passingScore: number;
  sections: Array<{
    title: string;
    type: string;
    questionCount: number;
    weight: number;
  }>;
}

class LearningService {
  private wordService: typeof WordService;
  private flashcardService: typeof FlashcardService;
  private initialized = false;

  constructor() {
    this.wordService = require("../database/services/WordService").default;
    this.flashcardService =
      require("../database/services/FlashcardService").default;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await initializeDatabase();
      this.initialized = true;
      console.log("Learning service initialized successfully");
    } catch (error) {
      console.error("Failed to initialize learning service:", error);
      throw error;
    }
  }

  async getUserLearningStats(userId: string): Promise<LearningStats> {
    await this.initialize();

    try {
      // Get flashcard stats
      const flashcardStats = await this.flashcardService.getStudyStats(userId);

      // Get word statistics
      const wordStats = await this.wordService.getWordStatistics();

      // Calculate current level based on mastered words
      const masteredWords = flashcardStats.cardsLearned;
      let currentLevel: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" = "A1";

      if (masteredWords >= 1000) currentLevel = "C2";
      else if (masteredWords >= 600) currentLevel = "C1";
      else if (masteredWords >= 400) currentLevel = "B2";
      else if (masteredWords >= 250) currentLevel = "B1";
      else if (masteredWords >= 100) currentLevel = "A2";

      return {
        totalWords: flashcardStats.totalCards,
        masteredWords: flashcardStats.cardsLearned,
        accuracy: Math.round(flashcardStats.averageSuccessRate * 100),
        streakDays: flashcardStats.studyStreak,
        totalReviews:
          flashcardStats.totalCards * flashcardStats.averageSuccessRate,
        currentLevel,
        wordsByLevel: wordStats.wordsByLevel,
        grammarProgress: {}, // TODO: Implement grammar progress tracking
      };
    } catch (error) {
      console.error("Error getting user learning stats:", error);
      throw error;
    }
  }

  async getWordsForLevel(level: string, limit: number = 20): Promise<IWord[]> {
    await this.initialize();

    try {
      return await this.wordService.getWordsByLevel(level);
    } catch (error) {
      console.error("Error getting words for level:", error);
      throw error;
    }
  }

  async getRandomWords(count: number, level?: string): Promise<IWord[]> {
    await this.initialize();

    try {
      return await this.wordService.getRandomWords(count, level);
    } catch (error) {
      console.error("Error getting random words:", error);
      throw error;
    }
  }

  async searchWords(
    query: string,
    filters?: {
      level?: string;
      wordType?: string;
      tags?: string[];
    }
  ): Promise<IWord[]> {
    await this.initialize();

    try {
      return await this.wordService.searchWords(query, filters);
    } catch (error) {
      console.error("Error searching words:", error);
      throw error;
    }
  }

  async getFlashcardsForReview(
    userId: string,
    limit: number = 20
  ): Promise<IFlashcard[]> {
    await this.initialize();

    try {
      return await this.flashcardService.getFlashcardsForReview(userId, limit);
    } catch (error) {
      console.error("Error getting flashcards for review:", error);
      throw error;
    }
  }

  async createFlashcardsFromWords(
    userId: string,
    wordIds: string[],
    deck: string = "default"
  ): Promise<IFlashcard[]> {
    await this.initialize();

    try {
      return await this.flashcardService.createFlashcardsFromWords(
        userId,
        wordIds,
        deck
      );
    } catch (error) {
      console.error("Error creating flashcards from words:", error);
      throw error;
    }
  }

  async reviewFlashcard(
    cardId: string,
    quality: number
  ): Promise<IFlashcard | null> {
    await this.initialize();

    try {
      return await this.flashcardService.reviewFlashcard(cardId, quality);
    } catch (error) {
      console.error("Error reviewing flashcard:", error);
      throw error;
    }
  }

  async getGrammarTopics(level?: string): Promise<GrammarTopic[]> {
    await this.initialize();

    try {
      const query = level ? { level, isActive: true } : { isActive: true };
      const grammarDocs = await Grammar.find(query).sort({
        difficultyScore: 1,
      });

      return grammarDocs.map((doc: any) => ({
        id: doc._id.toString(),
        title: doc.title,
        description: doc.description,
        level: doc.level,
        category: doc.category,
        difficulty: doc.difficultyScore,
        rules: doc.rules.map((rule: any) => ({
          name: rule.name,
          description: rule.description,
          examples: rule.examples,
        })),
      }));
    } catch (error) {
      console.error("Error getting grammar topics:", error);
      throw error;
    }
  }

  async getExercises(filters?: {
    level?: string;
    type?: string;
    category?: string;
  }): Promise<LearningExercise[]> {
    await this.initialize();

    try {
      const query: any = { isActive: true };
      if (filters?.level) query.level = filters.level;
      if (filters?.type) query.exerciseType = filters.type;
      if (filters?.category) query.topicCategory = filters.category;

      const exerciseDocs = await Exercise.find(query).sort({
        difficultyScore: 1,
      });

      return exerciseDocs.map((doc) => ({
        id: doc._id.toString(),
        title: doc.title,
        type: doc.exerciseType,
        level: doc.level,
        difficulty: doc.difficultyScore,
        questionCount: doc.questions.length,
        timeLimit: doc.timeLimitMinutes,
      }));
    } catch (error) {
      console.error("Error getting exercises:", error);
      throw error;
    }
  }

  async getExams(level?: string): Promise<LearningExam[]> {
    await this.initialize();

    try {
      const query = level ? { level, isActive: true } : { isActive: true };
      const examDocs = await Exam.find(query).sort({ level: 1 });

      return examDocs.map((doc: any) => ({
        id: doc._id.toString(),
        title: doc.title,
        level: doc.level,
        type: doc.examType,
        duration: doc.durationMinutes,
        passingScore: doc.passingScore,
        sections: doc.sections.map((section: any) => ({
          title: section.title,
          type: section.sectionType,
          questionCount: section.questionCount,
          weight: section.weightPercentage,
        })),
      }));
    } catch (error) {
      console.error("Error getting exams:", error);
      throw error;
    }
  }

  async getDailyWords(userId: string, count: number = 5): Promise<IWord[]> {
    await this.initialize();

    try {
      // Get user's current level and appropriate words
      const stats = await this.getUserLearningStats(userId);
      return await this.getRandomWords(count, stats.currentLevel);
    } catch (error) {
      console.error("Error getting daily words:", error);
      throw error;
    }
  }

  async getRecommendedContent(userId: string): Promise<{
    words: IWord[];
    grammar: GrammarTopic[];
    exercises: LearningExercise[];
  }> {
    await this.initialize();

    try {
      const stats = await this.getUserLearningStats(userId);

      // Get content based on user's level
      const [words, grammar, exercises] = await Promise.all([
        this.getRandomWords(5, stats.currentLevel),
        this.getGrammarTopics(stats.currentLevel),
        this.getExercises({ level: stats.currentLevel }),
      ]);

      return { words, grammar, exercises };
    } catch (error) {
      console.error("Error getting recommended content:", error);
      throw error;
    }
  }
}

export default new LearningService();
