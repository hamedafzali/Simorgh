import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/use-theme";
import { useAuth } from "../../hooks/use-auth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import ChatAPI from "../../services/chat-api";
import {
  ChatSession as APIChatSession,
  ChatMessage as APIChatMessage,
} from "../../services/chat-api";

// Type assertion for Ionicons to fix TypeScript errors
const Icon = Ionicons as any;

// Type assertions to fix React Native component JSX errors
const RNScrollView = ScrollView as any;
const RNView = View as any;
const RNText = Text as any;
const RNTouchableOpacity = TouchableOpacity as any;
const RNFlatList = FlatList as any;
const RNTextInput = TextInput as any;
const RNActivityIndicator = ActivityIndicator as any;
const RNKeyboardAvoidingView = KeyboardAvoidingView as any;
const RNModal = Modal as any;

const mockSessions: APIChatSession[] = [
  {
    id: "1",
    title: "German Learning Support",
    lastMessage: 'How do I say "good morning" in German?',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    language: "German/English",
    isActive: true,
    userId: "current-user",
    messages: [
      {
        id: "1",
        sessionId: "1",
        text: 'How do I say "good morning" in German?',
        sender: "user",
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        language: "German/English",
      },
      {
        id: "2",
        sessionId: "1",
        text: 'In German, "good morning" is "Guten Morgen".',
        sender: "assistant",
        timestamp: new Date(Date.now() - 55 * 60 * 1000),
        language: "German/English",
      },
    ],
  },
  {
    id: "2",
    title: "Immigration Questions",
    lastMessage: "What documents do I need for residence permit?",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    language: "English/Farsi",
    isActive: true,
    userId: "current-user",
    messages: [
      {
        id: "3",
        sessionId: "2",
        text: "What documents do I need for residence permit?",
        sender: "user",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        language: "English/Farsi",
      },
      {
        id: "4",
        sessionId: "2",
        text: "You'll need a valid passport, visa application, proof of income, and health insurance.",
        sender: "assistant",
        timestamp: new Date(Date.now() - 1.9 * 60 * 60 * 1000),
        language: "English/Farsi",
      },
    ],
  },
  {
    id: "3",
    title: "Job Search Help",
    lastMessage: "Can you help me with my CV?",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    language: "English",
    isActive: false,
    userId: "current-user",
    messages: [
      {
        id: "5",
        sessionId: "3",
        text: "Can you help me with my CV?",
        sender: "user",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        language: "English",
      },
      {
        id: "6",
        sessionId: "3",
        text: "I'd be happy to help you with your CV! Let me know what specific areas you'd like to focus on.",
        sender: "assistant",
        timestamp: new Date(Date.now() - 23.9 * 60 * 60 * 1000),
        language: "English",
      },
    ],
  },
];

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { user } = useAuth();

  const [selectedSession, setSelectedSession] = useState<APIChatSession | null>(
    null
  );
  const [sessions, setSessions] = useState<APIChatSession[]>(mockSessions);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("German/English");

  const chatAPI = ChatAPI.getInstance();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (flatListRef.current && selectedSession?.messages) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [selectedSession?.messages]);

  const sendMessage = async () => {
    if (!message.trim() || !selectedSession || !user) return;

    try {
      const userMessage = message.trim();
      setMessage("");

      // Add user message immediately for better UX
      const tempMessage: APIChatMessage = {
        id: Date.now().toString(),
        sessionId: selectedSession.id,
        text: userMessage,
        sender: "user",
        timestamp: new Date(),
        language: selectedSession.language,
      };

      const updatedSession = {
        ...selectedSession,
        messages: [...selectedSession.messages, tempMessage],
        lastMessage: userMessage,
        timestamp: new Date(),
      };

      setSelectedSession(updatedSession);
      setSessions(
        sessions.map((s) => (s.id === selectedSession.id ? updatedSession : s))
      );

      // Get AI response
      const aiMessage = await chatAPI.sendMessage(
        selectedSession.id,
        userMessage,
        user.id
      );

      // Update session with AI response
      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, aiMessage],
        lastMessage: aiMessage.text,
        timestamp: new Date(),
      };

      setSelectedSession(finalSession);
      setSessions(
        sessions.map((s) => (s.id === selectedSession.id ? finalSession : s))
      );
    } catch (error) {
      Alert.alert("Error", "Failed to send message");
    }
  };

  const createNewSession = async () => {
    if (!user || !newSessionTitle.trim()) return;

    try {
      setIsLoading(true);
      const newSession = await chatAPI.createSession(
        user.id,
        newSessionTitle,
        selectedLanguage
      );
      setSessions([newSession, ...sessions]);
      setSelectedSession(newSession);
      setShowNewSessionModal(false);
      setNewSessionTitle("");
    } catch (error) {
      Alert.alert("Error", "Failed to create new session");
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (msg: APIChatMessage) => {
    const isUser = msg.sender === "user";

    return (
      <RNView
        key={msg.id}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.assistantMessage,
          { backgroundColor: isUser ? theme.accent : theme.cardBackground },
        ]}
      >
        <RNText
          style={[
            styles.messageText,
            { color: isUser ? "#FFFFFF" : theme.text },
          ]}
        >
          {msg.text}
        </RNText>
        <RNText
          style={[
            styles.messageTime,
            { color: isUser ? "#FFFFFF80" : theme.textSecondary },
          ]}
        >
          {msg.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </RNText>
      </RNView>
    );
  };

  if (!user) {
    return (
      <RNView
        style={[
          styles.container,
          { backgroundColor: theme.background, paddingTop: insets.top },
        ]}
      >
        <RNView style={styles.centerContainer}>
          <Icon name="person-outline" size={64} color={theme.textSecondary} />
          <RNText style={[styles.centerText, { color: theme.text }]}>
            Please log in to use the chat feature
          </RNText>
          <RNTouchableOpacity
            style={[styles.loginButton, { backgroundColor: theme.accent }]}
            onPress={() => router.push("/auth/login")}
          >
            <RNText style={styles.loginButtonText}>Log In</RNText>
          </RNTouchableOpacity>
        </RNView>
      </RNView>
    );
  }

  return (
    <RNView
      style={[
        styles.container,
        { backgroundColor: theme.background, paddingTop: insets.top },
      ]}
    >
      {/* Header */}
      <RNView style={[styles.header, { borderBottomColor: theme.border }]}>
        <RNText style={[styles.headerTitle, { color: theme.text }]}>
          AI Assistant
        </RNText>
        <RNTouchableOpacity
          style={[styles.newSessionButton, { backgroundColor: theme.accent }]}
          onPress={() => setShowNewSessionModal(true)}
        >
          <Icon name="add-outline" size={20} color="#FFFFFF" />
        </RNTouchableOpacity>
      </RNView>

      {/* Sessions List or Current Chat */}
      {!selectedSession ? (
        <RNView style={styles.sessionsContainer}>
          <RNText style={[styles.sessionsTitle, { color: theme.text }]}>
            Chat Sessions
          </RNText>
          {sessions.length === 0 ? (
            <RNView style={styles.emptyContainer}>
              <Icon
                name="chatbubble-outline"
                size={48}
                color={theme.textSecondary}
              />
              <RNText
                style={[styles.emptyText, { color: theme.textSecondary }]}
              >
                No chat sessions yet
              </RNText>
              <RNTouchableOpacity
                style={[
                  styles.startChatButton,
                  { backgroundColor: theme.accent },
                ]}
                onPress={() => setShowNewSessionModal(true)}
              >
                <RNText style={styles.startChatButtonText}>
                  Start New Chat
                </RNText>
              </RNTouchableOpacity>
            </RNView>
          ) : (
            <RNScrollView style={styles.sessionsList}>
              {sessions.map((session) => (
                <RNTouchableOpacity
                  key={session.id}
                  style={[
                    styles.sessionItem,
                    {
                      backgroundColor: theme.cardBackground,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => setSelectedSession(session)}
                >
                  <RNView style={styles.sessionContent}>
                    <RNText
                      style={[styles.sessionTitle, { color: theme.text }]}
                    >
                      {session.title}
                    </RNText>
                    <RNText
                      style={[
                        styles.sessionLastMessage,
                        { color: theme.textSecondary },
                      ]}
                      numberOfLines={1}
                    >
                      {session.lastMessage}
                    </RNText>
                    <RNText
                      style={[
                        styles.sessionTime,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {session.timestamp.toLocaleDateString()}
                    </RNText>
                  </RNView>
                </RNTouchableOpacity>
              ))}
            </RNScrollView>
          )}
        </RNView>
      ) : (
        <RNKeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* Messages */}
          <RNFlatList
            ref={flatListRef}
            style={styles.messagesContainer}
            data={selectedSession.messages}
            renderItem={({ item }: { item: APIChatMessage }) =>
              renderMessage(item)
            }
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />

          {/* Input */}
          <RNView
            style={[styles.inputContainer, { borderTopColor: theme.border }]}
          >
            <RNTextInput
              style={[
                styles.input,
                { backgroundColor: theme.cardBackground, color: theme.text },
              ]}
              placeholder="Type your message..."
              placeholderTextColor={theme.textSecondary}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
            />
            <RNTouchableOpacity
              style={[styles.sendButton, { backgroundColor: theme.accent }]}
              onPress={sendMessage}
              disabled={!message.trim()}
            >
              <Icon name="send-outline" size={20} color="#FFFFFF" />
            </RNTouchableOpacity>
          </RNView>
        </RNKeyboardAvoidingView>
      )}

      {/* New Session Modal */}
      <RNModal
        visible={showNewSessionModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <RNView
          style={[
            styles.modalContainer,
            { backgroundColor: theme.background, paddingTop: insets.top },
          ]}
        >
          <RNView
            style={[styles.modalHeader, { borderBottomColor: theme.border }]}
          >
            <RNTouchableOpacity onPress={() => setShowNewSessionModal(false)}>
              <Icon name="close-outline" size={24} color={theme.text} />
            </RNTouchableOpacity>
            <RNText style={[styles.modalTitle, { color: theme.text }]}>
              New Chat Session
            </RNText>
            <RNTouchableOpacity
              onPress={createNewSession}
              disabled={!newSessionTitle.trim()}
            >
              <RNText
                style={[
                  styles.modalDone,
                  {
                    color: newSessionTitle.trim()
                      ? theme.accent
                      : theme.textSecondary,
                  },
                ]}
              >
                Create
              </RNText>
            </RNTouchableOpacity>
          </RNView>

          <RNView style={styles.modalContent}>
            <RNText style={[styles.inputLabel, { color: theme.text }]}>
              Session Title
            </RNText>
            <RNTextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: theme.cardBackground,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="e.g., German Learning, Job Search"
              placeholderTextColor={theme.textSecondary}
              value={newSessionTitle}
              onChangeText={setNewSessionTitle}
              autoFocus
            />

            <RNText
              style={[styles.inputLabel, { color: theme.text, marginTop: 20 }]}
            >
              Language Preference
            </RNText>
            <RNView style={styles.languageOptions}>
              {[
                "German/English",
                "German/Farsi",
                "German/Arabic",
                "German/Turkish",
              ].map((lang) => (
                <RNTouchableOpacity
                  key={lang}
                  style={[
                    styles.languageOption,
                    {
                      backgroundColor:
                        selectedLanguage === lang
                          ? theme.accent
                          : theme.cardBackground,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => setSelectedLanguage(lang)}
                >
                  <RNText
                    style={[
                      styles.languageText,
                      {
                        color:
                          selectedLanguage === lang ? "#FFFFFF" : theme.text,
                      },
                    ]}
                  >
                    {lang}
                  </RNText>
                </RNTouchableOpacity>
              ))}
            </RNView>
          </RNView>
        </RNView>
      </RNModal>
    </RNView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  newSessionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sessionsContainer: {
    flex: 1,
    padding: 16,
  },
  sessionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 24,
  },
  startChatButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startChatButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  sessionsList: {
    flex: 1,
  },
  sessionItem: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  sessionContent: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  sessionLastMessage: {
    fontSize: 14,
    marginBottom: 4,
  },
  sessionTime: {
    fontSize: 12,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
  },
  assistantMessage: {
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 16,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    marginRight: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalDone: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalContent: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  modalInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  languageOptions: {
    marginTop: 8,
  },
  languageOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  languageText: {
    fontSize: 16,
    fontWeight: "500",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  centerText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  loginButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
