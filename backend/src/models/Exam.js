const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: Number, required: true },
  explanation: { type: String, required: true },
  questionData: { type: mongoose.Schema.Types.Mixed },
  points: { type: Number, default: 5 },
  orderIndex: { type: Number, required: true },
});

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  level: {
    type: String,
    required: true,
    enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
  },
  topicCategory: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  questions: [questionSchema],
  passingScore: { type: Number, required: true },
  maxAttempts: { type: Number, default: 3 },
  instructions: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

examSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Exam", examSchema);
