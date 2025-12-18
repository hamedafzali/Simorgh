import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, Typography, BorderRadius } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";
import { Screen } from "../components/ui/Screen";

type Message = {
  id: string;
  from: "me" | "system";
  text: string;
};

export default function ChatScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: "1",
      from: "system",
      text: "Ask a question about life in Germany or German learning — this is a local mock chat.",
    },
  ]);

  const canSend = text.trim().length > 0;

  const rendered = useMemo(() => {
    return messages.map((m) => {
      const isMe = m.from === "me";
      return (
        <View
          key={m.id}
          style={[
            styles.bubble,
            {
              alignSelf: isMe ? "flex-end" : "flex-start",
              backgroundColor: isMe ? palette.primary : palette.surface,
              borderColor: palette.borderLight,
            },
          ]}
        >
          <Text
            style={{
              color: isMe ? palette.white : palette.textPrimary,
              fontSize: Typography.sizes.bodySecondary,
              lineHeight: 22,
            }}
          >
            {m.text}
          </Text>
        </View>
      );
    });
  }, [messages, palette]);

  function onSend() {
    if (!canSend) return;

    const next: Message = {
      id: String(Date.now()),
      from: "me",
      text: text.trim(),
    };
    setMessages((prev) => [...prev, next]);
    setText("");
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: palette.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
    >
      <Screen scroll={false}>
        <PageHeader title="Chat" subtitle="Community help (mock)" />

        <View style={{ flex: 1 }}>
          <Card style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>{rendered}</View>
          </Card>

          <View style={styles.composer}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Type your message…"
              placeholderTextColor={palette.textMuted}
              style={[
                styles.input,
                {
                  color: palette.textPrimary,
                  borderColor: palette.borderLight,
                  backgroundColor: palette.surface,
                },
              ]}
            />
            <View style={{ width: Spacing.sm }} />
            <Button title="Send" onPress={onSend} disabled={!canSend} />
          </View>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: "85%",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  composer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.md,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    fontSize: Typography.sizes.bodySecondary,
  },
});
