import * as SecureStore from "expo-secure-store";

export type StoredDocument = {
  id: string;
  title: string;
  type: "id" | "visa" | "contract" | "certificate" | "other";
  note?: string;
  createdAt: string;
};

const STORAGE_KEY = "Simorgh.documents.v1";

let inMemoryDocs: StoredDocument[] | null = null;

async function readAll(): Promise<StoredDocument[]> {
  if (inMemoryDocs) return inMemoryDocs;

  try {
    const value = await SecureStore.getItemAsync(STORAGE_KEY);
    if (!value) {
      inMemoryDocs = [];
      return inMemoryDocs;
    }
    const parsed = JSON.parse(value) as StoredDocument[];
    inMemoryDocs = parsed;
    return parsed;
  } catch (error) {
    console.warn("documents readAll error", error);
    inMemoryDocs = [];
    return inMemoryDocs;
  }
}

async function writeAll(docs: StoredDocument[]): Promise<void> {
  inMemoryDocs = docs;
  try {
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(docs));
  } catch (error) {
    console.warn("documents writeAll error", error);
  }
}

export async function listDocuments(): Promise<StoredDocument[]> {
  return readAll();
}

export async function addDocument(input: {
  title: string;
  type?: StoredDocument["type"];
  note?: string;
}): Promise<StoredDocument[]> {
  const docs = await readAll();
  const now = new Date().toISOString();
  const doc: StoredDocument = {
    id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
    title: input.title,
    type: input.type ?? "other",
    note: input.note,
    createdAt: now,
  };
  const updated = [doc, ...docs];
  await writeAll(updated);
  return updated;
}

export async function removeDocument(id: string): Promise<StoredDocument[]> {
  const docs = await readAll();
  const updated = docs.filter((d) => d.id !== id);
  await writeAll(updated);
  return updated;
}
