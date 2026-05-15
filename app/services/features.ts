import { getJson, setJson } from "./localStore";

export type FeatureFlags = {
  learning: boolean;
  community: boolean;
  jobs: boolean;
  chat: boolean;
  events: boolean;
  documents: boolean;
  countries: boolean;
  checklist: boolean;
  deadlines: boolean;
  forms: boolean;
  emergency: boolean;
  phrasebook: boolean;
  reminders: boolean;
  school: boolean;
  support: boolean;
  housing: boolean;
  tax: boolean;
  services: boolean;
  guides: boolean;
  locations: boolean;
  timeline: boolean;
};

export const defaultFeatureFlags: FeatureFlags = {
  learning: true,
  community: true,
  jobs: false,
  chat: false,
  events: true,
  documents: true,
  countries: true,
  checklist: true,
  deadlines: true,
  forms: true,
  emergency: true,
  phrasebook: true,
  reminders: true,
  school: true,
  support: true,
  housing: true,
  tax: true,
  services: true,
  guides: true,
  locations: true,
  timeline: true,
};

const STORAGE_KEY = "feature_flags";

export async function getFeatureFlags(): Promise<FeatureFlags> {
  return await getJson<FeatureFlags>(STORAGE_KEY, defaultFeatureFlags);
}

export async function saveFeatureFlags(
  flags: Partial<FeatureFlags> | undefined
): Promise<void> {
  await setJson(STORAGE_KEY, {
    ...defaultFeatureFlags,
    ...(flags || {}),
  });
}
