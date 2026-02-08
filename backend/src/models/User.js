const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "" },
  },
  preferences: {
    language: { type: String, default: "en" },
    level: {
      type: String,
      default: "A1",
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
    },
    studyGoals: { type: Number, default: 10 }, // minutes per day
    notifications: { type: Boolean, default: true },
  },
  progress: {
    totalWordsLearned: { type: Number, default: 0 },
    totalFlashcardsReviewed: { type: Number, default: 0 },
    totalExamsCompleted: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastStudyDate: { type: Date },
  },
  subscription: {
    type: { type: String, default: "free", enum: ["free", "premium"] },
    startDate: { type: Date },
    endDate: { type: Date },
    features: [{ type: String }],
  },
  isActive: { type: Boolean, default: true },
  lastSeen: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Static methods for user statistics
userSchema.statics.getActiveUsers = function (timeRange = 5 * 60 * 1000) {
  const cutoffTime = new Date(Date.now() - timeRange);
  return this.countDocuments({ lastSeen: { $gte: cutoffTime } });
};

userSchema.statics.getActiveTodayUsers = function () {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return this.countDocuments({ lastSeen: { $gte: todayStart } });
};

module.exports = mongoose.model("User", userSchema);
