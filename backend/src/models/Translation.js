const mongoose = require("mongoose");

const translationSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // `${from}|${to}|${text}`
  from: { type: String, required: true },
  to: { type: String, required: true },
  text: { type: String, required: true },
  result: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Translation", translationSchema);
