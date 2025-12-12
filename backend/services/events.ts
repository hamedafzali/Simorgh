import AsyncStorage from "@react-native-async-storage/async-storage";

import { mockEventsBundle } from "@/services/mockData";

export type EventType = "language-cafe" | "info-session" | "cultural" | "other";

export type EventLocalized = {
  title: string;
  description: string;
  locationText: string;
};

export type CommunityEvent = {
  id: string;
  city: string;
  state: string;
  type: EventType;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  latitude?: number;
  longitude?: number;
  localized: {
    fa: EventLocalized;
    de: EventLocalized;
    en: EventLocalized;
  };
};

export type EventsBundle = {
  version: number;
  events: CommunityEvent[];
};

// Default local events bundle used when no stored data is present.
const initialEvents: EventsBundle = mockEventsBundle;

const EVENTS_STORAGE_KEY = "Simorgh.events.bundle.v1";
const RSVP_STORAGE_KEY = "Simorgh.events.rsvp.v1";

export type EventRsvpStatus = "none" | "going" | "interested";

export type EventRsvp = {
  eventId: string;
  status: EventRsvpStatus;
};

let inMemoryEvents: EventsBundle | null = null;
let inMemoryRsvp: EventRsvp[] | null = null;

export async function loadEventsBundle(): Promise<EventsBundle> {
  if (inMemoryEvents) return inMemoryEvents;

  try {
    const stored = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as EventsBundle;
      inMemoryEvents = parsed;
      return parsed;
    }
  } catch (error) {
    console.warn("loadEventsBundle error", error);
  }

  inMemoryEvents = initialEvents;

  try {
    await AsyncStorage.setItem(
      EVENTS_STORAGE_KEY,
      JSON.stringify(initialEvents)
    );
  } catch (error) {
    console.warn("saveEventsBundle error", error);
  }

  return inMemoryEvents;
}

export async function getAllEvents(): Promise<CommunityEvent[]> {
  const bundle = await loadEventsBundle();
  return bundle.events;
}

export async function loadRsvp(): Promise<EventRsvp[]> {
  if (inMemoryRsvp) return inMemoryRsvp;
  try {
    const stored = await AsyncStorage.getItem(RSVP_STORAGE_KEY);
    if (!stored) {
      inMemoryRsvp = [];
      return inMemoryRsvp;
    }
    const parsed = JSON.parse(stored) as EventRsvp[];
    inMemoryRsvp = parsed;
    return parsed;
  } catch (error) {
    console.warn("loadRsvp error", error);
    inMemoryRsvp = [];
    return inMemoryRsvp;
  }
}

async function saveRsvp(rsvp: EventRsvp[]): Promise<void> {
  inMemoryRsvp = rsvp;
  try {
    await AsyncStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(rsvp));
  } catch (error) {
    console.warn("saveRsvp error", error);
  }
}

export async function setEventRsvp(
  eventId: string,
  status: EventRsvpStatus
): Promise<EventRsvp[]> {
  const rsvp = await loadRsvp();
  const idx = rsvp.findIndex((e) => e.eventId === eventId);
  const next: EventRsvp = { eventId, status };

  if (idx >= 0) {
    rsvp[idx] = next;
  } else {
    rsvp.push(next);
  }

  await saveRsvp(rsvp);
  return rsvp;
}
