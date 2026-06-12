import { Platform } from "react-native";
import { API_BASE_URL, apiHeaders } from "../config/api";
import { getJson, setJson } from "./localStore";

// Anonymous, self-hosted analytics. No PII: a random device id, event names,
// and minimal props. Events queue locally (offline-first) and flush in batches.

const DEVICE_ID_KEY = "analytics_device_id";
const QUEUE_KEY = "analytics_queue";
const MAX_QUEUE_SIZE = 200;
const FLUSH_DEBOUNCE_MS = 5000;
const APP_VERSION = "1.0.0";

type AnalyticsEvent = {
  name: string;
  props: Record<string, unknown>;
  deviceId: string;
  platform: string;
  appVersion: string;
  occurredAt: string;
};

let deviceIdPromise: Promise<string> | null = null;
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let isFlushing = false;

function randomId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 24; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

async function getDeviceId(): Promise<string> {
  if (!deviceIdPromise) {
    deviceIdPromise = (async () => {
      const existing = await getJson<string>(DEVICE_ID_KEY, "");
      if (existing) return existing;
      const id = randomId();
      await setJson(DEVICE_ID_KEY, id);
      return id;
    })();
  }
  return deviceIdPromise;
}

export async function track(
  name: string,
  props: Record<string, unknown> = {}
): Promise<void> {
  try {
    const deviceId = await getDeviceId();
    const event: AnalyticsEvent = {
      name,
      props,
      deviceId,
      platform: Platform.OS,
      appVersion: APP_VERSION,
      occurredAt: new Date().toISOString(),
    };

    const queue = await getJson<AnalyticsEvent[]>(QUEUE_KEY, []);
    queue.push(event);
    await setJson(QUEUE_KEY, queue.slice(-MAX_QUEUE_SIZE));

    scheduleFlush();
  } catch {
    // analytics must never break the app
  }
}

function scheduleFlush(): void {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flushAnalytics();
  }, FLUSH_DEBOUNCE_MS);
}

export async function flushAnalytics(): Promise<boolean> {
  if (isFlushing) return false;
  isFlushing = true;
  try {
    const queue = await getJson<AnalyticsEvent[]>(QUEUE_KEY, []);
    if (queue.length === 0) return true;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(`${API_BASE_URL}/analytics/events`, {
      method: "POST",
      headers: apiHeaders(),
      body: JSON.stringify({ events: queue }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) return false;
    await setJson(QUEUE_KEY, []);
    return true;
  } catch {
    // keep the queue; retry on next flush
    return false;
  } finally {
    isFlushing = false;
  }
}

export async function trackError(error: unknown, source: string): Promise<void> {
  const message =
    error instanceof Error ? error.message : String(error ?? "unknown");
  const stack =
    error instanceof Error && error.stack ? error.stack.slice(0, 1000) : "";
  await track("app_error", { message: message.slice(0, 500), stack, source });
}
