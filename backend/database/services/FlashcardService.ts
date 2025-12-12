import { DatabaseConfig } from "../config/database";
import Flashcard, { IFlashcard } from "../models/Flashcard";

export class FlashcardService {
  private db: DatabaseConfig;

  constructor() {
    this.db = DatabaseConfig.getInstance();
  }

  async createFlashcard(cardData: Partial<IFlashcard>): Promise<IFlashcard> {
    try {
      // Set next review to tomorrow if not provided
      if (!cardData.nextReview) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        cardData.nextReview = tomorrow;
      }

      const flashcard = new Flashcard(cardData);
      return await flashcard.save();
    } catch (error) {
      throw new Error(`Failed to create flashcard: ${error}`);
    }
  }

  async getFlashcardsForReview(
    userId: string,
    limit: number = 20
  ): Promise<IFlashcard[]> {
    try {
      const now = new Date();
      return await Flashcard.find({
        userId,
        nextReview: { $lte: now },
        isActive: true,
      })
        .sort({ nextReview: 1 })
        .limit(limit)
        .populate("wordId");
    } catch (error) {
      throw new Error(`Failed to get flashcards for review: ${error}`);
    }
  }

  async reviewFlashcard(
    cardId: string,
    quality: number // 0-5 SM-2 Algorithmus
  ): Promise<IFlashcard | null> {
    try {
      const card = await Flashcard.findById(cardId);
      if (!card) {
        throw new Error("Flashcard not found");
      }

      // Spaced Repetition Algorithm (SM-2)
      let { easeFactor, interval, reviewCount } = card;

      if (quality >= 3) {
        if (reviewCount === 0) {
          interval = 1;
        } else if (reviewCount === 1) {
          interval = 6;
        } else {
          interval = Math.round(interval * easeFactor);
        }
      } else {
        interval = 1;
      }

      easeFactor = Math.max(
        1.3,
        easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
      );

      // Update success rate
      const newSuccessCount =
        card.successRate * card.reviewCount + (quality >= 3 ? 1 : 0);
      reviewCount += 1;

      // Calculate next review date
      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + interval);

      return await Flashcard.findByIdAndUpdate(
        cardId,
        {
          interval,
          easeFactor,
          reviewCount,
          successRate: newSuccessCount / reviewCount,
          lastReviewed: new Date(),
          nextReview,
        },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Failed to review flashcard: ${error}`);
    }
  }

  async getFlashcardsByDeck(
    userId: string,
    deck: string
  ): Promise<IFlashcard[]> {
    try {
      return await Flashcard.find({ userId, deck, isActive: true })
        .populate("wordId")
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Failed to get flashcards by deck: ${error}`);
    }
  }

  async createFlashcardsFromWords(
    userId: string,
    wordIds: string[],
    deck: string = "default"
  ): Promise<IFlashcard[]> {
    try {
      const flashcards = [];
      for (const wordId of wordIds) {
        const cardData = {
          wordId,
          userId,
          deck,
          frontText: "", // Will be populated by Word data
          backText: "", // Will be populated by Word data
          difficultyLevel: 3,
          nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        };

        const flashcard = await this.createFlashcard(cardData);
        flashcards.push(flashcard);
      }
      return flashcards;
    } catch (error) {
      throw new Error(`Failed to create flashcards from words: ${error}`);
    }
  }

  async getStudyStats(userId: string): Promise<{
    totalCards: number;
    cardsToReview: number;
    cardsLearned: number;
    averageSuccessRate: number;
    studyStreak: number;
  }> {
    try {
      const now = new Date();
      const stats = await Flashcard.aggregate([
        { $match: { userId, isActive: true } },
        {
          $group: {
            _id: null,
            totalCards: { $sum: 1 },
            cardsToReview: {
              $sum: {
                $cond: [{ $lte: ["$nextReview", now] }, 1, 0],
              },
            },
            cardsLearned: {
              $sum: {
                $cond: [{ $gte: ["$reviewCount", 3] }, 1, 0],
              },
            },
            averageSuccessRate: { $avg: "$successRate" },
            lastReviewed: { $max: "$lastReviewed" },
          },
        },
      ]);

      const result = stats[0] || {
        totalCards: 0,
        cardsToReview: 0,
        cardsLearned: 0,
        averageSuccessRate: 0,
        lastReviewed: null,
      };

      // Calculate study streak (consecutive days with reviews)
      let studyStreak = 0;
      if (result.lastReviewed) {
        const today = new Date();
        const lastReviewed = new Date(result.lastReviewed);
        const daysDiff = Math.floor(
          (today.getTime() - lastReviewed.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff <= 1) {
          studyStreak = 1; // Simplified streak calculation
        }
      }

      return {
        ...result,
        studyStreak,
      };
    } catch (error) {
      throw new Error(`Failed to get study stats: ${error}`);
    }
  }

  async resetFlashcard(cardId: string): Promise<IFlashcard | null> {
    try {
      return await Flashcard.findByIdAndUpdate(
        cardId,
        {
          interval: 1,
          easeFactor: 2.5,
          reviewCount: 0,
          successRate: 0,
          lastReviewed: undefined,
          nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Failed to reset flashcard: ${error}`);
    }
  }

  async deleteFlashcard(cardId: string): Promise<boolean> {
    try {
      const result = await Flashcard.findByIdAndDelete(cardId);
      return !!result;
    } catch (error) {
      throw new Error(`Failed to delete flashcard: ${error}`);
    }
  }
}

export default new FlashcardService();
