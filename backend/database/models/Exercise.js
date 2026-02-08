const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  title: { type: String, required: true },
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
  difficultyScore: { type: Number, default: 1 },
  timeLimitMinutes: { type: Number },
  questions: [
    {
      question: { type: String, required: true },
      questionData: { type: mongoose.Schema.Types.Mixed },
      options: [{ type: String }],
      correctAnswer: { type: mongoose.Schema.Types.Mixed, required: true },
      explanation: { type: String },
      points: { type: Number, default: 1 },
      orderIndex: { type: Number, required: true },
    },
  ],
  instructions: { type: String },
  passingScore: { type: Number, default: 70 },
  maxAttempts: { type: Number, default: 3 },
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Exercise", exerciseSchema);
