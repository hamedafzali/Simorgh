import { API_BASE_URL, apiHeaders } from "../config/api";
import { getJson, setJson } from "./localStore";

// Live job search backed by the official Bundesagentur für Arbeit API,
// proxied through our backend (/api/jobs). Last successful results are
// cached locally so the screen still shows something offline.

export type LiveJob = {
  id: string;
  title: string;
  profession: string;
  company: string;
  city: string;
  region: string;
  publishedAt: string | null;
  startDate: string | null;
  externalUrl: string;
};

export type JobSearchResult = {
  jobs: LiveJob[];
  total?: number;
  fromCache: boolean;
};

const JOBS_CACHE_KEY = "jobs_last_results";

export async function searchJobs(
  what: string,
  where: string
): Promise<JobSearchResult> {
  const params = new URLSearchParams();
  if (what.trim()) params.set("what", what.trim());
  if (where.trim()) params.set("where", where.trim());
  params.set("size", "25");

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const response = await fetch(`${API_BASE_URL}/jobs?${params}`, {
      headers: apiHeaders(),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const jobs: LiveJob[] = Array.isArray(data.jobs) ? data.jobs : [];

    // Only cache the default (empty) search so offline users see something
    if (!what.trim() && !where.trim()) {
      await setJson(JOBS_CACHE_KEY, jobs);
    }

    return { jobs, total: data.total, fromCache: false };
  } catch (error) {
    if (!what.trim() && !where.trim()) {
      const cached = await getJson<LiveJob[]>(JOBS_CACHE_KEY, []);
      if (cached.length > 0) {
        return { jobs: cached, fromCache: true };
      }
    }
    throw error;
  }
}
