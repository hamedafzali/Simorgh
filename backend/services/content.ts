import AsyncStorage from "@react-native-async-storage/async-storage";

import { mockContentBundle } from "@/services/mockData";

const CONTENT_STORAGE_KEY = "Simorgh.content.bundle.v1";

export type LocalGuide = {
  id: string;
  category: string;
  title: string;
  summary: string;
  sections: string[];
  regions: string[];
};

export type ContentBundle = {
  version: number;
  localGuides: LocalGuide[];
};

// Default content bundle used when no stored data is present.
const initialContent: ContentBundle = mockContentBundle;

let inMemoryContent: ContentBundle | null = null;

export async function loadContentBundle(): Promise<ContentBundle> {
  if (inMemoryContent) return inMemoryContent;

  try {
    const stored = await AsyncStorage.getItem(CONTENT_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as ContentBundle;
      inMemoryContent = parsed;
      return parsed;
    }
  } catch (error) {
    console.warn("loadContentBundle error", error);
  }

  inMemoryContent = initialContent;

  try {
    await AsyncStorage.setItem(
      CONTENT_STORAGE_KEY,
      JSON.stringify(initialContent)
    );
  } catch (error) {
    console.warn("saveContentBundle error", error);
  }

  return inMemoryContent;
}

export async function getLocalGuides(): Promise<LocalGuide[]> {
  const content = await loadContentBundle();
  return content.localGuides;
}

export async function getLocalGuidesForRegion(
  state?: string | null,
  city?: string | null
): Promise<LocalGuide[]> {
  const guides = await getLocalGuides();
  if (!state && !city) return guides;

  const normalizedState = state?.toLowerCase();
  const normalizedCity = city?.toLowerCase();

  return guides.filter((guide) => {
    if (!guide.regions || guide.regions.length === 0) return true;

    const regionTags = guide.regions.map((r) => r.toLowerCase());

    if (normalizedCity && regionTags.includes(normalizedCity)) return true;
    if (normalizedState && regionTags.includes(normalizedState)) return true;
    if (regionTags.includes("de")) return true;

    return false;
  });
}
