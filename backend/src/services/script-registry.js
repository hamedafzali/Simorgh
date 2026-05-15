const fs = require('fs').promises;
const path = require('path');

const dataDir = path.join(__dirname, '../../../admin/dist/admin-data');
const scriptsPath = path.join(dataDir, 'scripts.json');
const runsPath = path.join(dataDir, 'script-runs.json');

const defaultScripts = [
  {
    id: 'script_seed_sqlite',
    name: 'Generate SQLite Database',
    description: 'Generate the mobile SQLite database from MongoDB content.',
    category: 'seed',
    content: '// Generates the mobile SQLite database\nPOST /api/admin/database/generate-sqlite',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'ready',
    lastRun: null,
  },
  {
    id: 'script_package_sqlite',
    name: 'Package SQLite Artifact',
    description: 'Create a packaged SQLite artifact for distribution.',
    category: 'backup',
    content: '// Packages the current SQLite database\nPOST /api/admin/database/package-sqlite',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'ready',
    lastRun: null,
  },
];

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try { await fs.access(scriptsPath); } catch { await fs.writeFile(scriptsPath, JSON.stringify(defaultScripts, null, 2)); }
  try { await fs.access(runsPath); } catch { await fs.writeFile(runsPath, JSON.stringify([], null, 2)); }
}

async function readJson(file, fallback) {
  await ensureStore();
  try {
    const raw = await fs.readFile(file, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed;
  } catch {
    return fallback;
  }
}

async function writeJson(file, value) {
  await ensureStore();
  await fs.writeFile(file, JSON.stringify(value, null, 2));
}

async function listScripts() { return await readJson(scriptsPath, defaultScripts); }
async function saveScript(id, payload) {
  const scripts = await listScripts();
  const idx = scripts.findIndex((s) => s.id === id);
  const next = { ...payload, id, updatedAt: new Date().toISOString() };
  if (idx >= 0) scripts[idx] = { ...scripts[idx], ...next };
  else scripts.unshift({ ...next, createdAt: new Date().toISOString(), status: 'draft', lastRun: null });
  await writeJson(scriptsPath, scripts);
  return scripts.find((s) => s.id === id);
}
async function deleteScript(id) {
  const scripts = await listScripts();
  await writeJson(scriptsPath, scripts.filter((s) => s.id !== id));
}
async function getScript(id) { return (await listScripts()).find((s) => s.id === id) || null; }
async function listRuns() { return await readJson(runsPath, []); }
async function writeRuns(runs) { await writeJson(runsPath, runs); }
async function appendLog(scriptId, level, message) {
  const runs = await listRuns();
  const run = runs.find((r) => r.scriptId === scriptId && r.status === 'running') || runs.find((r) => r.scriptId === scriptId);
  if (!run) return;
  run.logs = run.logs || [];
  run.logs.unshift({ timestamp: new Date().toISOString(), level, message });
  await writeRuns(runs);
}
async function startRun(script) {
  const runs = await listRuns();
  const existing = runs.find((r) => r.scriptId === script.id && r.status === 'running');
  if (existing) return existing;
  const run = { id: `run_${Date.now()}`, scriptId: script.id, name: script.name, startedAt: new Date().toISOString(), progress: 10, status: 'running', logs: [{ timestamp: new Date().toISOString(), level: 'info', message: `Started ${script.name}` }] };
  runs.unshift(run);
  await writeRuns(runs);
  return run;
}
async function stopRun(scriptId) {
  const runs = await listRuns();
  const run = runs.find((r) => r.scriptId === scriptId && r.status === 'running');
  if (!run) return null;
  run.status = 'stopped';
  run.progress = run.progress || 0;
  run.logs.unshift({ timestamp: new Date().toISOString(), level: 'warn', message: 'Script stopped' });
  await writeRuns(runs);
  return run;
}
async function finishRun(scriptId, ok, message) {
  const runs = await listRuns();
  const run = runs.find((r) => r.scriptId === scriptId && r.status === 'running');
  if (!run) return null;
  run.status = ok ? 'completed' : 'failed';
  run.progress = ok ? 100 : run.progress || 0;
  run.logs.unshift({ timestamp: new Date().toISOString(), level: ok ? 'success' : 'error', message });
  await writeRuns(runs);
  return run;
}
async function updateScriptLastRun(scriptId) {
  const scripts = await listScripts();
  const script = scripts.find((s) => s.id === scriptId);
  if (script) {
    script.lastRun = new Date().toISOString();
    script.status = 'ready';
    script.updatedAt = new Date().toISOString();
    await writeJson(scriptsPath, scripts);
  }
}
module.exports = { listScripts, saveScript, deleteScript, getScript, listRuns, startRun, stopRun, finishRun, updateScriptLastRun, appendLog };
