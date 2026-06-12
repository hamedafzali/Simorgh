const fs = require('fs').promises;
const mongoose = require('mongoose');

// Mongo-backed key/value store for admin-managed JSON content (settings,
// events, countries). Replaces the old on-disk JSON files so the backend can
// run on hosts without a persistent disk. If a legacy file exists and Mongo
// has no document yet, the file content is imported once.

const jsonDocSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed },
    updatedAt: { type: Date, default: Date.now },
  },
  { minimize: false }
);

const JsonDoc = mongoose.model('JsonStore', jsonDocSchema);

function mongoReady() {
  return mongoose.connection.readyState === 1;
}

async function readLegacyFile(legacyPath) {
  if (!legacyPath) return null;
  try {
    const raw = await fs.readFile(legacyPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function readStore(key, fallback, legacyPath) {
  if (!mongoReady()) return fallback;
  try {
    const doc = await JsonDoc.findOne({ key }).lean();
    if (doc) return doc.value;

    const legacy = await readLegacyFile(legacyPath);
    const initial = legacy ?? fallback;
    await JsonDoc.create({ key, value: initial });
    return initial;
  } catch (error) {
    console.error(`json-store read failed for "${key}":`, error.message);
    return fallback;
  }
}

async function writeStore(key, value) {
  if (!mongoReady()) {
    throw new Error('Database not connected — cannot save changes');
  }
  await JsonDoc.updateOne(
    { key },
    { $set: { value, updatedAt: new Date() } },
    { upsert: true }
  );
  return value;
}

module.exports = { readStore, writeStore };
