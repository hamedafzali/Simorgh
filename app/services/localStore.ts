import { database } from "../database";

let initPromise: Promise<void> | null = null;

async function ensureDb(): Promise<void> {
  try {
    database.getDatabase();
    return;
  } catch {
    // not initialized yet
  }

  if (!initPromise) {
    initPromise = database.init().finally(() => {
      initPromise = null;
    });
  }

  await initPromise;
}

export async function getJson<T>(key: string, fallback: T): Promise<T> {
  try {
    await ensureDb();
    const db = database.getDatabase();
    const result = (await db.getFirstAsync(
      "SELECT value FROM user_settings WHERE key = ?",
      [key]
    )) as { value: string } | undefined;
    if (result?.value) {
      return JSON.parse(result.value) as T;
    }
  } catch {
    // ignore storage errors for now
  }
  return fallback;
}

export async function setJson(key: string, value: unknown): Promise<void> {
  try {
    await ensureDb();
    const db = database.getDatabase();
    await db.runAsync(
      `
      INSERT OR REPLACE INTO user_settings (id, key, value, updatedAt)
      VALUES (?, ?, ?, ?)
    `,
      [key, key, JSON.stringify(value), new Date().toISOString()]
    );
  } catch {
    // ignore storage errors for now
  }
}
