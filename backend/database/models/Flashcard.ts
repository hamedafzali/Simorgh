import mongoose, { Document, Schema } from "mongoose";

export interface IFlashcard extends Document {
  wordId: mongoose.Types.ObjectId;
  frontText: string;
  backText: string;
  hint?: string;
  difficultyLevel: number; // 1-5
  reviewCount: number;
  successRate: number;
  lastReviewed?: Date;
  nextReview: Date;
  interval: number; // Tage bis zur nächsten Wiederholung
  easeFactor: number; // Spaced Repetition Algorithmus
  userId?: string;
  deck: string;
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FlashcardSchema: Schema = new Schema(
  {
    wordId: { type: Schema.Types.ObjectId, ref: "Word", required: true },
    frontText: { type: String, required: true, trim: true },
    backText: { type: String, required: true, trim: true },
    hint: { type: String, trim: true },
    difficultyLevel: { type: Number, min: 1, max: 5, required: true },
    reviewCount: { type: Number, default: 0 },
    successRate: { type: Number, min: 0, max: 1, default: 0 },
    lastReviewed: { type: Date },
    nextReview: { type: Date, required: true },
    interval: { type: Number, default: 1 }, // Start mit 1 Tag
    easeFactor: { type: Number, default: 2.5 }, // Standard SM-2 Algorithmus
    userId: { type: String, index: true },
    deck: { type: String, required: true, default: "default" },
    tags: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Indexes für Performance
FlashcardSchema.index({ userId: 1, nextReview: 1 });
FlashcardSchema.index({ deck: 1 });
FlashcardSchema.index({ difficultyLevel: 1 });
FlashcardSchema.index({ tags: 1 });

export default mongoose.model<IFlashcard>("Flashcard", FlashcardSchema);
