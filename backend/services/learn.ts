import AsyncStorage from "@react-native-async-storage/async-storage";

import { mockLearnBundle } from "@/services/mockData";

export type DailyPhrase = {
  id: string;
  de: string;
  fa: string;
  en: string;
  context?: string;
};

export type VocabItem = {
  id: string;
  de: string;
  fa: string;
  en: string;
  category?: string;
};

export type BilingualText = {
  id: string;
  title: {
    de: string;
    fa: string;
    en: string;
  };
  de: string;
  fa: string;
  en: string;
  level?: string;
};

export type LearnBundle = {
  version: number;
  dailyPhrases: DailyPhrase[];
  vocabulary: VocabItem[];
  texts: BilingualText[];
};

// Default learn bundle used when no stored data is present.
const initialLearn: LearnBundle = mockLearnBundle;

const LEARN_STORAGE_KEY = "Simorgh.learn.bundle.v1";

let inMemoryLearn: LearnBundle | null = null;

export async function loadLearnBundle(): Promise<LearnBundle> {
  if (inMemoryLearn) return inMemoryLearn;

  try {
    const stored = await AsyncStorage.getItem(LEARN_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as LearnBundle;
      inMemoryLearn = parsed;
      return parsed;
    }
  } catch (error) {
    console.warn("loadLearnBundle error", error);
  }

  inMemoryLearn = initialLearn;

  try {
    await AsyncStorage.setItem(LEARN_STORAGE_KEY, JSON.stringify(initialLearn));
  } catch (error) {
    console.warn("saveLearnBundle error", error);
  }

  return inMemoryLearn;
}
