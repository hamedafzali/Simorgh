import AsyncStorage from "@react-native-async-storage/async-storage";
import { ErrorHandler } from "../utils/error-handler";
import SyncService from "./sync-service";

export interface ChatMessage {
  id: string;
  sessionId: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
  language: string;
  isTyping?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  language: string;
  isActive: boolean;
  userId: string;
  messages: ChatMessage[];
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
  isComplete: boolean;
}

class ChatAPI {
  private static instance: ChatAPI;
  private errorHandler: ErrorHandler;
  private syncService: SyncService;
  private baseUrl: string;

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.syncService = SyncService.getInstance();
    this.baseUrl = "https://api.simorgh-connect.com/chat"; // Mock API URL
  }

  static getInstance(): ChatAPI {
    if (!ChatAPI.instance) {
      ChatAPI.instance = new ChatAPI();
    }
    return ChatAPI.instance;
  }

  async getSessions(userId: string): Promise<ChatSession[]> {
    try {
      const cachedSessions = await this.getCachedSessions();

      if (this.syncService.getNetworkStatus()) {
        // Fetch from server
        const response = await this.fetchSessions(userId);

        // Update cache
        await this.cacheSessions(response);

        return response;
      } else {
        // Return cached data when offline
        return cachedSessions.filter((session) => session.userId === userId);
      }
    } catch (error) {
      this.errorHandler.handleNetworkError(error, "getSessions");
      return [];
    }
  }

  async getSession(sessionId: string): Promise<ChatSession | null> {
    try {
      const sessions = await this.getCachedSessions();
      return sessions.find((session) => session.id === sessionId) || null;
    } catch (error) {
      this.errorHandler.handleNetworkError(error, "getSession");
      return null;
    }
  }

  async createSession(
    userId: string,
    title: string,
    language: string
  ): Promise<ChatSession> {
    try {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title,
        lastMessage: "Start a conversation...",
        timestamp: new Date(),
        language,
        isActive: true,
        userId,
        messages: [
          {
            id: "1",
            sessionId: Date.now().toString(),
            text: "Hello! I'm your AI assistant for the Simorgh Connect community. How can I help you today?",
            sender: "assistant",
            timestamp: new Date(),
            language,
          },
        ],
      };

      if (this.syncService.getNetworkStatus()) {
        // Send to server
        const response = await this.postSession(newSession);

        // Update local cache
        await this.addSessionToCache(response);

        return response;
      } else {
        // Add to sync queue for when online
        await this.syncService.addToSyncQueue(
          "create",
          "chat_session",
          newSession.id,
          newSession
        );
        await this.addSessionToCache(newSession);

        return newSession;
      }
    } catch (error) {
      this.errorHandler.handleNetworkError(error, "createSession");
      throw error;
    }
  }

  async sendMessage(
    sessionId: string,
    message: string,
    userId: string
  ): Promise<ChatMessage> {
    try {
      const session = await this.getSession(sessionId);
      if (!session) {
        throw new Error("Session not found");
      }

      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        sessionId,
        text: message,
        sender: "user",
        timestamp: new Date(),
        language: session.language,
      };

      await this.addMessageToSession(sessionId, userMessage);

      // Get AI response
      const aiResponse = await this.getAIResponse(message, session.language);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sessionId,
        text: aiResponse.message,
        sender: "assistant",
        timestamp: new Date(),
        language: session.language,
      };

      await this.addMessageToSession(sessionId, assistantMessage);

      // Update session
      await this.updateSessionLastMessage(sessionId, aiResponse.message);

      return assistantMessage;
    } catch (error) {
      this.errorHandler.handleNetworkError(error, "sendMessage");
      throw error;
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    try {
      if (this.syncService.getNetworkStatus()) {
        // Send to server
        await this.deleteSessionFromServer(sessionId);
      } else {
        // Add to sync queue for when online
        await this.syncService.addToSyncQueue(
          "delete",
          "chat_session",
          sessionId,
          { id: sessionId }
        );
      }

      // Remove from local cache
      await this.removeSessionFromCache(sessionId);
    } catch (error) {
      this.errorHandler.handleNetworkError(error, "deleteSession");
      throw error;
    }
  }

  async updateSessionTitle(sessionId: string, title: string): Promise<void> {
    try {
      const sessions = await this.getCachedSessions();
      const sessionIndex = sessions.findIndex((s) => s.id === sessionId);

      if (sessionIndex !== -1) {
        sessions[sessionIndex].title = title;
        await this.cacheSessions(sessions);

        if (this.syncService.getNetworkStatus()) {
          await this.updateSessionOnServer(sessionId, { title });
        } else {
          await this.syncService.addToSyncQueue(
            "update",
            "chat_session",
            sessionId,
            { title }
          );
        }
      }
    } catch (error) {
      this.errorHandler.handleNetworkError(error, "updateSessionTitle");
      throw error;
    }
  }

  // Private methods for API calls
  private async fetchSessions(userId: string): Promise<ChatSession[]> {
    // Mock API call - replace with actual implementation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Return mock data for now
    return this.getMockSessions(userId);
  }

  private async postSession(session: ChatSession): Promise<ChatSession> {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return session;
  }

  private async deleteSessionFromServer(sessionId: string): Promise<void> {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  private async updateSessionOnServer(
    sessionId: string,
    updates: Partial<ChatSession>
  ): Promise<void> {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  private async getAIResponse(
    message: string,
    language: string
  ): Promise<ChatResponse> {
    // Mock AI response - replace with actual AI service
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return {
        message:
          "Hello! How can I help you with your German learning or life in Germany today?",
        suggestions: [
          "German vocabulary",
          "Job search tips",
          "Immigration help",
        ],
        isComplete: true,
      };
    }

    if (lowerMessage.includes("thank")) {
      return {
        message:
          "You're welcome! Is there anything else you'd like to know about German language or culture?",
        suggestions: [
          "More German phrases",
          "Cultural tips",
          "Practice exercises",
        ],
        isComplete: true,
      };
    }

    if (lowerMessage.includes("german")) {
      return {
        message:
          "German is a fascinating language! It has three grammatical genders and compound words. What specific aspect of German would you like to learn about?",
        suggestions: ["Grammar basics", "Common phrases", "Pronunciation tips"],
        isComplete: true,
      };
    }

    if (
      lowerMessage.includes("berlin") ||
      lowerMessage.includes("munich") ||
      lowerMessage.includes("frankfurt")
    ) {
      return {
        message:
          "Germany has many wonderful cities! Each has its own character and opportunities. Are you looking for information about a specific city?",
        suggestions: ["Berlin jobs", "Munich housing", "Frankfurt community"],
        isComplete: true,
      };
    }

    if (lowerMessage.includes("job") || lowerMessage.includes("work")) {
      return {
        message:
          "I can help you with job searching in Germany! There are many opportunities for international workers. What type of work are you looking for?",
        suggestions: ["Tech jobs", "Healthcare positions", "Service industry"],
        isComplete: true,
      };
    }

    return {
      message:
        "That's a great question! Let me help you with that. Could you provide more details so I can give you the most helpful response?",
      suggestions: ["Be more specific", "Ask about German", "Ask about jobs"],
      isComplete: true,
    };
  }

  // Cache management
  private async getCachedSessions(): Promise<ChatSession[]> {
    try {
      const cached = await AsyncStorage.getItem("chat_sessions_cache");
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      return [];
    }
  }

  private async cacheSessions(sessions: ChatSession[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        "chat_sessions_cache",
        JSON.stringify(sessions)
      );
    } catch (error) {
      console.error("Error caching sessions:", error);
    }
  }

  private async addSessionToCache(session: ChatSession): Promise<void> {
    const sessions = await this.getCachedSessions();
    sessions.unshift(session);
    await this.cacheSessions(sessions);
  }

  private async removeSessionFromCache(sessionId: string): Promise<void> {
    const sessions = await this.getCachedSessions();
    const filtered = sessions.filter((session) => session.id !== sessionId);
    await this.cacheSessions(filtered);
  }

  private async addMessageToSession(
    sessionId: string,
    message: ChatMessage
  ): Promise<void> {
    const sessions = await this.getCachedSessions();
    const sessionIndex = sessions.findIndex((s) => s.id === sessionId);

    if (sessionIndex !== -1) {
      sessions[sessionIndex].messages.push(message);
      await this.cacheSessions(sessions);
    }
  }

  private async updateSessionLastMessage(
    sessionId: string,
    lastMessage: string
  ): Promise<void> {
    const sessions = await this.getCachedSessions();
    const sessionIndex = sessions.findIndex((s) => s.id === sessionId);

    if (sessionIndex !== -1) {
      sessions[sessionIndex].lastMessage = lastMessage;
      sessions[sessionIndex].timestamp = new Date();
      await this.cacheSessions(sessions);
    }
  }

  private getMockSessions(userId: string): ChatSession[] {
    return [
      {
        id: "1",
        title: "German Learning Support",
        lastMessage: 'How do I say "good morning" in German?',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        language: "German/English",
        isActive: true,
        userId,
        messages: [
          {
            id: "1",
            sessionId: "1",
            text: "Hello! I'm here to help you with your German language learning journey. What can I assist you with today?",
            sender: "assistant",
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
            language: "English",
          },
          {
            id: "2",
            sessionId: "1",
            text: 'How do I say "good morning" in German?',
            sender: "user",
            timestamp: new Date(Date.now() - 4 * 60 * 1000),
            language: "English",
          },
          {
            id: "3",
            sessionId: "1",
            text: 'In German, "good morning" is "Guten Morgen". You can also use "Guten Tag" for "good day" which is more general.',
            sender: "assistant",
            timestamp: new Date(Date.now() - 3 * 60 * 1000),
            language: "English",
          },
        ],
      },
      // Add more mock sessions as needed
    ];
  }
}

export default ChatAPI;
