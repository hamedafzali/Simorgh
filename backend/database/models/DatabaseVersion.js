const mongoose = require("mongoose");

const databaseVersionSchema = new mongoose.Schema(
  {
    version: { type: String, required: true, unique: true },
    buildNumber: { type: Number, required: true },
    isPublished: { type: Boolean, default: false },
    isForced: { type: Boolean, default: false }, // Force update for all users
    description: { type: String, required: true },
    changelog: [{ type: String }],
    releaseDate: { type: Date, default: Date.now },
    minAppVersion: { type: String, required: true }, // Minimum app version required
    dataStats: {
      words: { type: Number, default: 0 },
      flashcards: { type: Number, default: 0 },
      exams: { type: Number, default: 0 },
      exercises: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for queries
databaseVersionSchema.index({ version: 1 });
databaseVersionSchema.index({ isPublished: 1 });
databaseVersionSchema.index({ buildNumber: -1 });

// Pre-save middleware to ensure only one published version
databaseVersionSchema.pre("save", async function (next) {
  if (this.isPublished) {
    // Unpublish all other versions before publishing this one
    await mongoose.models.DatabaseVersion.updateMany(
      { _id: { $ne: this._id } },
      { isPublished: false }
    );
  }
  next();
});

// Static method to compare versions
databaseVersionSchema.statics.compareVersions = function (version1, version2) {
  const v1parts = version1.split(".").map(Number);
  const v2parts = version2.split(".").map(Number);

  for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
    const v1part = v1parts[i] || 0;
    const v2part = v2parts[i] || 0;

    if (v1part > v2part) return 1;
    if (v1part < v2part) return -1;
  }
  return 0;
};

// Static method to get latest published version
databaseVersionSchema.statics.getLatestPublished = async function () {
  return await this.findOne({ isPublished: true }).sort({ buildNumber: -1 });
};

module.exports = mongoose.model("DatabaseVersion", databaseVersionSchema);
