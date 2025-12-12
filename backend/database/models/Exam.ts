import mongoose, { Document, Schema } from "mongoose";

export interface IExam extends Document {
  title: string;
  description: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  examType: "practice" | "mock" | "certification";
  durationMinutes: number;
  passingScore: number;
  sections: Array<{
    title: string;
    sectionType:
      | "reading"
      | "writing"
      | "listening"
      | "speaking"
      | "grammar"
      | "vocabulary";
    durationMinutes: number;
    questionCount: number;
    weightPercentage: number;
    orderIndex: number;
    exercises: mongoose.Types.ObjectId[];
  }>;
  instructions: string;
  maxAttempts?: number;
  isActive: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ExamSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    level: {
      type: String,
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
      required: true,
    },
    examType: {
      type: String,
      enum: ["practice", "mock", "certification"],
      required: true,
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    passingScore: { type: Number, required: true, min: 0, max: 100 },
    sections: [
      {
        title: { type: String, required: true },
        sectionType: {
          type: String,
          enum: [
            "reading",
            "writing",
            "listening",
            "speaking",
            "grammar",
            "vocabulary",
          ],
          required: true,
        },
        durationMinutes: { type: Number, required: true, min: 1 },
        questionCount: { type: Number, required: true, min: 1 },
        weightPercentage: { type: Number, required: true, min: 0, max: 100 },
        orderIndex: { type: Number, required: true },
        exercises: [{ type: Schema.Types.ObjectId, ref: "Exercise" }],
      },
    ],
    instructions: { type: String, required: true },
    maxAttempts: { type: Number, min: 1 },
    isActive: { type: Boolean, default: true },
    tags: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
  }
);

// Indexes
ExamSchema.index({ level: 1 });
ExamSchema.index({ examType: 1 });
ExamSchema.index({ isActive: 1 });

export default mongoose.model<IExam>("Exam", ExamSchema);
