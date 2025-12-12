import { LocalDatabase } from "../database/local-db";
import { SyncService } from "../database/sync-service";
import { Exam, Flashcard, ExamResult, UserSettings } from "../database/types";

export class LocalLearningService {
  private static instance: LocalLearningService;
  private localDb = LocalDatabase.getInstance();
  private syncService = SyncService.getInstance();

  static getInstance(): LocalLearningService {
    if (!LocalLearningService.instance) {
      LocalLearningService.instance = new LocalLearningService();
    }
    return LocalLearningService.instance;
  }

  async initialize(): Promise<void> {
    await this.syncService.initializeDatabase();
  }

  // Exams
  async getExams(category?: string, page = 1, limit = 20): Promise<Exam[]> {
    const result = await this.localDb.getExams(category, page, limit);
    return result.exams;
  }

  async getExamById(id: string): Promise<Exam | null> {
    return await this.localDb.getExamById(id);
  }

  async getExamCount(category?: string): Promise<number> {
    const result = await this.localDb.getExams(category, 1, 1);
    return result.total;
  }

  async startExam(examId: string): Promise<any> {
    const exam = await this.localDb.getExamById(examId);
    if (!exam) {
      throw new Error("Exam not found");
    }

    return {
      id: `session_${Date.now()}`,
      examId: exam.id,
      exam: exam,
      startedAt: Date.now(),
      timeLimit: exam.duration * 60 * 1000, // Convert minutes to milliseconds
      status: "in_progress",
    };
  }

  async submitExam(sessionId: string, answers: number[]): Promise<any> {
    // Find the exam session (in a real app, this would be stored)
    const session = { examId: "mock", startedAt: Date.now() }; // Mock session

    const exam = await this.localDb.getExamById(session.examId);
    if (!exam) {
      throw new Error("Exam not found");
    }

    let correctAnswers = 0;
    const results = answers.map((answer, index: number) => {
      const correct = exam.questions[index].correctAnswer === answer;
      if (correct) correctAnswers++;

      return {
        question: exam.questions[index].question,
        userAnswer: answer,
        correctAnswer: exam.questions[index].correctAnswer,
        isCorrect: correct,
        explanation: exam.questions[index].explanation,
      };
    });

    const score = Math.round((correctAnswers / exam.questions.length) * 100);
    const passed = score >= exam.passingScore;

    // Save result
    const examResult: ExamResult = {
      id: `result_${Date.now()}`,
      examId: exam.id,
      score,
      totalQuestions: exam.questions.length,
      correctAnswers,
      timeSpent: Date.now() - session.startedAt,
      completedAt: Date.now(),
      answers,
    };

    await this.localDb.saveExamResult(examResult);

    return {
      id: examResult.id,
      score,
      totalQuestions: exam.questions.length,
      correctAnswers,
      passed,
      timeSpent: examResult.timeSpent,
      results,
      completedAt: examResult.completedAt,
    };
  }

  // Flashcards
  async getFlashcards(type?: string, due = false): Promise<Flashcard[]> {
    return await this.localDb.getFlashcards(type, due);
  }

  async updateFlashcard(
    id: string,
    updates: Partial<Flashcard>
  ): Promise<void> {
    await this.localDb.updateFlashcard(id, updates);
  }

  async submitFlashcardReview(cardId: string, rating: number): Promise<void> {
    const card = await this.localDb.getFlashcards();
    const flashcard = card.find((c) => c.id === cardId);

    if (!flashcard) return;

    // Spaced repetition algorithm
    const now = Date.now();
    let nextReview = now;
    let difficulty = flashcard.difficulty || 1;
    let reviewCount = flashcard.reviewCount || 0;

    if (rating === 0) {
      // Reset card
      difficulty = 1;
      nextReview = now + 5 * 60 * 1000; // 5 minutes
    } else if (rating === 1) {
      // Hard
      difficulty = Math.max(1, difficulty - 0.2);
      nextReview = now + 6 * 60 * 60 * 1000; // 6 hours
    } else if (rating === 2) {
      // Good
      nextReview = now + 24 * 60 * 60 * 1000; // 1 day
    } else if (rating === 3) {
      // Easy
      difficulty = Math.min(5, difficulty + 0.1);
      nextReview = now + 3 * 24 * 60 * 60 * 1000; // 3 days
    }

    reviewCount++;

    await this.localDb.updateFlashcard(cardId, {
      nextReview,
      difficulty,
      reviewCount,
    });
  }

  // User Settings
  async getUserSettings(): Promise<UserSettings> {
    return await this.localDb.getUserSettings();
  }

  async updateUserSettings(settings: Partial<UserSettings>): Promise<void> {
    await this.localDb.updateUserSettings(settings);
  }

  // Stats
  async getLearningStats(): Promise<any> {
    const dbInfo = await this.localDb.getDatabaseInfo();
    const examResults = await this.localDb.getExamResults();

    const lastExamResult = examResults[examResults.length - 1];
    const lastExamScore = lastExamResult ? lastExamResult.score : 0;

    return {
      totalWords: dbInfo.flashcardCount,
      wordsLearned: 0, // Would need to track this separately
      reviewStreak: 0, // Would need to track this separately
      totalExams: dbInfo.examCount,
      examsTaken: examResults.length,
      lastExamScore,
      averageScore:
        examResults.length > 0
          ? Math.round(
              examResults.reduce((sum, result) => sum + result.score, 0) /
                examResults.length
            )
          : 0,
    };
  }

  // Sync
  async syncDatabase(): Promise<void> {
    await this.syncService.forceSync();
  }

  async getSyncStatus(): Promise<any> {
    return await this.syncService.getSyncStatus();
  }
}

// Export singleton instance
export const localLearningService = LocalLearningService.getInstance();
