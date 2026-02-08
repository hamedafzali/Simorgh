const mongoose = require("mongoose");

const databaseVersionSchema = new mongoose.Schema({
  version: { type: String, required: true, unique: true },
  buildNumber: { type: Number, required: true, unique: true },
  description: { type: String, required: true },
  changelog: [{ type: String }],
  minAppVersion: { type: String, required: true },
  dataStats: {
    words: { type: Number, default: 0 },
    flashcards: { type: Number, default: 0 },
    exams: { type: Number, default: 0 },
    exercises: { type: Number, default: 0 },
  },
  isPublished: { type: Boolean, default: false },
  isForced: { type: Boolean, default: false },
  releaseDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

databaseVersionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Static methods
databaseVersionSchema.statics.getLatestPublished = function () {
  return this.findOne({ isPublished: true }).sort({ buildNumber: -1 });
};

databaseVersionSchema.statics.compareVersions = function (version1, version2) {
  const v1parts = version1.split(".").map(Number);
  const v2parts = version2.split(".").map(Number);

  for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
    const v1part = v1parts[i] || 0;
    const v2part = v2parts[i] || 0;

    if (v1part < v2part) return -1;
    if (v1part > v2part) return 1;
  }

  return 0;
};

module.exports = mongoose.model("DatabaseVersion", databaseVersionSchema);
