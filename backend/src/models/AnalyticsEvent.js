const mongoose = require("mongoose");

const analyticsEventSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  props: { type: mongoose.Schema.Types.Mixed, default: {} },
  deviceId: { type: String, default: "", index: true },
  platform: { type: String, default: "" },
  appVersion: { type: String, default: "" },
  occurredAt: { type: Date, default: Date.now, index: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AnalyticsEvent", analyticsEventSchema);
