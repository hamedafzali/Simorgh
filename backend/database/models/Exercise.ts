import mongoose, { Document, Schema } from "mongoose";

export interface IExercise extends Document {
  title: string;
  description: string;
  exerciseType:
    | "multiple_choice"
    | "fill_blank"
    | "translation"
    | "sentence_building"
    | "grammar_check"
    | "listening"
    | "reading";
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  topicCategory: string;
  difficultyScore: number;
  timeLimitMinutes?: number;
  questions: Array<{
    question: string;
    questionData?: any; // Für komplexe Fragestrukturen
    options?: string[];
    correctAnswer: string | number;
    explanation?: string;
    points: number;
    orderIndex: number;
  }>;
  instructions: string;
  passingScore?: number;
  maxAttempts?: number;
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ExerciseSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    exerciseType: {
      type: String,
      enum: [
        "multiple_choice",
        "fill_blank",
        "translation",
        "sentence_building",
        "grammar_check",
        "listening",
        "reading",
      ],
      required: true,
    },
    level: {
      type: String,
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
      required: true,
    },
    topicCategory: { type: String, required: true },
    difficultyScore: { type: Number, min: 1, max: 10, required: true },
    timeLimitMinutes: { type: Number, min: 1 },
    questions: [
      {
        question: { type: String, required: true },
        questionData: { type: Schema.Types.Mixed }, // Für komplexe JSON-Daten
        options: [{ type: String }],
        correctAnswer: { type: Schema.Types.Mixed, required: true },
        explanation: { type: String },
        points: { type: Number, default: 1, min: 1 },
        orderIndex: { type: Number, required: true },
      },
    ],
    instructions: { type: String, required: true },
    passingScore: { type: Number, min: 0, max: 100 },
    maxAttempts: { type: Number, min: 1 },
    tags: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Indexes
ExerciseSchema.index({ level: 1 });
ExerciseSchema.index({ exerciseType: 1 });
ExerciseSchema.index({ topicCategory: 1 });
ExerciseSchema.index({ difficultyScore: 1 });
ExerciseSchema.index({ tags: 1 });

export default mongoose.model<IExercise>("Exercise", ExerciseSchema);
