import axios from "axios";

// Local dev/docker serves the admin on its own port (3000) with the API on
// 3001; in production the backend serves the admin itself, so the API is
// same-origin under /api.
const isStandaloneDev =
  window.location.port === "3000" || window.location.port === "6001";
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (isStandaloneDev
    ? `${window.location.protocol}//${window.location.hostname}:3001/api`
    : `${window.location.protocol}//${window.location.host}/api`);

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Attach JWT token to every request
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("admin_token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // On 401, clear stale token and reload to show login screen
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("admin_token");
          window.location.reload();
        }
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Auth
  async login(password) {
    return await this.client.post("/admin/login", { password });
  }

  logout() {
    localStorage.removeItem("admin_token");
    window.location.reload();
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

  async getBackups() {
    return await this.client.get("/admin/database/backups");
  }

  async deleteBackup(backupId) {
    return await this.client.delete(`/admin/database/backup/${backupId}`);
  }

  async downloadBackup(backupId, kind = "db") {
    return await this.client.get(
      `/admin/database/backup/${backupId}/download?kind=${kind}`,
      { responseType: "blob" }
    );
  }

  async getBackupDetails(backupId) {
    return await this.client.get(`/admin/database/backup/${backupId}`);
  }

  async getBackupTableRows(backupId, tableName, page = 1, limit = 25) {
    return await this.client.get(
      `/admin/database/backup/${backupId}/table/${tableName}?page=${page}&limit=${limit}`
    );
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

  async deleteScript(scriptId) {
    return await this.client.delete(`/admin/scripts/${scriptId}`);
  }

  async stopScript(scriptId) {
    return await this.client.post(`/admin/scripts/${scriptId}/stop`);
  }

  async getScriptLogs(scriptId) {
    return await this.client.get(`/admin/scripts/${scriptId}/logs`);
  }

  async getRunningScripts() {
    return await this.client.get("/admin/scripts/running");
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

  async getUserStats() {
    return await this.client.get("/admin/users/stats");
  }

  async banUser(userId) {
    return await this.client.post(`/admin/users/${userId}/ban`);
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

  // Countries
  async getCountries() {
    return await this.client.get("/admin/countries");
  }

  async addCountry(country) {
    return await this.client.post("/admin/countries", country);
  }

  async updateCountry(code, updates) {
    return await this.client.put(`/admin/countries/${code}`, updates);
  }

  async deleteCountry(code) {
    return await this.client.delete(`/admin/countries/${code}`);
  }

  // Events
  async getEvents(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return await this.client.get(`/admin/events${qs ? `?${qs}` : ""}`);
  }

  async addEvent(event) {
    return await this.client.post("/admin/events", event);
  }

  async updateEvent(id, updates) {
    return await this.client.put(`/admin/events/${id}`, updates);
  }

  async deleteEvent(id) {
    return await this.client.delete(`/admin/events/${id}`);
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
