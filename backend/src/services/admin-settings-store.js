const fs = require('fs').promises;
const path = require('path');

const dataDir = path.join(__dirname, '../../../admin/dist/admin-data');
const settingsPath = path.join(dataDir, 'settings.json');

const defaultSettings = {
  general: {
    appName: 'Simorgh',
    version: '1.0.0',
    maintenance: false,
    debugMode: false,
    maxUsers: 10000,
  },
  database: {
    host: 'localhost',
    port: 27017,
    name: 'simorgh',
    autoBackup: true,
    backupInterval: 24,
    maxBackups: 10,
  },
  security: {
    jwtSecret: 'your-secret-key',
    jwtExpiry: 24,
    rateLimit: true,
    maxRequests: 100,
    corsEnabled: true,
    allowedOrigins: ['http://localhost:3000'],
  },
  notifications: {
    emailEnabled: false,
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPass: '',
    pushEnabled: true,
    pushKey: '',
  },
  analytics: {
    enabled: true,
    trackingCode: '',
    anonymizeData: true,
    retentionDays: 90,
  },
  featureFlags: {
    learning: true,
    community: true,
    jobs: false,
    chat: false,
    events: true,
    documents: true,
    countries: true,
    checklist: true,
    deadlines: true,
    forms: true,
    emergency: true,
    phrasebook: true,
    reminders: true,
    school: true,
    support: true,
    housing: true,
    tax: true,
    services: true,
    guides: true,
    locations: true,
    timeline: true,
  },
};

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try { await fs.access(settingsPath); } catch { await fs.writeFile(settingsPath, JSON.stringify(defaultSettings, null, 2)); }
}

async function getSettings() {
  await ensureStore();
  try {
    const raw = await fs.readFile(settingsPath, 'utf8');
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

async function saveSettings(settings) {
  await ensureStore();
  const next = { ...defaultSettings, ...settings };
  await fs.writeFile(settingsPath, JSON.stringify(next, null, 2));
  return next;
}

module.exports = { getSettings, saveSettings, defaultSettings, settingsPath };
