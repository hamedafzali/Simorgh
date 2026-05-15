const fs = require('fs').promises;
const path = require('path');

const sqliteRoot = path.join(__dirname, '../../../admin/dist/sqlite');
const artifactsDir = path.join(sqliteRoot, 'artifacts');
const manifestPath = path.join(artifactsDir, 'manifest.json');
const currentDbPath = path.join(sqliteRoot, 'simorgh_app.db');
const currentPackagePath = path.join(sqliteRoot, 'simorgh-app-package.json');

async function ensureArtifactsDir() {
  await fs.mkdir(artifactsDir, { recursive: true });
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readManifest() {
  await ensureArtifactsDir();
  if (!(await fileExists(manifestPath))) return [];
  try {
    const raw = await fs.readFile(manifestPath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeManifest(items) {
  await ensureArtifactsDir();
  await fs.writeFile(manifestPath, JSON.stringify(items, null, 2));
}

function buildId(prefix = 'artifact') {
  return `${prefix}_${Date.now()}`;
}

async function getCurrentCounts() {
  if (!(await fileExists(currentDbPath))) {
    return { exams: 0, flashcards: 0, words: 0 };
  }

  const sqlite3 = require('sqlite3');
  const db = new sqlite3.Database(currentDbPath);
  const query = (sql) =>
    new Promise((resolve, reject) => {
      db.get(sql, (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    });

  try {
    const [exams, flashcards, words] = await Promise.all([
      query('SELECT COUNT(*) as count FROM exams'),
      query('SELECT COUNT(*) as count FROM flashcards'),
      query('SELECT COUNT(*) as count FROM words'),
    ]);
    return { exams, flashcards, words };
  } finally {
    db.close();
  }
}

async function createArtifact({ name, description = '', type = 'generated' } = {}) {
  await ensureArtifactsDir();
  if (!(await fileExists(currentDbPath))) {
    throw new Error('No generated SQLite database found');
  }

  const id = buildId(type === 'backup' ? 'backup' : 'artifact');
  const dbFileName = `${id}.db`;
  const dbTargetPath = path.join(artifactsDir, dbFileName);
  await fs.copyFile(currentDbPath, dbTargetPath);

  let packageFileName = null;
  if (await fileExists(currentPackagePath)) {
    packageFileName = `${id}.package.json`;
    await fs.copyFile(currentPackagePath, path.join(artifactsDir, packageFileName));
  }

  const dbStat = await fs.stat(dbTargetPath);
  const counts = await getCurrentCounts();
  const createdAt = new Date().toISOString();
  const artifact = {
    id,
    name: name || `SQLite ${type === 'backup' ? 'backup' : 'artifact'} ${new Date(createdAt).toLocaleString('sv-SE').replace(' ', ' ')}`,
    description,
    type,
    status: 'completed',
    createdAt,
    size: dbStat.size,
    counts,
    databaseFile: dbFileName,
    packageFile: packageFileName,
  };

  const manifest = await readManifest();
  manifest.unshift(artifact);
  await writeManifest(manifest);
  return artifact;
}

async function listArtifacts() {
  return await readManifest();
}

async function deleteArtifact(id) {
  const manifest = await readManifest();
  const artifact = manifest.find((item) => item.id === id);
  if (!artifact) throw new Error('Artifact not found');

  const files = [artifact.databaseFile, artifact.packageFile]
    .filter(Boolean)
    .map((file) => path.join(artifactsDir, file));

  await Promise.all(files.map(async (file) => {
    if (await fileExists(file)) await fs.unlink(file);
  }));

  await writeManifest(manifest.filter((item) => item.id !== id));
  return artifact;
}

async function getArtifact(id) {
  const manifest = await readManifest();
  const artifact = manifest.find((item) => item.id === id);
  if (!artifact) throw new Error('Artifact not found');
  return artifact;
}

async function getArtifactFile(id, kind = 'db') {
  const artifact = await getArtifact(id);
  const fileName = kind === 'package' ? artifact.packageFile : artifact.databaseFile;
  if (!fileName) throw new Error('Requested file is not available');
  const filePath = path.join(artifactsDir, fileName);
  if (!(await fileExists(filePath))) throw new Error('Artifact file not found');
  return { artifact, filePath };
}

async function getArtifactTables(id) {
  const { filePath } = await getArtifactFile(id, 'db');
  const sqlite3 = require('sqlite3');
  const db = new sqlite3.Database(filePath);

  const all = (sql, params = []) =>
    new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

  try {
    const tables = await all(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    );
    return tables.map((row) => row.name);
  } finally {
    db.close();
  }
}

async function getArtifactTableRows(id, table, { limit = 25, offset = 0 } = {}) {
  const { filePath } = await getArtifactFile(id, 'db');
  const sqlite3 = require('sqlite3');
  const db = new sqlite3.Database(filePath);

  const get = (sql, params = []) =>
    new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  const all = (sql, params = []) =>
    new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

  try {
    const tables = await getArtifactTables(id);
    if (!tables.includes(table)) {
      throw new Error('Table not found');
    }

    const totalRow = await get(`SELECT COUNT(*) as count FROM "${table}"`);
    const rows = await all(
      `SELECT * FROM "${table}" LIMIT ? OFFSET ?`,
      [Number(limit), Number(offset)]
    );
    return { total: totalRow?.count || 0, rows };
  } finally {
    db.close();
  }
}

async function restoreArtifact(id) {
  const artifact = await getArtifact(id);
  const sourceDb = path.join(artifactsDir, artifact.databaseFile);
  if (!(await fileExists(sourceDb))) throw new Error('Artifact database file not found');
  await fs.copyFile(sourceDb, currentDbPath);

  if (artifact.packageFile) {
    const sourcePackage = path.join(artifactsDir, artifact.packageFile);
    if (await fileExists(sourcePackage)) {
      await fs.copyFile(sourcePackage, currentPackagePath);
    }
  }

  return artifact;
}

module.exports = {
  artifactsDir,
  currentDbPath,
  currentPackagePath,
  createArtifact,
  listArtifacts,
  deleteArtifact,
  getArtifact,
  getArtifactFile,
  getArtifactTables,
  getArtifactTableRows,
  restoreArtifact,
};
