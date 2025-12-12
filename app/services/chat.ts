import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: number;
  language?: "fa" | "de" | "en";
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  lastActivity: number;
  language: "fa" | "de" | "en";
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
  relatedTopics?: string[];
}

const CHAT_SESSIONS_KEY = "simorgh_chat_sessions";

export class ChatService {
  private static instance: ChatService;

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  async askChatbot(message: string, language: "fa" | "de" | "en" = "en"): Promise<ChatResponse> {
    try {
      // Simulate API call to chatbot
      // In a real implementation, this would call an actual AI service
      const response = await this.generateChatbotResponse(message, language);
      
      // Save the conversation
      await this.saveMessage(message, response.message, language);
      
      return response;
    } catch (error) {
      console.error("Error asking chatbot:", error);
      throw error;
    }
  }

  async getChatSessions(): Promise<ChatSession[]> {
    try {
      const stored = await AsyncStorage.getItem(CHAT_SESSIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading chat sessions:", error);
      return [];
    }
  }

  async getChatSession(sessionId: string): Promise<ChatSession | null> {
    try {
      const sessions = await this.getChatSessions();
      return sessions.find(s => s.id === sessionId) || null;
    } catch (error) {
      console.error("Error loading chat session:", error);
      return null;
    }
  }

  async createChatSession(title: string, language: "fa" | "de" | "en"): Promise<string> {
    try {
      const sessionId = Date.now().toString();
      const session: ChatSession = {
        id: sessionId,
        title,
        messages: [],
        createdAt: Date.now(),
        lastActivity: Date.now(),
        language,
      };

      const sessions = await this.getChatSessions();
      sessions.unshift(session); // Add to beginning
      
      await AsyncStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions));
      return sessionId;
    } catch (error) {
      console.error("Error creating chat session:", error);
      throw error;
    }
  }

  async deleteChatSession(sessionId: string): Promise<void> {
    try {
      const sessions = await this.getChatSessions();
      const filtered = sessions.filter(s => s.id !== sessionId);
      await AsyncStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Error deleting chat session:", error);
    }
  }

  async saveMessage(
    userMessage: string, 
    assistantMessage: string, 
    language: "fa" | "de" | "en"
  ): Promise<void> {
    try {
      let sessions = await this.getChatSessions();
      let session = sessions.find(s => s.language === language);

      if (!session) {
        // Create new session if none exists for this language
        const sessionId = await this.createChatSession(
          this.generateSessionTitle(userMessage), 
          language
        );
        session = await this.getChatSession(sessionId);
        if (!session) return;
      }

      // Add messages
      const userChatMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "user",
        content: userMessage,
        timestamp: Date.now(),
        language,
      };

      const assistantChatMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: assistantMessage,
        timestamp: Date.now(),
        language,
      };

      session.messages.push(userChatMessage, assistantChatMessage);
      session.lastActivity = Date.now();

      // Update sessions
      const otherSessions = sessions.filter(s => s.id !== session.id);
      otherSessions.unshift(session);
      
      await AsyncStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(otherSessions));
    } catch (error) {
      console.error("Error saving message:", error);
    }
  }

  async clearChatHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CHAT_SESSIONS_KEY);
    } catch (error) {
      console.error("Error clearing chat history:", error);
    }
  }

  private async generateChatbotResponse(
    message: string, 
    language: "fa" | "de" | "en"
  ): Promise<ChatResponse> {
    // Simulate AI response generation
    // In a real implementation, this would call an actual AI service
    
    const responses = {
      en: {
        message: "That's a great question about learning German! Let me help you with that.",
        suggestions: [
          "How do I say 'hello' in German?",
          "What are common German phrases?",
          "How can I improve my German vocabulary?"
        ],
        relatedTopics: ["Greetings", "Basic Phrases", "Vocabulary Building"]
      },
      de: {
        message: "Das ist eine tolle Frage zum Deutschlernen! Lassen Sie mich Ihnen damit helfen.",
        suggestions: [
          "Wie sage ich 'Hallo' auf Deutsch?",
          "Was sind gängige deutsche Redewendungen?",
          "Wie kann ich meinen deutschen Wortschatz verbessern?"
        ],
        relatedTopics: ["Begrüßungen", "Grundlegende Phrasen", "Wortschatzerweiterung"]
      },
      fa: {
        message: "این سوال خوبی در مورد یادگیری آلمانی است! بگذارید به شما کمک کنم.",
        suggestions: [
          "چطور 'سلام' را به آلمانی بگویم؟",
          "عبارات رایج آلمانی کدامند؟",
          "چطور دایره لغات آلمانی خود را بهبود دهم؟"
        ],
        relatedTopics: ["سلام و احوالپرسی", "عبارات پایه", "گسترش دایره لغات"]
      }
    };

    return responses[language] || responses.en;
  }

  private generateSessionTitle(firstMessage: string): string {
    // Generate a title from the first message
    const maxLength = 30;
    const title = firstMessage.length > maxLength 
      ? firstMessage.substring(0, maxLength) + "..." 
      : firstMessage;
    
    return title;
  }
}

export const chatService = ChatService.getInstance();

// Export individual functions for convenience
export const askChatbot = (message: string, language?: "fa" | "de" | "en") => 
  chatService.askChatbot(message, language);
export const getChatSessions = () => chatService.getChatSessions();
export const getChatSession = (sessionId: string) => chatService.getChatSession(sessionId);
export const createChatSession = (title: string, language: "fa" | "de" | "en") => 
  chatService.createChatSession(title, language);
export const deleteChatSession = (sessionId: string) => chatService.deleteChatSession(sessionId);
export const clearChatHistory = () => chatService.clearChatHistory();
