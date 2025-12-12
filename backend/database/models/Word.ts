import mongoose, { Document, Schema } from "mongoose";

export interface IWord extends Document {
  word: string;
  article: "der" | "die" | "das" | "ein" | "eine";
  wordType:
    | "noun"
    | "verb"
    | "adjective"
    | "adverb"
    | "preposition"
    | "conjunction"
    | "pronoun"
    | "interjection";
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  frequencyScore: number;
  phonetic?: string;
  translations: Array<{
    language: string;
    text: string;
    isPrimary: boolean;
    contextNotes?: string;
  }>;
  definitions: Array<{
    text: string;
    example?: string;
    level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  }>;
  conjugations?: Array<{
    tense: string;
    person: string;
    form: string;
    auxiliaryVerb?: string;
  }>;
  relatedWords: mongoose.Types.ObjectId[];
  tags: string[];
  audioFiles: {
    pronunciation?: string;
    examples?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const WordSchema: Schema = new Schema(
  {
    word: { type: String, required: true, trim: true },
    article: {
      type: String,
      enum: ["der", "die", "das", "ein", "eine"],
      required: function (this: IWord) {
        return this.wordType === "noun";
      },
    },
    wordType: {
      type: String,
      enum: [
        "noun",
        "verb",
        "adjective",
        "adverb",
        "preposition",
        "conjunction",
        "pronoun",
        "interjection",
      ],
      required: true,
    },
    level: {
      type: String,
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
      required: true,
    },
    frequencyScore: { type: Number, min: 0, max: 10, default: 5 },
    phonetic: { type: String, trim: true },
    translations: [
      {
        language: { type: String, required: true },
        text: { type: String, required: true },
        isPrimary: { type: Boolean, default: false },
        contextNotes: { type: String },
      },
    ],
    definitions: [
      {
        text: { type: String, required: true },
        example: { type: String },
        level: {
          type: String,
          enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
          required: true,
        },
      },
    ],
    conjugations: [
      {
        tense: { type: String, required: true },
        person: { type: String, required: true },
        form: { type: String, required: true },
        auxiliaryVerb: { type: String },
      },
    ],
    relatedWords: [{ type: Schema.Types.ObjectId, ref: "Word" }],
    tags: [{ type: String, trim: true }],
    audioFiles: {
      pronunciation: { type: String },
      examples: [{ type: String }],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes für bessere Performance
WordSchema.index({ word: 1 });
WordSchema.index({ level: 1 });
WordSchema.index({ wordType: 1 });
WordSchema.index({ frequencyScore: -1 });
WordSchema.index({ tags: 1 });

export default mongoose.model<IWord>("Word", WordSchema);
