const mongoose = require("mongoose");

const flashcardSchema = new mongoose.Schema({
  front: { type: String, required: true },
  back: { type: String, required: true },
  type: { type: String, default: "general" },
  level: { type: String, default: "A1" },
  category: { type: String, default: "general" },
  nextReview: { type: Number, default: Date.now },
  reviewCount: { type: Number, default: 0 },
  difficulty: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

flashcardSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Flashcard", flashcardSchema);
