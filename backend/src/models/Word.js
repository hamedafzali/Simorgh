const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema({
  german: { type: String, required: true },
  english: { type: String, required: true },
  category: { type: String, default: "general" },
  level: { type: String, default: "A1" },
  frequency: { type: Number, default: 1 },
  examples: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

wordSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Word", wordSchema);
