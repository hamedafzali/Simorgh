import AsyncStorage from "@react-native-async-storage/async-storage";

import { mockTutorBundle } from "@/services/mockData";

export type TutorStep = {
  id: string;
  promptDe: string;
  promptFa: string;
  modelDe: string;
  explanationFa: string;
};

export type TutorScenario = {
  id: string;
  title: {
    de: string;
    fa: string;
    en: string;
  };
  steps: TutorStep[];
};

export type TutorBundle = {
  version: number;
  scenarios: TutorScenario[];
};

// Default tutor bundle used when no stored data is present.
const initialTutor: TutorBundle = mockTutorBundle;

const TUTOR_STORAGE_KEY = "Simorgh.learn.tutor.v1";

let inMemoryTutor: TutorBundle | null = null;

export async function loadTutorBundle(): Promise<TutorBundle> {
  if (inMemoryTutor) return inMemoryTutor;
  try {
    const stored = await AsyncStorage.getItem(TUTOR_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as TutorBundle;
      inMemoryTutor = parsed;
      return parsed;
    }
  } catch (error) {
    console.warn("loadTutorBundle error", error);
  }

  inMemoryTutor = initialTutor;

  try {
    await AsyncStorage.setItem(TUTOR_STORAGE_KEY, JSON.stringify(initialTutor));
  } catch (error) {
    console.warn("saveTutorBundle error", error);
  }

  return inMemoryTutor;
}
