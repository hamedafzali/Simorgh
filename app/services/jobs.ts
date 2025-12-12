import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "internship";
  category: string;
  description: string;
  requirements: string[];
  salary?: string;
  postedAt: number;
  expiresAt?: number;
  contact: {
    email?: string;
    phone?: string;
    website?: string;
  };
  isRemote: boolean;
  languageRequired: "de" | "en" | "both";
  status: "active" | "closed" | "filled";
}

export interface JobMeta {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  salary?: string;
  postedAt: number;
  isRemote: boolean;
  languageRequired: string;
  favorite?: boolean;
  interested?: boolean;
  status: string;
}

const JOBS_STORAGE_KEY = "simorgh_jobs";
const FAVORITES_KEY = "simorgh_job_favorites";
const INTERESTED_KEY = "simorgh_job_interested";

export class JobsService {
  private static instance: JobsService;

  static getInstance(): JobsService {
    if (!JobsService.instance) {
      JobsService.instance = new JobsService();
    }
    return JobsService.instance;
  }

  async getAllJobs(): Promise<Job[]> {
    try {
      const stored = await AsyncStorage.getItem(JOBS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading jobs:", error);
      return [];
    }
  }

  async getJobById(id: string): Promise<Job | null> {
    const jobs = await this.getAllJobs();
    return jobs.find((job) => job.id === id) || null;
  }

  async getAllJobMeta(): Promise<JobMeta[]> {
    const jobs = await this.getAllJobs();
    return jobs.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      category: job.category,
      salary: job.salary,
      postedAt: job.postedAt,
      isRemote: job.isRemote,
      languageRequired: job.languageRequired,
      status: job.status,
    }));
  }

  async getJobsByCategory(category: string): Promise<Job[]> {
    const jobs = await this.getAllJobs();
    return jobs.filter(
      (job) => job.category === category && job.status === "active"
    );
  }

  async getJobsByLocation(location: string): Promise<Job[]> {
    const jobs = await this.getAllJobs();
    return jobs.filter(
      (job) =>
        job.location.toLowerCase().includes(location.toLowerCase()) &&
        job.status === "active"
    );
  }

  async getRemoteJobs(): Promise<Job[]> {
    const jobs = await this.getAllJobs();
    return jobs.filter((job) => job.isRemote && job.status === "active");
  }

  async searchJobs(query: string): Promise<Job[]> {
    const jobs = await this.getAllJobs();
    const lowercaseQuery = query.toLowerCase();

    return jobs.filter(
      (job) =>
        job.status === "active" &&
        (job.title.toLowerCase().includes(lowercaseQuery) ||
          job.company.toLowerCase().includes(lowercaseQuery) ||
          job.description.toLowerCase().includes(lowercaseQuery) ||
          job.requirements.some((req) =>
            req.toLowerCase().includes(lowercaseQuery)
          ))
    );
  }

  async getFavoriteJobs(): Promise<string[]> {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading favorites:", error);
      return [];
    }
  }

  async addToFavorites(jobId: string): Promise<void> {
    const favorites = await this.getFavoriteJobs();
    if (!favorites.includes(jobId)) {
      favorites.push(jobId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  }

  async removeFromFavorites(jobId: string): Promise<void> {
    const favorites = await this.getFavoriteJobs();
    const filtered = favorites.filter((id) => id !== jobId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
  }

  async getInterestedJobs(): Promise<string[]> {
    try {
      const stored = await AsyncStorage.getItem(INTERESTED_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading interested jobs:", error);
      return [];
    }
  }

  async addToInterested(jobId: string): Promise<void> {
    const interested = await this.getInterestedJobs();
    if (!interested.includes(jobId)) {
      interested.push(jobId);
      await AsyncStorage.setItem(INTERESTED_KEY, JSON.stringify(interested));
    }
  }

  async removeFromInterested(jobId: string): Promise<void> {
    const interested = await this.getInterestedJobs();
    const filtered = interested.filter((id) => id !== jobId);
    await AsyncStorage.setItem(INTERESTED_KEY, JSON.stringify(filtered));
  }

  async getJobsCount(): Promise<number> {
    const jobs = await this.getAllJobs();
    return jobs.filter((job) => job.status === "active").length;
  }

  async getFavoritesCount(): Promise<number> {
    const favorites = await this.getFavoriteJobs();
    return favorites.length;
  }

  async getInterestedCount(): Promise<number> {
    const interested = await this.getInterestedJobs();
    return interested.length;
  }
}

export const jobsService = JobsService.getInstance();

// Export individual functions for convenience
export const getAllJobs = () => jobsService.getAllJobs();
export const getJobById = (id: string) => jobsService.getJobById(id);
export const getAllJobMeta = () => jobsService.getAllJobMeta();
export const getJobsByCategory = (category: string) =>
  jobsService.getJobsByCategory(category);
export const getJobsByLocation = (location: string) =>
  jobsService.getJobsByLocation(location);
export const getRemoteJobs = () => jobsService.getRemoteJobs();
export const searchJobs = (query: string) => jobsService.searchJobs(query);
export const getFavoriteJobs = () => jobsService.getFavoriteJobs();
export const addToFavorites = (jobId: string) =>
  jobsService.addToFavorites(jobId);
export const removeFromFavorites = (jobId: string) =>
  jobsService.removeFromFavorites(jobId);
export const getInterestedJobs = () => jobsService.getInterestedJobs();
export const addToInterested = (jobId: string) =>
  jobsService.addToInterested(jobId);
export const removeFromInterested = (jobId: string) =>
  jobsService.removeFromInterested(jobId);
export const getJobsCount = () => jobsService.getJobsCount();
export const getFavoritesCount = () => jobsService.getFavoritesCount();
export const getInterestedCount = () => jobsService.getInterestedCount();
