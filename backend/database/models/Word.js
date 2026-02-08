const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema({
  german: { type: String, required: true },
  english: { type: String, required: true },
  persian: { type: String, required: true },
  level: {
    type: String,
    enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
    required: true,
  },
  category: { type: String, required: true },
  difficulty: { type: Number, default: 1 },
  pronunciation: { type: String },
  audioUrl: { type: String },
  imageUrl: { type: String },
  tags: [{ type: String }],
  examples: [
    {
      german: { type: String, required: true },
      english: { type: String, required: true },
      persian: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Word", wordSchema);
