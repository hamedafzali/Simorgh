const express = require("express");
const AnalyticsEvent = require("../models/AnalyticsEvent");

const MAX_BATCH_SIZE = 100;
const MAX_NAME_LENGTH = 64;

// Public router — mounted under /api/analytics, protected by the app API key
const publicRouter = express.Router();

publicRouter.post("/events", async (req, res) => {
  try {
    const { events } = req.body || {};
    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: "events array required" });
    }

    const docs = events
      .slice(0, MAX_BATCH_SIZE)
      .filter((e) => e && typeof e.name === "string" && e.name.length > 0)
      .map((e) => ({
        name: String(e.name).slice(0, MAX_NAME_LENGTH),
        props: typeof e.props === "object" && e.props !== null ? e.props : {},
        deviceId: typeof e.deviceId === "string" ? e.deviceId : "",
        platform: typeof e.platform === "string" ? e.platform : "",
        appVersion: typeof e.appVersion === "string" ? e.appVersion : "",
        occurredAt: e.occurredAt ? new Date(e.occurredAt) : new Date(),
      }));

    if (docs.length === 0) {
      return res.status(400).json({ error: "no valid events" });
    }

    await AnalyticsEvent.insertMany(docs, { ordered: false });
    res.json({ accepted: docs.length });
  } catch (error) {
    console.error("Analytics ingest error:", error);
    res.status(500).json({ error: "Failed to store events" });
  }
});

// Admin router — mounted under /api/admin/analytics, protected by admin JWT
const adminRouter = express.Router();

adminRouter.get("/summary", async (req, res) => {
  try {
    const days = Math.min(parseInt(req.query.days, 10) || 30, 365);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [byEvent, activeDevices, crashes] = await Promise.all([
      AnalyticsEvent.aggregate([
        { $match: { occurredAt: { $gte: since } } },
        {
          $group: {
            _id: "$name",
            count: { $sum: 1 },
            devices: { $addToSet: "$deviceId" },
          },
        },
        {
          $project: {
            _id: 0,
            name: "$_id",
            count: 1,
            uniqueDevices: { $size: "$devices" },
          },
        },
        { $sort: { count: -1 } },
      ]),
      AnalyticsEvent.distinct("deviceId", { occurredAt: { $gte: since } }),
      AnalyticsEvent.find({ name: "app_error", occurredAt: { $gte: since } })
        .sort({ occurredAt: -1 })
        .limit(20)
        .lean(),
    ]);

    res.json({
      since,
      days,
      activeDevices: activeDevices.filter(Boolean).length,
      events: byEvent,
      recentErrors: crashes,
    });
  } catch (error) {
    console.error("Analytics summary error:", error);
    res.status(500).json({ error: "Failed to get summary" });
  }
});

module.exports = { publicRouter, adminRouter };
