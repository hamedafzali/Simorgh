import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: "reminder" | "achievement" | "system" | "study" | "job";
  timestamp: number;
  read: boolean;
  data?: Record<string, any>;
  actionUrl?: string;
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  time: string; // HH:MM format
  days: number[]; // 0-6 (Sunday-Saturday)
  enabled: boolean;
  type: "study" | "review" | "custom";
  notificationId?: string;
}

export interface NotificationSettings {
  enabled: boolean;
  studyReminders: boolean;
  jobAlerts: boolean;
  achievementNotifications: boolean;
  systemUpdates: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM
    end: string; // HH:MM
  };
}

const NOTIFICATIONS_KEY = "simorgh_notifications";
const REMINDERS_KEY = "simorgh_reminders";
const SETTINGS_KEY = "simorgh_notification_settings";

export class NotificationsService {
  private static instance: NotificationsService;

  static getInstance(): NotificationsService {
    if (!NotificationsService.instance) {
      NotificationsService.instance = new NotificationsService();
    }
    return NotificationsService.instance;
  }

  async getNotifications(limit?: number): Promise<Notification[]> {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
      const notifications: Notification[] = stored ? JSON.parse(stored) : [];
      
      const sorted = notifications.sort((a, b) => b.timestamp - a.timestamp);
      return limit ? sorted.slice(0, limit) : sorted;
    } catch (error) {
      console.error("Error loading notifications:", error);
      return [];
    }
  }

  async getUnreadNotifications(): Promise<Notification[]> {
    try {
      const notifications = await this.getNotifications();
      return notifications.filter(n => !n.read);
    } catch (error) {
      console.error("Error loading unread notifications:", error);
      return [];
    }
  }

  async markNotificationAsRead(id: string): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      const index = notifications.findIndex(n => n.id === id);
      
      if (index !== -1) {
        notifications[index].read = true;
        await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }

  async markAllNotificationsAsRead(): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      const updated = notifications.map(n => ({ ...n, read: true }));
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  }

  async deleteNotification(id: string): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      const filtered = notifications.filter(n => n.id !== id);
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  }

  async clearAllNotifications(): Promise<void> {
    try {
      await AsyncStorage.removeItem(NOTIFICATIONS_KEY);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  }

  async addNotification(
    title: string,
    body: string,
    type: "reminder" | "achievement" | "system" | "study" | "job",
    data?: Record<string, any>,
    actionUrl?: string
  ): Promise<string> {
    try {
      const notificationId = Date.now().toString();
      const notification: Notification = {
        id: notificationId,
        title,
        body,
        type,
        timestamp: Date.now(),
        read: false,
        data,
        actionUrl,
      };

      const notifications = await this.getNotifications();
      notifications.unshift(notification);
      
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
      return notificationId;
    } catch (error) {
      console.error("Error adding notification:", error);
      throw error;
    }
  }

  async getReminders(): Promise<Reminder[]> {
    try {
      const stored = await AsyncStorage.getItem(REMINDERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading reminders:", error);
      return [];
    }
  }

  async createReminder(
    title: string,
    description: string,
    time: string,
    days: number[],
    type: "study" | "review" | "custom"
  ): Promise<string> {
    try {
      const reminderId = Date.now().toString();
      const reminder: Reminder = {
        id: reminderId,
        title,
        description,
        time,
        days,
        enabled: true,
        type,
      };

      const reminders = await this.getReminders();
      reminders.push(reminder);
      
      await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
      return reminderId;
    } catch (error) {
      console.error("Error creating reminder:", error);
      throw error;
    }
  }

  async updateReminder(id: string, updates: Partial<Reminder>): Promise<void> {
    try {
      const reminders = await this.getReminders();
      const index = reminders.findIndex(r => r.id === id);
      
      if (index !== -1) {
        reminders[index] = { ...reminders[index], ...updates };
        await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
      }
    } catch (error) {
      console.error("Error updating reminder:", error);
    }
  }

  async deleteReminder(id: string): Promise<void> {
    try {
      const reminders = await this.getReminders();
      const filtered = reminders.filter(r => r.id !== id);
      await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Error deleting reminder:", error);
    }
  }

  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      
      return this.getDefaultSettings();
    } catch (error) {
      console.error("Error loading notification settings:", error);
      return this.getDefaultSettings();
    }
  }

  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<void> {
    try {
      const current = await this.getNotificationSettings();
      const updated = { ...current, ...settings };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Error updating notification settings:", error);
    }
  }

  async scheduleReminder(reminderId: string): Promise<void> {
    try {
      const reminders = await this.getReminders();
      const reminder = reminders.find(r => r.id === reminderId);
      
      if (!reminder || !reminder.enabled) return;

      // In a real implementation, this would use expo-notifications
      // to schedule actual push notifications
      console.log(`Scheduling reminder: ${reminder.title} at ${reminder.time}`);
      
      // For now, just add a notification entry
      await this.addNotification(
        reminder.title,
        reminder.description,
        "reminder",
        { reminderId }
      );
    } catch (error) {
      console.error("Error scheduling reminder:", error);
    }
  }

  async sendStudyReminder(): Promise<void> {
    try {
      const settings = await this.getNotificationSettings();
      if (!settings.studyReminders || !settings.enabled) return;

      await this.addNotification(
        "Study Reminder",
        "Time for your German lesson! Keep up the great work!",
        "study",
        { type: "daily_reminder" }
      );
    } catch (error) {
      console.error("Error sending study reminder:", error);
    }
  }

  async sendJobAlert(jobTitle: string, company: string): Promise<void> {
    try {
      const settings = await this.getNotificationSettings();
      if (!settings.jobAlerts || !settings.enabled) return;

      await this.addNotification(
        "New Job Alert",
        `${jobTitle} at ${company} - Check it out!`,
        "job",
        { jobTitle, company }
      );
    } catch (error) {
      console.error("Error sending job alert:", error);
    }
  }

  async sendAchievement(achievement: string): Promise<void> {
    try {
      const settings = await this.getNotificationSettings();
      if (!settings.achievementNotifications || !settings.enabled) return;

      await this.addNotification(
        "Achievement Unlocked!",
        achievement,
        "achievement",
        { achievement }
      );
    } catch (error) {
      console.error("Error sending achievement:", error);
    }
  }

  private getDefaultSettings(): NotificationSettings {
    return {
      enabled: true,
      studyReminders: true,
      jobAlerts: true,
      achievementNotifications: true,
      systemUpdates: true,
      quietHours: {
        enabled: false,
        start: "22:00",
        end: "08:00",
      },
    };
  }
}

export const notificationsService = NotificationsService.getInstance();

// Export individual functions for convenience
export const getNotifications = (limit?: number) => notificationsService.getNotifications(limit);
export const getUnreadNotifications = () => notificationsService.getUnreadNotifications();
export const markNotificationAsRead = (id: string) => notificationsService.markNotificationAsRead(id);
export const markAllNotificationsAsRead = () => notificationsService.markAllNotificationsAsRead();
export const deleteNotification = (id: string) => notificationsService.deleteNotification(id);
export const addNotification = (
  title: string,
  body: string,
  type: "reminder" | "achievement" | "system" | "study" | "job",
  data?: Record<string, any>,
  actionUrl?: string
) => notificationsService.addNotification(title, body, type, data, actionUrl);
export const getReminders = () => notificationsService.getReminders();
export const createReminder = (
  title: string,
  description: string,
  time: string,
  days: number[],
  type: "study" | "review" | "custom"
) => notificationsService.createReminder(title, description, time, days, type);
export const updateReminder = (id: string, updates: Partial<Reminder>) => 
  notificationsService.updateReminder(id, updates);
export const deleteReminder = (id: string) => notificationsService.deleteReminder(id);
export const getNotificationSettings = () => notificationsService.getNotificationSettings();
export const updateNotificationSettings = (settings: Partial<NotificationSettings>) => 
  notificationsService.updateNotificationSettings(settings);
export const scheduleReminder = (reminderId: string) => notificationsService.scheduleReminder(reminderId);
