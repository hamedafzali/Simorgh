const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  currentLevel: {
    type: String,
    enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
    default: "A1",
  },
  totalWords: { type: Number, default: 0 },
  masteredWords: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  streakDays: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  grammarProgress: {
    present: { type: Number, default: 0 },
    past: { type: Number, default: 0 },
    future: { type: Number, default: 0 },
  },
  vocabularyProgress: {
    greetings: { type: Number, default: 0 },
    pronouns: { type: Number, default: 0 },
    verbs: { type: Number, default: 0 },
    nouns: { type: Number, default: 0 },
    adjectives: { type: Number, default: 0 },
  },
  lastActiveDate: { type: Date, default: Date.now },
  totalExams: { type: Number, default: 0 },
  examAttempts: { type: Number, default: 0 },
  lastExamScore: { type: Number },
  lastExamDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserProgress", userProgressSchema);
