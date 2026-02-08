import AsyncStorage from "@react-native-async-storage/async-storage";
import { ErrorHandler } from "../utils/error-handler";
import SyncService from "./sync-service";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "internship" | "freelance";
  category:
    | "technology"
    | "healthcare"
    | "education"
    | "hospitality"
    | "retail"
    | "manufacturing"
    | "other";
  description: string;
  requirements: string[];
  responsibilities: string[];
  salary?: string;
  contact: {
    email: string;
    phone?: string;
    website?: string;
  };
  postedDate: Date;
  deadline?: Date;
  isActive: boolean;
  postedBy: string;
  tags: string[];
  isRemote: boolean;
  languageRequired: "none" | "basic" | "intermediate" | "advanced" | "native";
}

export interface JobFilter {
  search?: string;
  category?: string;
  type?: string;
  location?: string;
  isRemote?: boolean;
  languageRequired?: string;
  datePosted?: "today" | "week" | "month" | "all";
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  status: "pending" | "viewed" | "accepted" | "rejected";
  appliedDate: Date;
  coverLetter?: string;
  resumeUrl?: string;
  notes?: string;
}

class JobsAPI {
  private static instance: JobsAPI;
  private errorHandler: ErrorHandler;
  private syncService: SyncService;
  private baseUrl: string;

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.syncService = SyncService.getInstance();
    this.baseUrl = "https://api.simorgh-connect.com/jobs"; // Mock API URL
  }

  static getInstance(): JobsAPI {
    if (!JobsAPI.instance) {
      JobsAPI.instance = new JobsAPI();
    }
    return JobsAPI.instance;
  }

  async getJobs(filter?: JobFilter): Promise<Job[]> {
    try {
      // Try to get from cache first
      const cachedJobs = await this.getCachedJobs();

      if (this.syncService.getNetworkStatus()) {
        // Fetch from server
        const response = await this.fetchJobs(filter);

        // Update cache
        await this.cacheJobs(response);

        return response;
      } else {
        // Return cached data when offline
        return this.filterJobs(cachedJobs, filter);
      }
    } catch (error) {
      this.errorHandler.handleNetworkError(error, "getJobs");

      // Fallback to cached data
      return this.getCachedJobs().then((jobs) => this.filterJobs(jobs, filter));
    }
  }

  async getJobById(id: string): Promise<Job | null> {
    try {
      const jobs = await this.getJobs();
      return jobs.find((job) => job.id === id) || null;
    } catch (error) {
      this.errorHandler.handleNetworkError(error, "getJobById");
      return null;
    }
  }

  async createJob(
    jobData: Omit<Job, "id" | "postedDate" | "isActive" | "postedBy">
  ): Promise<Job> {
    try {
      const newJob: Job = {
        ...jobData,
        id: Date.now().toString(),
        postedDate: new Date(),
        isActive: true,
        postedBy: "current-user", // Would get from auth context
      };

      if (this.syncService.getNetworkStatus()) {
        // Send to server
        const response = await this.postJob(newJob);

        // Update local cache
        await this.addJobToCache(response);

        return response;
      } else {
        // Add to sync queue for when online
        await this.syncService.addToSyncQueue(
          "create",
          "job",
          newJob.id,
          newJob
        );
        await this.addJobToCache(newJob);

        return newJob;
      }
    } catch (error) {
      this.errorHandler.handleNetworkError(error, "createJob");
      throw error;
    }
  }

  async updateJob(id: string, jobData: Partial<Job>): Promise<Job> {
    try {
      const existingJob = await this.getJobById(id);
      if (!existingJob) {
        throw new Error("Job not found");
      }

      const updatedJob: Job = {
        ...existingJob,
        ...jobData,
      };

      if (this.syncService.getNetworkStatus()) {
        // Send to server
        const response = await this.putJob(id, updatedJob);

        // Update local cache
        await this.updateJobInCache(response);

        return response;
      } else {
        // Add to sync queue for when online
        await this.syncService.addToSyncQueue("update", "job", id, updatedJob);
        await this.updateJobInCache(updatedJob);

        return updatedJob;
      }
    } catch (error) {
      this.errorHandler.handleNetworkError(error, "updateJob");
      throw error;
    }
  }

  async deleteJob(id: string): Promise<void> {
    try {
      if (this.syncService.getNetworkStatus()) {
        // Send to server
        await this.deleteJobFromServer(id);
      } else {
        // Add to sync queue for when online
        await this.syncService.addToSyncQueue("delete", "job", id, { id });
      }

      // Remove from local cache
      await this.removeJobFromCache(id);
    } catch (error) {
      this.errorHandler.handleNetworkError(error, "deleteJob");
      throw error;
    }
  }

  async applyForJob(
    jobId: string,
    application: Omit<JobApplication, "id" | "appliedDate">
  ): Promise<JobApplication> {
    try {
      const newApplication: JobApplication = {
        ...application,
        id: Date.now().toString(),
        appliedDate: new Date(),
      };

      if (this.syncService.getNetworkStatus()) {
        // Send to server
        const response = await this.postApplication(newApplication);

        // Update local cache
        await this.cacheApplication(response);

        return response;
      } else {
        // Add to sync queue for when online
        await this.syncService.addToSyncQueue(
          "create",
          "application",
          newApplication.id,
          newApplication
        );
        await this.cacheApplication(newApplication);

        return newApplication;
      }
    } catch (error) {
      this.errorHandler.handleNetworkError(error, "applyForJob");
      throw error;
    }
  }

  async getUserApplications(userId: string): Promise<JobApplication[]> {
    try {
      const cachedApplications = await this.getCachedApplications();

      if (this.syncService.getNetworkStatus()) {
        // Fetch from server
        const response = await this.fetchApplications(userId);

        // Update cache
        await this.cacheApplications(response);

        return response;
      } else {
        // Return cached data when offline
        return cachedApplications.filter((app) => app.userId === userId);
      }
    } catch (error) {
      this.errorHandler.handleNetworkError(error, "getUserApplications");
      return [];
    }
  }

  // Private methods for API calls
  private async fetchJobs(filter?: JobFilter): Promise<Job[]> {
    // Mock API call - replace with actual implementation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Return mock data for now
    return this.getMockJobs();
  }

  private async postJob(job: Job): Promise<Job> {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return job;
  }

  private async putJob(id: string, job: Job): Promise<Job> {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return job;
  }

  private async deleteJobFromServer(id: string): Promise<void> {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  private async postApplication(
    application: JobApplication
  ): Promise<JobApplication> {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return application;
  }

  private async fetchApplications(userId: string): Promise<JobApplication[]> {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [];
  }

  // Cache management
  private async getCachedJobs(): Promise<Job[]> {
    try {
      const cached = await AsyncStorage.getItem("jobs_cache");
      return cached ? JSON.parse(cached) : this.getMockJobs();
    } catch (error) {
      return this.getMockJobs();
    }
  }

  private async cacheJobs(jobs: Job[]): Promise<void> {
    try {
      await AsyncStorage.setItem("jobs_cache", JSON.stringify(jobs));
    } catch (error) {
      console.error("Error caching jobs:", error);
    }
  }

  private async addJobToCache(job: Job): Promise<void> {
    const jobs = await this.getCachedJobs();
    jobs.unshift(job);
    await this.cacheJobs(jobs);
  }

  private async updateJobInCache(job: Job): Promise<void> {
    const jobs = await this.getCachedJobs();
    const index = jobs.findIndex((j) => j.id === job.id);
    if (index !== -1) {
      jobs[index] = job;
      await this.cacheJobs(jobs);
    }
  }

  private async removeJobFromCache(id: string): Promise<void> {
    const jobs = await this.getCachedJobs();
    const filtered = jobs.filter((job) => job.id !== id);
    await this.cacheJobs(filtered);
  }

  private async getCachedApplications(): Promise<JobApplication[]> {
    try {
      const cached = await AsyncStorage.getItem("applications_cache");
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      return [];
    }
  }

  private async cacheApplication(application: JobApplication): Promise<void> {
    try {
      const applications = await this.getCachedApplications();
      applications.push(application);
      await AsyncStorage.setItem(
        "applications_cache",
        JSON.stringify(applications)
      );
    } catch (error) {
      console.error("Error caching application:", error);
    }
  }

  private async cacheApplications(
    applications: JobApplication[]
  ): Promise<void> {
    try {
      await AsyncStorage.setItem(
        "applications_cache",
        JSON.stringify(applications)
      );
    } catch (error) {
      console.error("Error caching applications:", error);
    }
  }

  private filterJobs(jobs: Job[], filter?: JobFilter): Job[] {
    if (!filter) return jobs;

    return jobs.filter((job) => {
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        const matchesSearch =
          job.title.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower) ||
          job.tags.some((tag) => tag.toLowerCase().includes(searchLower));

        if (!matchesSearch) return false;
      }

      if (filter.category && job.category !== filter.category) return false;
      if (filter.type && job.type !== filter.type) return false;
      if (
        filter.location &&
        !job.location.toLowerCase().includes(filter.location.toLowerCase())
      )
        return false;
      if (filter.isRemote !== undefined && job.isRemote !== filter.isRemote)
        return false;
      if (
        filter.languageRequired &&
        job.languageRequired !== filter.languageRequired
      )
        return false;

      if (filter.datePosted) {
        const now = new Date();
        const postedDate = new Date(job.postedDate);

        switch (filter.datePosted) {
          case "today":
            if (postedDate.toDateString() !== now.toDateString()) return false;
            break;
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (postedDate < weekAgo) return false;
            break;
          case "month":
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            if (postedDate < monthAgo) return false;
            break;
        }
      }

      return true;
    });
  }

  private getMockJobs(): Job[] {
    return [
      {
        id: "1",
        title: "German Speaking Customer Service",
        company: "Tech Solutions GmbH",
        location: "Berlin, Germany",
        type: "full-time",
        category: "technology",
        description:
          "We are looking for a German-speaking customer service representative to join our team.",
        requirements: [
          "Fluent in German and English",
          "Customer service experience",
          "Good communication skills",
        ],
        responsibilities: [
          "Handle customer inquiries",
          "Provide technical support",
          "Document customer interactions",
        ],
        salary: "€35,000 - €45,000 per year",
        contact: {
          email: "jobs@techsolutions.de",
          phone: "+49 30 12345678",
          website: "www.techsolutions.de",
        },
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        postedBy: "admin",
        tags: ["customer service", "german", "english", "tech"],
        isRemote: false,
        languageRequired: "advanced",
      },
      // Add more mock jobs as needed
    ];
  }
}

export default JobsAPI;
