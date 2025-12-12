import { getApiBaseUrl } from "@/config/api";

const API_BASE_URL = getApiBaseUrl();
const API_Job_URL = "https://arbeitnow.com/api/job-board-api";

export async function fetchFromAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T | null> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log("Fetching from:", url);

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      console.warn("API error", response.status, endpoint);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.warn("API fetch error", endpoint, error);
    return null;
  }
}

interface ArbeitnowResponse {
  data: JobPosting[];
}

interface JobPosting {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  url: string;
  tags: string[];
  job_types: string[];
  location: string;
  created_at: number;
}

export interface JobsBundle {
  version: number;
  jobs: Job[];
}

export interface Job {
  id: string;
  city: string;
  state: string;
  jobType: string;
  skillLevel: string;
  germanLevel: string;
  visaTypes: string[];
  deadline: string;
  applyUrl: string;
  contactEmail?: string;
  localized: {
    fa: any;
    de: any;
    en: any;
  };
}

export async function fetchJobsBundleFromApi(): Promise<JobsBundle | null> {
  try {
    const response = await fetch(API_Job_URL);
    if (!response.ok) {
      console.warn(
        "Failed to fetch jobs",
        response.status,
        response.statusText
      );
      return null;
    }

    const data: ArbeitnowResponse = await response.json();

    // Transform the API response to match the expected JobsBundle format
    const jobs: Job[] = data.data.map((job) => ({
      id: job.slug,
      city: job.location.split(",")[0]?.trim() || "Unknown",
      state:
        job.location.split(",").length > 1
          ? job.location.split(",").slice(1).join(",").trim()
          : "Germany",
      jobType: job.job_types[0] || "full-time",
      skillLevel: "mid", // Default to mid level since the API doesn't provide this
      germanLevel: "B2", // Default to B2 since the API doesn't provide this
      visaTypes: [], // Initialize empty array as the API doesn't provide this
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      applyUrl: job.url,
      localized: {
        en: {
          title: job.title,
          company: job.company_name,
          locationText: job.location,
          description: job.description
            .replace(/<[^>]*>?/gm, "")
            .replace(/\s+/g, " ")
            .trim(),
          requirements: [], // The API doesn't provide separate requirements
        },
        // For other languages, we'll just use the same as English for now
        fa: {
          title: job.title,
          company: job.company_name,
          locationText: job.location,
          description: job.description
            .replace(/<[^>]*>?/gm, "")
            .replace(/\s+/g, " ")
            .trim(),
          requirements: [],
        },
        de: {
          title: job.title,
          company: job.company_name,
          locationText: job.location,
          description: job.description
            .replace(/<[^>]*>?/gm, "")
            .replace(/\s+/g, " ")
            .trim(),
          requirements: [],
        },
      },
    }));

    return {
      version: Math.floor(Date.now() / 1000), // Use current timestamp as version
      jobs: jobs,
    };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return null;
  }
}

export type ChatMessagePayload = {
  message: string;
  language?: string;
};

export type ChatResponse = {
  reply: string;
};

export async function sendChatMessage(
  payload: ChatMessagePayload
): Promise<ChatResponse | null> {
  try {
    const url = `${API_BASE_URL}/api/chat`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn("API chat error", response.status, url);
      return null;
    }

    const json = (await response.json()) as ChatResponse;
    return json;
  } catch (error) {
    console.warn("API chat fetch error", error);
    return null;
  }
}

// Additional endpoints can be added here later, e.g. local-info, events, stories.
