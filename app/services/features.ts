import { getJson, setJson } from "./localStore";
import { API_BASE_URL, apiHeaders } from "../config/api";

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

export type CountryEntry = {
  enabled: boolean;
  name: string;
  features: Partial<FeatureFlags>;
};

export type CountryConfig = Record<string, CountryEntry>;

export const defaultFeatureFlags: FeatureFlags = {
  learning: false,
  community: false,
  jobs: false,
  chat: false,
  events: false,
  documents: false,
  countries: false,
  checklist: false,
  deadlines: false,
  forms: false,
  emergency: false,
  phrasebook: false,
  reminders: false,
  school: false,
  support: false,
  housing: false,
  tax: false,
  services: false,
  guides: false,
  locations: false,
  timeline: false,
};

const FLAGS_KEY = "feature_flags";
const COUNTRY_CONFIG_KEY = "country_config";

export async function getFeatureFlags(): Promise<FeatureFlags> {
  const stored = await getJson<Partial<FeatureFlags>>(FLAGS_KEY, {});
  return { ...defaultFeatureFlags, ...stored };
}

export async function getFeatureFlagsForCountry(countryCode: string): Promise<FeatureFlags> {
  const [globalFlags, config] = await Promise.all([
    getFeatureFlags(),
    getJson<CountryConfig>(COUNTRY_CONFIG_KEY, {}),
  ]);
  const entry = config[countryCode];
  if (!entry) return globalFlags;
  if (!entry.enabled) {
    return Object.fromEntries(
      Object.keys(defaultFeatureFlags).map((k) => [k, false])
    ) as FeatureFlags;
  }
  // country flags AND global flags — global off means off everywhere
  const countryFlags = { ...defaultFeatureFlags, ...entry.features };
  return Object.fromEntries(
    Object.keys(defaultFeatureFlags).map((k) => [
      k,
      globalFlags[k as keyof FeatureFlags] && countryFlags[k as keyof FeatureFlags],
    ])
  ) as FeatureFlags;
}

export async function saveFeatureFlags(
  flags: Partial<FeatureFlags> | undefined
): Promise<void> {
  await setJson(FLAGS_KEY, { ...defaultFeatureFlags, ...(flags || {}) });
}

export async function saveCountryConfig(config: CountryConfig): Promise<void> {
  await setJson(COUNTRY_CONFIG_KEY, config);
}

export async function syncFeatureFlags(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(`${API_BASE_URL}/feature-flags`, {
      signal: controller.signal,
      headers: apiHeaders(),
    });
    clearTimeout(timeout);
    if (!response.ok) return false;
    const data = await response.json();
    let synced = false;
    if (data.countryConfig && typeof data.countryConfig === "object") {
      await saveCountryConfig(data.countryConfig);
      synced = true;
    }
    if (data.featureFlags && typeof data.featureFlags === "object") {
      await saveFeatureFlags(data.featureFlags);
      synced = true;
    }
    return synced;
  } catch {
    return false;
  }
}
