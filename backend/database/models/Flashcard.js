const mongoose = require("mongoose");

const flashcardSchema = new mongoose.Schema({
  front: { type: String, required: true },
  back: { type: String, required: true },
  type: {
    type: String,
    enum: ["word", "grammar", "phrase"],
    default: "word",
  },
  difficulty: { type: Number, default: 1 },
  interval: { type: Number, default: 1 },
  repetitions: { type: Number, default: 0 },
  easeFactor: { type: Number, default: 2.5 },
  nextReview: { type: Date, required: true },
  wordId: { type: mongoose.Schema.Types.ObjectId, ref: "Word" },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Flashcard", flashcardSchema);
