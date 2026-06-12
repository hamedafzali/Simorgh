const express = require("express");

const router = express.Router();

// Official Bundesagentur für Arbeit job search API (free, public).
// Docs: https://jobsuche.api.bund.dev — the X-API-Key below is the public
// client key published by the agency, not a secret.
const ARBEITSAGENTUR_URL =
  "https://rest.arbeitsagentur.de/jobboerse/jobsuche-service/pc/v4/jobs";
const ARBEITSAGENTUR_KEY = "jobboerse-jobsuche";

const CACHE_TTL_MS = 10 * 60 * 1000;
const MAX_CACHE_ENTRIES = 100;
const cache = new Map(); // queryKey -> { at, payload }

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.at > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.payload;
}

function setCached(key, payload) {
  if (cache.size >= MAX_CACHE_ENTRIES) {
    const oldest = cache.keys().next().value;
    cache.delete(oldest);
  }
  cache.set(key, { at: Date.now(), payload });
}

function normalizeJob(item) {
  const refnr = item.refnr || "";
  return {
    id: refnr,
    title: item.titel || item.beruf || "",
    profession: item.beruf || "",
    company: item.arbeitgeber || "",
    city: item.arbeitsort?.ort || "",
    region: item.arbeitsort?.region || "",
    publishedAt: item.aktuelleVeroeffentlichungsdatum || null,
    startDate: item.eintrittsdatum || null,
    externalUrl: refnr
      ? `https://www.arbeitsagentur.de/jobsuche/jobdetail/${encodeURIComponent(refnr)}`
      : "https://www.arbeitsagentur.de/jobsuche/",
  };
}

router.get("/", async (req, res) => {
  try {
    const what = String(req.query.what || "").slice(0, 100);
    const where = String(req.query.where || "").slice(0, 100);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const size = Math.min(Math.max(parseInt(req.query.size, 10) || 20, 1), 50);

    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (what) params.set("was", what);
    if (where) params.set("wo", where);

    const cacheKey = params.toString();
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(`${ARBEITSAGENTUR_URL}?${params}`, {
      headers: { "X-API-Key": ARBEITSAGENTUR_KEY },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Arbeitsagentur API: HTTP ${response.status}`);
    }

    const data = await response.json();
    const payload = {
      jobs: (data.stellenangebote || []).map(normalizeJob),
      total: data.maxErgebnisse ? Number(data.maxErgebnisse) : undefined,
      page,
      size,
      source: "Bundesagentur für Arbeit",
    };

    setCached(cacheKey, payload);
    res.json(payload);
  } catch (error) {
    console.error("Jobs proxy error:", error.message);
    res.status(502).json({ error: "Job search is temporarily unavailable" });
  }
});

module.exports = router;
