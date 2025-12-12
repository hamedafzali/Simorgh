import mongoose, { Document, Schema } from "mongoose";

export interface IGrammar extends Document {
  title: string;
  description: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  category:
    | "verbs"
    | "nouns"
    | "adjectives"
    | "sentence_structure"
    | "cases"
    | "tenses"
    | "prepositions"
    | "conjunctions";
  difficultyScore: number;
  rules: Array<{
    name: string;
    description: string;
    formula?: string;
    exceptions?: string[];
    examples: string[];
    level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  }>;
  exercises: mongoose.Types.ObjectId[];
  prerequisites: mongoose.Types.ObjectId[];
  relatedTopics: mongoose.Types.ObjectId[];
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GrammarSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    level: {
      type: String,
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
      required: true,
    },
    category: {
      type: String,
      enum: [
        "verbs",
        "nouns",
        "adjectives",
        "sentence_structure",
        "cases",
        "tenses",
        "prepositions",
        "conjunctions",
      ],
      required: true,
    },
    difficultyScore: { type: Number, min: 1, max: 10, required: true },
    rules: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
        formula: { type: String },
        exceptions: [{ type: String }],
        examples: [{ type: String, required: true }],
        level: {
          type: String,
          enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
          required: true,
        },
      },
    ],
    exercises: [{ type: Schema.Types.ObjectId, ref: "Exercise" }],
    prerequisites: [{ type: Schema.Types.ObjectId, ref: "Grammar" }],
    relatedTopics: [{ type: Schema.Types.ObjectId, ref: "Grammar" }],
    tags: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Indexes
GrammarSchema.index({ level: 1 });
GrammarSchema.index({ category: 1 });
GrammarSchema.index({ difficultyScore: 1 });
GrammarSchema.index({ tags: 1 });

export default mongoose.model<IGrammar>("Grammar", GrammarSchema);
