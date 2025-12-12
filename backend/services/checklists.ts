import AsyncStorage from "@react-native-async-storage/async-storage";

import { mockChecklistsBundle } from "@/services/mockData";

export type ChecklistItem = {
  id: string;
  label: string;
};

export type Checklist = {
  id: string;
  title: string;
  topic: string;
  items: ChecklistItem[];
};

export type ChecklistsBundle = {
  version: number;
  checklists: Checklist[];
};

// Default checklists bundle used when no stored data is present.
const initialChecklists: ChecklistsBundle = mockChecklistsBundle;

const CHECKLISTS_KEY = "Simorgh.checklists.bundle.v1";
const CHECKLIST_PROGRESS_KEY = "Simorgh.checklists.progress.v1";

export type ChecklistProgress = {
  checklistId: string;
  itemId: string;
  done: boolean;
};

let inMemoryBundle: ChecklistsBundle | null = null;
let inMemoryProgress: ChecklistProgress[] | null = null;

export async function loadChecklistsBundle(): Promise<ChecklistsBundle> {
  if (inMemoryBundle) return inMemoryBundle;
  try {
    const stored = await AsyncStorage.getItem(CHECKLISTS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as ChecklistsBundle;
      inMemoryBundle = parsed;
      return parsed;
    }
  } catch (error) {
    console.warn("loadChecklistsBundle error", error);
  }

  inMemoryBundle = initialChecklists;

  try {
    await AsyncStorage.setItem(
      CHECKLISTS_KEY,
      JSON.stringify(initialChecklists)
    );
  } catch (error) {
    console.warn("saveChecklistsBundle error", error);
  }

  return inMemoryBundle;
}

export async function loadChecklistProgress(): Promise<ChecklistProgress[]> {
  if (inMemoryProgress) return inMemoryProgress;
  try {
    const stored = await AsyncStorage.getItem(CHECKLIST_PROGRESS_KEY);
    if (!stored) {
      inMemoryProgress = [];
      return inMemoryProgress;
    }
    const parsed = JSON.parse(stored) as ChecklistProgress[];
    inMemoryProgress = parsed;
    return parsed;
  } catch (error) {
    console.warn("loadChecklistProgress error", error);
    inMemoryProgress = [];
    return inMemoryProgress;
  }
}

async function saveChecklistProgress(
  progress: ChecklistProgress[]
): Promise<void> {
  inMemoryProgress = progress;
  try {
    await AsyncStorage.setItem(
      CHECKLIST_PROGRESS_KEY,
      JSON.stringify(progress)
    );
  } catch (error) {
    console.warn("saveChecklistProgress error", error);
  }
}

export async function toggleChecklistItem(
  checklistId: string,
  itemId: string
): Promise<ChecklistProgress[]> {
  const progress = await loadChecklistProgress();
  const index = progress.findIndex(
    (p) => p.checklistId === checklistId && p.itemId === itemId
  );
  if (index >= 0) {
    progress[index] = { ...progress[index], done: !progress[index].done };
  } else {
    progress.push({ checklistId, itemId, done: true });
  }
  await saveChecklistProgress(progress);
  return progress;
}

export async function getChecklistStats() {
  const [bundle, progress] = await Promise.all([
    loadChecklistsBundle(),
    loadChecklistProgress(),
  ]);
  return bundle.checklists.map((cl) => {
    const doneCount = cl.items.filter((item) =>
      progress.some(
        (p) => p.checklistId === cl.id && p.itemId === item.id && p.done
      )
    ).length;
    return {
      checklist: cl,
      done: doneCount,
      total: cl.items.length,
    };
  });
}
