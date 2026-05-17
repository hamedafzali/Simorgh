import { getJson, setJson } from "./localStore";
import { API_BASE_URL, apiHeaders } from "../config/api";

const EVENTS_CACHE_KEY = "events_cache";

export interface AppEvent {
  id: string;
  enabled: boolean;
  country: string;
  state: string | null;
  city: string | null;
  category: string;
  categoryFa: string;
  title: string;
  titleFa: string;
  description: string;
  descriptionFa: string;
  date: string;
  endDate: string | null;
  time: string | null;
  venue: string | null;
  price: string;
  link: string | null;
  source: string;
}

export async function getEventsFromCache(): Promise<AppEvent[]> {
  return getJson<AppEvent[]>(EVENTS_CACHE_KEY, []);
}

export async function syncEvents(params: {
  country?: string;
  state?: string;
  city?: string;
} = {}): Promise<AppEvent[]> {
  try {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    ).toString();
    const url = `${API_BASE_URL}/events${qs ? `?${qs}` : ""}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    let res: Response;
    try {
      res = await fetch(url, { signal: controller.signal, headers: apiHeaders() });
    } finally {
      clearTimeout(timer);
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const events: AppEvent[] = data.events || [];
    await setJson(EVENTS_CACHE_KEY, events);
    return events;
  } catch (err) {
    console.warn("[events] syncEvents failed, using cache:", err);
    return getEventsFromCache();
  }
}
