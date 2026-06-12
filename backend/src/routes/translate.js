const express = require("express");
const Translation = require("../models/Translation");

const router = express.Router();

// Proxies MyMemory translation with a permanent Mongo cache so repeated
// translations (same job titles, phrases) never hit the upstream quota.
// MYMEMORY_EMAIL raises the free quota from ~5k to ~50k chars/day.
const MYMEMORY_URL = "https://api.mymemory.translated.net/get";
const MYMEMORY_EMAIL = process.env.MYMEMORY_EMAIL || "";
const MAX_TEXT_LENGTH = 500;

const memCache = new Map(); // key -> result (hot path, resets on restart)
const MAX_MEM_CACHE = 500;

router.get("/", async (req, res) => {
  try {
    const text = String(req.query.q || "").slice(0, MAX_TEXT_LENGTH).trim();
    const from = String(req.query.from || "de").slice(0, 5);
    const to = String(req.query.to || "fa").slice(0, 5);
    if (!text) return res.status(400).json({ error: "q required" });

    const key = `${from}|${to}|${text}`;

    if (memCache.has(key)) {
      return res.json({ result: memCache.get(key), cached: true });
    }

    const stored = await Translation.findOne({ key }).lean();
    if (stored) {
      memCache.set(key, stored.result);
      return res.json({ result: stored.result, cached: true });
    }

    const params = new URLSearchParams({ q: text, langpair: `${from}|${to}` });
    if (MYMEMORY_EMAIL) params.set("de", MYMEMORY_EMAIL);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(`${MYMEMORY_URL}?${params}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`MyMemory: HTTP ${response.status}`);
    const data = await response.json();
    const result = data?.responseData?.translatedText;
    if (!result) throw new Error("MyMemory: empty result");

    if (memCache.size >= MAX_MEM_CACHE) {
      memCache.delete(memCache.keys().next().value);
    }
    memCache.set(key, result);
    Translation.create({ key, from, to, text, result }).catch(() => {});

    res.json({ result, cached: false });
  } catch (error) {
    console.error("Translate proxy error:", error.message);
    res.status(502).json({ error: "Translation temporarily unavailable" });
  }
});

module.exports = router;
