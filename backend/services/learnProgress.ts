import AsyncStorage from "@react-native-async-storage/async-storage";

export type FlashcardType = "vocab" | "phrase";

export type FlashcardProgress = {
  cardId: string;
  type: FlashcardType;
  intervalDays: number;
  dueAt: string;
  correctStreak: number;
  incorrectCount: number;
  lastSeenAt: string;
};

export type LearnProgressSummary = {
  totalReviews: number;
  correctReviews: number;
  lastStudyDate?: string;
  streakDays: number;
  points: number;
  level: number;
};

const FLASHCARDS_KEY = "Simorgh.learn.flashcards.v1";
const SUMMARY_KEY = "Simorgh.learn.progressSummary.v1";

let inMemoryProgress: FlashcardProgress[] | null = null;
let inMemorySummary: LearnProgressSummary | null = null;

export async function loadFlashcardProgress(): Promise<FlashcardProgress[]> {
  if (inMemoryProgress) return inMemoryProgress;
  try {
    const stored = await AsyncStorage.getItem(FLASHCARDS_KEY);
    if (!stored) {
      inMemoryProgress = [];
      return inMemoryProgress;
    }
    const parsed = JSON.parse(stored) as FlashcardProgress[];
    inMemoryProgress = parsed;
    return parsed;
  } catch (error) {
    console.warn("loadFlashcardProgress error", error);
    inMemoryProgress = [];
    return inMemoryProgress;
  }
}

async function saveFlashcardProgress(
  progress: FlashcardProgress[]
): Promise<void> {
  inMemoryProgress = progress;
  try {
    await AsyncStorage.setItem(FLASHCARDS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.warn("saveFlashcardProgress error", error);
  }
}

export async function loadProgressSummary(): Promise<LearnProgressSummary> {
  if (inMemorySummary) return inMemorySummary;
  try {
    const stored = await AsyncStorage.getItem(SUMMARY_KEY);
    if (!stored) {
      inMemorySummary = {
        totalReviews: 0,
        correctReviews: 0,
        streakDays: 0,
        points: 0,
        level: 1,
      };
      return inMemorySummary;
    }
    const parsed = JSON.parse(stored) as Partial<LearnProgressSummary>;
    const summary: LearnProgressSummary = {
      totalReviews: parsed.totalReviews ?? 0,
      correctReviews: parsed.correctReviews ?? 0,
      lastStudyDate: parsed.lastStudyDate,
      streakDays: parsed.streakDays ?? 0,
      // Backfill points/level if missing based on totalReviews
      points: parsed.points ?? (parsed.totalReviews ?? 0) * 10,
      level: parsed.level ?? 1,
    };
    inMemorySummary = summary;
    return summary;
  } catch (error) {
    console.warn("loadProgressSummary error", error);
    inMemorySummary = {
      totalReviews: 0,
      correctReviews: 0,
      streakDays: 0,
      points: 0,
      level: 1,
    };
    return inMemorySummary;
  }
}

async function saveProgressSummary(
  summary: LearnProgressSummary
): Promise<void> {
  inMemorySummary = summary;
  try {
    await AsyncStorage.setItem(SUMMARY_KEY, JSON.stringify(summary));
  } catch (error) {
    console.warn("saveProgressSummary error", error);
  }
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export async function updateFlashcardAfterReview(
  cardId: string,
  type: FlashcardType,
  wasCorrect: boolean
): Promise<{ progress: FlashcardProgress[]; summary: LearnProgressSummary }> {
  const [progress, summary] = await Promise.all([
    loadFlashcardProgress(),
    loadProgressSummary(),
  ]);
  const now = new Date();
  const existingIndex = progress.findIndex(
    (p) => p.cardId === cardId && p.type === type
  );

  let entry: FlashcardProgress;
  if (existingIndex >= 0) {
    entry = { ...progress[existingIndex] };
  } else {
    entry = {
      cardId,
      type,
      intervalDays: 0,
      dueAt: now.toISOString(),
      correctStreak: 0,
      incorrectCount: 0,
      lastSeenAt: now.toISOString(),
    };
  }

  entry.lastSeenAt = now.toISOString();

  if (wasCorrect) {
    entry.correctStreak += 1;
    const nextInterval =
      entry.intervalDays === 0 ? 1 : Math.min(entry.intervalDays * 2, 30);
    entry.intervalDays = nextInterval;
  } else {
    entry.incorrectCount += 1;
    entry.correctStreak = 0;
    entry.intervalDays = 1;
  }

  const dueDate = addDays(now, entry.intervalDays);
  entry.dueAt = dueDate.toISOString();

  if (existingIndex >= 0) {
    progress[existingIndex] = entry;
  } else {
    progress.push(entry);
  }

  // Update summary
  const today = new Date();
  let {
    totalReviews,
    correctReviews,
    lastStudyDate,
    streakDays,
    points,
    level,
  } = summary;
  if (points === undefined) points = 0;
  if (level === undefined) level = 1;
  totalReviews += 1;
  if (wasCorrect) correctReviews += 1;
  // Simple gamification: more points for correct answers, some points even when incorrect
  points += wasCorrect ? 10 : 4;

  if (!lastStudyDate) {
    streakDays = 1;
  } else {
    const last = new Date(lastStudyDate);
    if (sameDay(last, today)) {
      // same day, streak unchanged
    } else {
      const yesterday = addDays(today, -1);
      if (sameDay(last, yesterday)) {
        streakDays += 1;
      } else {
        streakDays = 1;
      }
    }
  }

  lastStudyDate = today.toISOString();

  // Derive level from points (100 points per level, minimum level 1)
  const calculatedLevel = Math.max(1, Math.floor(points / 100) + 1);
  level = calculatedLevel;

  const newSummary: LearnProgressSummary = {
    totalReviews,
    correctReviews,
    lastStudyDate,
    streakDays,
    points,
    level,
  };

  await Promise.all([
    saveFlashcardProgress(progress),
    saveProgressSummary(newSummary),
  ]);
  return { progress, summary: newSummary };
}

export type FlashcardCandidate = {
  id: string;
  type: FlashcardType;
};

export async function getDueFlashcards(
  candidates: FlashcardCandidate[],
  limit = 10
): Promise<FlashcardCandidate[]> {
  const progress = await loadFlashcardProgress();
  const now = new Date();

  const scored = candidates.map((c) => {
    const p = progress.find((x) => x.cardId === c.id && x.type === c.type);
    const due = p ? new Date(p.dueAt) : new Date(0);
    return { candidate: c, due };
  });

  const dueNow = scored
    .filter((s) => s.due <= now)
    .sort((a, b) => a.due.getTime() - b.due.getTime());

  return dueNow.slice(0, limit).map((s) => s.candidate);
}
