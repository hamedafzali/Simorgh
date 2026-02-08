import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api";

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(
          `API Request: ${config.method?.toUpperCase()} ${config.url}`
        );
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor
    this.client.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Dashboard
  async getDashboardStats() {
    return await this.client.get("/admin/dashboard");
  }

  // Database Management
  async getDatabaseStats() {
    return await this.client.get("/database/stats");
  }

  async getDatabaseVersion() {
    return await this.client.get("/database/version");
  }

  async syncDatabase() {
    return await this.client.post("/admin/database/sync");
  }

  async backupDatabase() {
    return await this.client.post("/admin/database/backup");
  }

  async restoreDatabase(backupId) {
    return await this.client.post(`/admin/database/restore/${backupId}`);
  }

  // Script Management
  async getScripts() {
    return await this.client.get("/admin/scripts");
  }

  async getScript(scriptId) {
    return await this.client.get(`/admin/scripts/${scriptId}`);
  }

  async saveScript(scriptId, scriptData) {
    return await this.client.put(`/admin/scripts/${scriptId}`, scriptData);
  }

  async runScript(scriptId) {
    return await this.client.post(`/admin/scripts/${scriptId}/run`);
  }

  async stopScript(scriptId) {
    return await this.client.post(`/admin/scripts/${scriptId}/stop`);
  }

  async getScriptLogs(scriptId) {
    return await this.client.get(`/admin/scripts/${scriptId}/logs`);
  }

  // User Management
  async getUsers() {
    return await this.client.get("/admin/users");
  }

  async getUser(userId) {
    return await this.client.get(`/admin/users/${userId}`);
  }

  async updateUser(userId, userData) {
    return await this.client.put(`/admin/users/${userId}`, userData);
  }

  async deleteUser(userId) {
    return await this.client.delete(`/admin/users/${userId}`);
  }

  async getUserActivity(userId) {
    return await this.client.get(`/admin/users/${userId}/activity`);
  }

  // Analytics
  async getUserAnalytics(period = "7d") {
    return await this.client.get(`/admin/analytics/users?period=${period}`);
  }

  async getPerformanceAnalytics(period = "7d") {
    return await this.client.get(
      `/admin/analytics/performance?period=${period}`
    );
  }

  async getUsageAnalytics(period = "7d") {
    return await this.client.get(`/admin/analytics/usage?period=${period}`);
  }

  // Settings
  async getSettings() {
    return await this.client.get("/admin/settings");
  }

  async updateSettings(settings) {
    return await this.client.put("/admin/settings", settings);
  }

  async getSystemInfo() {
    return await this.client.get("/admin/system/info");
  }

  // SQLite Database Generation
  async generateSQLiteDatabase() {
    return await this.client.post("/admin/database/generate-sqlite");
  }

  async downloadSQLiteDatabase() {
    return await this.client.get("/admin/database/download-sqlite", {
      responseType: "blob",
    });
  }

  async getSQLiteDatabaseStats() {
    return await this.client.get("/admin/database/sqlite-stats");
  }

  async packageSQLiteDatabase() {
    return await this.client.post("/admin/database/package-sqlite");
  }

  // Real-time endpoints (would use WebSockets in production)
  async getOnlineUsers() {
    return await this.client.get("/admin/users/online");
  }

  async getSystemMetrics() {
    return await this.client.get("/admin/system/metrics");
  }
}

export const apiService = new ApiService();
export default apiService;
