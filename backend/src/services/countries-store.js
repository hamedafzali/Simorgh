const path = require('path');
const { readStore, writeStore } = require('./json-store');

// Legacy file location — imported into Mongo once if present
const countriesPath = path.join(__dirname, '../../../admin/dist/admin-data/countries.json');

const defaultCountries = [
  { code: 'DE', name: 'Germany', localName: 'Deutschland', summary: 'Registration, insurance, and work essentials.', enabled: true },
  { code: 'CA', name: 'Canada', localName: 'Canada', summary: 'Arrival checklist and settlement basics.', enabled: false },
  { code: 'US', name: 'United States', localName: 'United States', summary: 'Immigration basics and local setup.', enabled: false },
  { code: 'UK', name: 'United Kingdom', localName: 'United Kingdom', summary: 'Healthcare, residency, and work prep.', enabled: false },
  { code: 'AU', name: 'Australia', localName: 'Australia', summary: 'Local onboarding and services.', enabled: false },
  { code: 'TR', name: 'Turkey', localName: 'Türkiye', summary: 'Residency, banking, and daily life.', enabled: false },
  { code: 'SE', name: 'Sweden', localName: 'Sverige', summary: 'Registration and services.', enabled: false },
];

async function getCountries() {
  return readStore('countries', defaultCountries, countriesPath);
}

async function saveCountries(countries) {
  await writeStore('countries', countries);
  return countries;
}

async function addCountry(country) {
  const countries = await getCountries();
  if (countries.find(c => c.code === country.code)) {
    throw new Error(`Country with code ${country.code} already exists`);
  }
  const next = [...countries, { enabled: false, ...country }];
  await saveCountries(next);
  return next;
}

async function updateCountry(code, updates) {
  const countries = await getCountries();
  const idx = countries.findIndex(c => c.code === code);
  if (idx === -1) throw new Error(`Country ${code} not found`);
  const next = [...countries];
  next[idx] = { ...next[idx], ...updates, code };
  await saveCountries(next);
  return next;
}

async function deleteCountry(code) {
  const countries = await getCountries();
  const next = countries.filter(c => c.code !== code);
  await saveCountries(next);
  return next;
}

module.exports = { getCountries, saveCountries, addCountry, updateCountry, deleteCountry, defaultCountries };
