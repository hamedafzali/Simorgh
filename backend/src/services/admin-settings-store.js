const path = require('path');
const { readStore, writeStore } = require('./json-store');

// Legacy file location — imported into Mongo once if present
const settingsPath = path.join(__dirname, '../../../admin/dist/admin-data/settings.json');

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
    jobs: true,
    chat: false,
    events: true,
    documents: true,
    countries: false,
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
  countryConfig: {
    DE: {
      enabled: true,
      name: 'Germany',
      features: {
        learning: true, community: true, jobs: true, chat: false,
        events: true, documents: true, countries: false, checklist: true,
        deadlines: true, forms: true, emergency: true, phrasebook: true,
        reminders: true, school: true, support: true, housing: true,
        tax: true, services: true, guides: true, locations: true, timeline: true,
      },
    },
    CA: {
      enabled: false,
      name: 'Canada',
      features: {
        learning: false, community: false, jobs: false, chat: false,
        events: false, documents: false, countries: false, checklist: false,
        deadlines: false, forms: false, emergency: true, phrasebook: false,
        reminders: false, school: false, support: false, housing: false,
        tax: false, services: false, guides: false, locations: false, timeline: false,
      },
    },
    US: {
      enabled: false,
      name: 'United States',
      features: {
        learning: false, community: false, jobs: false, chat: false,
        events: false, documents: false, countries: false, checklist: false,
        deadlines: false, forms: false, emergency: true, phrasebook: false,
        reminders: false, school: false, support: false, housing: false,
        tax: false, services: false, guides: false, locations: false, timeline: false,
      },
    },
    UK: {
      enabled: false,
      name: 'United Kingdom',
      features: {
        learning: false, community: false, jobs: false, chat: false,
        events: false, documents: false, countries: false, checklist: false,
        deadlines: false, forms: false, emergency: true, phrasebook: false,
        reminders: false, school: false, support: false, housing: false,
        tax: false, services: false, guides: false, locations: false, timeline: false,
      },
    },
    AU: {
      enabled: false,
      name: 'Australia',
      features: {
        learning: false, community: false, jobs: false, chat: false,
        events: false, documents: false, countries: false, checklist: false,
        deadlines: false, forms: false, emergency: true, phrasebook: false,
        reminders: false, school: false, support: false, housing: false,
        tax: false, services: false, guides: false, locations: false, timeline: false,
      },
    },
    TR: {
      enabled: false,
      name: 'Turkey',
      features: {
        learning: false, community: false, jobs: false, chat: false,
        events: false, documents: false, countries: false, checklist: false,
        deadlines: false, forms: false, emergency: true, phrasebook: false,
        reminders: false, school: false, support: false, housing: false,
        tax: false, services: false, guides: false, locations: false, timeline: false,
      },
    },
    SE: {
      enabled: false,
      name: 'Sweden',
      features: {
        learning: false, community: false, jobs: false, chat: false,
        events: false, documents: false, countries: false, checklist: false,
        deadlines: false, forms: false, emergency: true, phrasebook: false,
        reminders: false, school: false, support: false, housing: false,
        tax: false, services: false, guides: false, locations: false, timeline: false,
      },
    },
  },
};

async function getSettings() {
  const stored = await readStore('settings', defaultSettings, settingsPath);
  return { ...defaultSettings, ...stored };
}

async function saveSettings(settings) {
  const next = { ...defaultSettings, ...settings };
  await writeStore('settings', next);
  return next;
}

module.exports = { getSettings, saveSettings, defaultSettings, settingsPath };
