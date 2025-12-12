import AsyncStorage from "@react-native-async-storage/async-storage";

export type JobApplicationStatus =
  | "saved"
  | "applied"
  | "interview"
  | "offer"
  | "rejected";

export type JobApplication = {
  jobId: string;
  title: string;
  company: string;
  status: JobApplicationStatus;
  lastUpdated: string;
  note?: string;
};

const JOB_APP_KEY = "Simorgh.job.applications.v1";

let inMemoryApps: JobApplication[] | null = null;

async function loadAll(): Promise<JobApplication[]> {
  if (inMemoryApps) return inMemoryApps;
  try {
    const stored = await AsyncStorage.getItem(JOB_APP_KEY);
    if (!stored) {
      inMemoryApps = [];
      return inMemoryApps;
    }
    const parsed = JSON.parse(stored) as JobApplication[];
    inMemoryApps = parsed;
    return parsed;
  } catch (error) {
    console.warn("load job applications error", error);
    inMemoryApps = [];
    return inMemoryApps;
  }
}

async function saveAll(apps: JobApplication[]): Promise<void> {
  inMemoryApps = apps;
  try {
    await AsyncStorage.setItem(JOB_APP_KEY, JSON.stringify(apps));
  } catch (error) {
    console.warn("save job applications error", error);
  }
}

export async function listApplications(): Promise<JobApplication[]> {
  return loadAll();
}

export async function upsertApplication(input: {
  jobId: string;
  title: string;
  company: string;
  status: JobApplicationStatus;
  note?: string;
}): Promise<JobApplication[]> {
  const apps = await loadAll();
  const now = new Date().toISOString();
  const existingIndex = apps.findIndex((a) => a.jobId === input.jobId);

  const next: JobApplication = {
    jobId: input.jobId,
    title: input.title,
    company: input.company,
    status: input.status,
    lastUpdated: now,
    note: input.note,
  };

  if (existingIndex >= 0) {
    apps[existingIndex] = next;
  } else {
    apps.unshift(next);
  }

  await saveAll(apps);
  return apps;
}

export async function updateApplicationStatus(
  jobId: string,
  status: JobApplicationStatus
): Promise<JobApplication[]> {
  const apps = await loadAll();
  const now = new Date().toISOString();
  const index = apps.findIndex((a) => a.jobId === jobId);
  if (index >= 0) {
    apps[index] = { ...apps[index], status, lastUpdated: now };
  } else {
    apps.unshift({ jobId, title: "", company: "", status, lastUpdated: now });
  }
  await saveAll(apps);
  return apps;
}
