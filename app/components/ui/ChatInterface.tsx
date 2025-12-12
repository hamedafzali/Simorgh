import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ModernButton } from "@/components/ui/modern-button";
import { ModernChip } from "@/components/ui/modern-chip";
import PageHeader from "@/components/ui/page-header";
import { Card, Layout } from "@/constants/common-styles";
import { Spacing, Typography } from "@/constants/theme";
import { askChatbot } from "@/services/chat";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const CHAT_HISTORY_KEY = "Simorgh.chat.history.v1";
const MAX_HISTORY = 30;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 100, // Reduced for modern header
    paddingBottom: Spacing.xl,
    flex: 1,
  },
  suggestionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  suggestionChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  suggestionText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: "#3B82F6",
  },
  messagesContainer: {
    flex: 1,
    marginBottom: Spacing.md,
  },
  messages: {
    flex: 1,
  },
  messageRow: {
    marginVertical: Spacing.xs,
    flexDirection: "row",
  },
  messageRowUser: {
    justifyContent: "flex-end",
  },
  messageRowAssistant: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "80%",
    borderRadius: 16,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  bubbleUser: {
    backgroundColor: "#3B82F6",
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  messageText: {
    fontSize: Typography.sizes.base,
    lineHeight: 22,
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  assistantMessageText: {
    color: "rgba(255,255,255,0.9)",
  },
  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  typingText: {
    fontSize: Typography.sizes.sm,
    color: "rgba(255,255,255,0.6)",
    fontStyle: "italic",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    borderRadius: 22,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    color: "#FFFFFF",
    fontSize: Typography.sizes.base,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  clearButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignSelf: "flex-end",
  },
  clearButtonText: {
    fontSize: Typography.sizes.xs,
    color: "rgba(255,255,255,0.7)",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default function ChatScreen() {
  const { i18n, t } = useTranslation();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<ScrollView | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  useEffect(() => {
    let isMounted = true;

    const loadHistory = async () => {
      try {
        const stored = await AsyncStorage.getItem(CHAT_HISTORY_KEY);
        if (!isMounted) return;

        if (stored) {
          const parsed = JSON.parse(stored) as ChatMessage[];
          if (parsed.length > 0) {
            setMessages(parsed);
            setLoading(false);
            return;
          }
        }

        // Add welcome message if no history
        const welcomeMessage: ChatMessage = {
          id: Date.now().toString(),
          role: "assistant",
          text:
            i18n.language === "fa"
              ? "سلام! من دستیار سیمرغ هستم. از من در مورد موضوعاتی مثل آن‌ملدونگ، بیمه سلامت، دوره‌های ادغام یا جستجوی کار در آلمان سوال بپرسید."
              : i18n.language === "de"
              ? "Hallo! Ich bin Simorghs Assistent. Frag mich über Themen wie Anmeldung, Krankenversicherung, Integrationskurse oder Jobsuche in Deutschland."
              : "Hello! I&apos;m Simorgh&apos;s assistant. Ask me about topics like Anmeldung, health insurance, integration courses, or job search in Germany.",
        };
        setMessages([welcomeMessage]);
      } catch (error) {
        console.warn("chat history load error", error);
      } finally {
        if (isMounted) {
          setLoading(false);
          // Fade in animation
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }).start();
        }
      }
    };

    // Listen for language changes
    const handleLanguageChanged = () => {
      forceUpdate();
    };

    i18n.on("languageChanged", handleLanguageChanged);

    loadHistory();

    return () => {
      isMounted = false;
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, [i18n, fadeAnim, forceUpdate]);

  useEffect(() => {
    if (!messages.length) return;
    const limited = messages.slice(-MAX_HISTORY);
    AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(limited)).catch(
      (error) => {
        console.warn("chat history save error", error);
      }
    );
  }, [messages]);

  const scrollToBottom = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    scrollToBottom();

    setSending(true);
    try {
      const reply = await askChatbot(trimmed, i18n.language);
      if (reply) {
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: reply,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        scrollToBottom();
      }
    } catch (error) {
      console.warn("chat send error", error);
    } finally {
      setSending(false);
    }
  };

  const handleSuggestion = (question: string) => {
    setInput(question);
  };

  const handleClearHistory = async () => {
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "assistant",
      text:
        i18n.language === "fa"
          ? "سلام! من دستیار سیمرغ هستم. از من در مورد موضوعاتی مثل آن‌ملدونگ، بیمه سلامت، دوره‌های ادغام یا جستجوی کار در آلمان سوال بپرسید."
          : i18n.language === "de"
          ? "Hallo! Ich bin Simorghs Assistent. Frag mich über Themen wie Anmeldung, Krankenversicherung, Integrationskurse oder Jobsuche in Deutschland."
          : "Hello! I&apos;m Simorgh&apos;s assistant. Ask me about topics like Anmeldung, health insurance, integration courses, or job search in Germany.",
    };
    setMessages([welcomeMessage]);
    try {
      await AsyncStorage.removeItem(CHAT_HISTORY_KEY);
    } catch (error) {
      console.warn("chat history clear error", error);
    }
  };

  if (loading) {
    return (
      <View style={Layout.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      </View>
    );
  }

  return (
    <View style={Layout.container} key={i18n.language}>
      {/* Page Header */}
      <PageHeader
        title={t("chat.title")}
        showBackButton={true}
        onBackPress={() => router.back()}
        height="medium"
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 80, android: 0 }) ?? 0}
      >
        <View style={styles.content}>
          <Animated.View style={[{ opacity: fadeAnim }]}>
            {/* Suggestions Card */}
            <ThemedView style={Card.glass}>
              <View style={styles.suggestionsRow}>
                <ModernChip
                  label={t("chat.suggestionAnmeldung")}
                  onPress={() =>
                    handleSuggestion(
                      i18n.language === "fa"
                        ? "آن‌ملدونگ چیست و چگونه انجام دهم؟"
                        : "What is Anmeldung and how do I do it?"
                    )
                  }
                />
                <ModernChip
                  label={t("chat.suggestionHealth")}
                  onPress={() =>
                    handleSuggestion(
                      i18n.language === "fa"
                        ? "بیمه سلامت در آلمان چگونه کار می‌کند؟"
                        : "How does health insurance work in Germany?"
                    )
                  }
                />
                <ModernChip
                  label={t("chat.suggestionJobs")}
                  onPress={() =>
                    handleSuggestion(
                      i18n.language === "fa"
                        ? "چگونه می‌توانم به عنوان یک تازه‌وارد در آلمان شغل پیدا کنم؟"
                        : "How can I find a job as a newcomer in Germany?"
                    )
                  }
                />
              </View>
              <ModernButton
                variant="secondary"
                size="sm"
                onPress={handleClearHistory}
                title="Clear history"
              />
            </ThemedView>

            <ScrollView
              ref={scrollRef}
              style={styles.messages}
              contentContainerStyle={{ paddingBottom: Spacing.md }}
              showsVerticalScrollIndicator={false}
            >
              {messages.map((m) => (
                <View
                  key={m.id}
                  style={[
                    styles.messageRow,
                    m.role === "user"
                      ? styles.messageRowUser
                      : styles.messageRowAssistant,
                  ]}
                >
                  <View
                    style={[
                      styles.bubble,
                      m.role === "user"
                        ? styles.bubbleUser
                        : styles.bubbleAssistant,
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.messageText,
                        m.role === "user"
                          ? styles.userMessageText
                          : styles.assistantMessageText,
                      ]}
                    >
                      {m.text}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </ScrollView>
            {sending && (
              <View style={styles.typingRow}>
                <ThemedText style={styles.typingText}>
                  Simorgh is typing...
                </ThemedText>
              </View>
            )}
          </Animated.View>
        </View>

        {/* Input Row */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder={t("chat.placeholder")}
            placeholderTextColor="rgba(255,255,255,0.5)"
            multiline
          />
          <ModernButton
            variant="primary"
            size="sm"
            onPress={handleSend}
            disabled={!input.trim() || sending}
            icon={
              <IconSymbol
                name="arrow.up"
                size={20}
                color={
                  input.trim() && !sending ? "#FFFFFF" : "rgba(255,255,255,0.5)"
                }
              />
            }
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
