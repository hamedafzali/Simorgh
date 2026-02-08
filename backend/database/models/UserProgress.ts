import mongoose, { Document, Schema } from "mongoose";

export interface IUserProgress extends Document {
  userId: string;
  contentType: "word" | "grammar" | "exercise" | "exam" | "flashcard";
  contentId: mongoose.Types.ObjectId;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  status: "not_started" | "in_progress" | "completed" | "mastered";
  score?: number;
  timeSpentMinutes: number;
  attempts: number;
  lastAccessed: Date;
  progressData: {
    correctAnswers?: number;
    totalQuestions?: number;
    averageResponseTime?: number;
    streakDays?: number;
    weakAreas?: string[];
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserProgressSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    contentType: {
      type: String,
      enum: ["word", "grammar", "exercise", "exam", "flashcard"],
      required: true,
    },
    contentId: { type: Schema.Types.ObjectId, required: true },
    level: {
      type: String,
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
      required: true,
    },
    status: {
      type: String,
      enum: ["not_started", "in_progress", "completed", "mastered"],
      default: "not_started",
    },
    score: { type: Number, min: 0, max: 100 },
    timeSpentMinutes: { type: Number, default: 0, min: 0 },
    attempts: { type: Number, default: 0, min: 0 },
    lastAccessed: { type: Date, default: Date.now },
    progressData: {
      correctAnswers: { type: Number, min: 0 },
      totalQuestions: { type: Number, min: 0 },
      averageResponseTime: { type: Number, min: 0 },
      streakDays: { type: Number, min: 0 },
      weakAreas: [{ type: String }],
    },
    notes: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

// Compound Index für unique user-content Kombination
UserProgressSchema.index(
  { userId: 1, contentType: 1, contentId: 1 },
  { unique: true }
);
UserProgressSchema.index({ userId: 1, level: 1 });
UserProgressSchema.index({ userId: 1, status: 1 });

export default mongoose.model<IUserProgress>(
  "UserProgress",
  UserProgressSchema
);
