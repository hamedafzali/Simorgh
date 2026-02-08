import AsyncStorage from "@react-native-async-storage/async-storage";

import { fetchJobsBundleFromApi } from "@/services/api";
import { mockJobsBundle } from "@/services/mockData";

export type JobType = string;
export type SkillLevel = string;

export type JobLocalizedContent = {
  title: string;
  company: string;
  locationText: string;
  description: string;
  requirements: string[];
};

export type Job = {
  id: string;
  city: string;
  state: string;
  jobType: JobType;
  skillLevel: SkillLevel;
  germanLevel: string;
  visaTypes: string[];
  deadline: string;
  applyUrl: string;
  contactEmail?: string;
  localized: {
    fa: JobLocalizedContent;
    de: JobLocalizedContent;
    en: JobLocalizedContent;
  };
};

export type JobsBundle = {
  version: number;
  jobs: Job[];
};

// Default local bundle used as mock data when no remote or stored data is available.
const initialJobs: JobsBundle = mockJobsBundle;

const JOBS_STORAGE_KEY = "Simorgh.jobs.bundle.v1";
const JOB_META_KEY = "Simorgh.jobs.meta.v1";

export type JobMeta = {
  jobId: string;
  favorite: boolean;
  interested: boolean;
};

let inMemoryJobs: JobsBundle | null = null;
let inMemoryMeta: JobMeta[] | null = null;

export async function loadJobsBundle(): Promise<JobsBundle> {
  if (inMemoryJobs) return inMemoryJobs;

  try {
    const stored = await AsyncStorage.getItem(JOBS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as JobsBundle;
      inMemoryJobs = parsed;
    }
  } catch (error) {
    console.warn("loadJobsBundle error", error);
  }
  // Try to refresh from backend if available
  try {
    const remote = await fetchJobsBundleFromApi();
    if (remote && remote.jobs && remote.jobs.length > 0) {
      inMemoryJobs = remote;
      await AsyncStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(remote));
      return remote;
    }
  } catch (error) {
    console.warn("fetchJobsBundleFromApi error", error);
  }

  if (inMemoryJobs) {
    return inMemoryJobs;
  }

  inMemoryJobs = initialJobs;

  try {
    await AsyncStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(initialJobs));
  } catch (error) {
    console.warn("saveJobsBundle error", error);
  }

  return inMemoryJobs;
}

export async function getAllJobs(): Promise<Job[]> {
  const bundle = await loadJobsBundle();
  return bundle.jobs;
}

export async function getJobById(id: string): Promise<Job | undefined> {
  const jobs = await getAllJobs();
  return jobs.find((j) => j.id === id);
}

async function loadJobMeta(): Promise<JobMeta[]> {
  if (inMemoryMeta) return inMemoryMeta;

  try {
    const stored = await AsyncStorage.getItem(JOB_META_KEY);
    if (!stored) {
      inMemoryMeta = [];
      return inMemoryMeta;
    }
    const parsed = JSON.parse(stored) as JobMeta[];
    inMemoryMeta = parsed;
    return parsed;
  } catch (error) {
    console.warn("loadJobMeta error", error);
    inMemoryMeta = [];
    return inMemoryMeta;
  }
}

async function saveJobMeta(meta: JobMeta[]): Promise<void> {
  inMemoryMeta = meta;
  try {
    await AsyncStorage.setItem(JOB_META_KEY, JSON.stringify(meta));
  } catch (error) {
    console.warn("saveJobMeta error", error);
  }
}

export async function getAllJobMeta(): Promise<JobMeta[]> {
  return loadJobMeta();
}

export async function getJobMeta(jobId: string): Promise<JobMeta | undefined> {
  const meta = await loadJobMeta();
  return meta.find((m) => m.jobId === jobId);
}

export async function toggleFavorite(jobId: string): Promise<JobMeta[]> {
  const meta = await loadJobMeta();
  const existing = meta.find((m) => m.jobId === jobId);
  let updated: JobMeta[];

  if (existing) {
    const newItem: JobMeta = { ...existing, favorite: !existing.favorite };
    updated = meta.map((m) => (m.jobId === jobId ? newItem : m));
  } else {
    updated = [...meta, { jobId, favorite: true, interested: false }];
  }

  await saveJobMeta(updated);
  return updated;
}

export async function toggleInterested(jobId: string): Promise<JobMeta[]> {
  const meta = await loadJobMeta();
  const existing = meta.find((m) => m.jobId === jobId);
  let updated: JobMeta[];

  if (existing) {
    const newItem: JobMeta = { ...existing, interested: !existing.interested };
    updated = meta.map((m) => (m.jobId === jobId ? newItem : m));
  } else {
    updated = [...meta, { jobId, favorite: false, interested: true }];
  }

  await saveJobMeta(updated);
  return updated;
}
