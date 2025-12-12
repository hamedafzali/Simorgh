import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ModernButton } from "@/components/ui/modern-button";
import { ModernCard } from "@/components/ui/modern-card";
import PageHeader from "@/components/ui/page-header";
import { Spacing, Typography } from "@/constants/theme";
import { Card, Input, Layout, List, Button } from "@/constants/common-styles";
import { useTheme } from "@/contexts/theme-context";
import {
  addDocument,
  listDocuments,
  removeDocument,
  type StoredDocument,
} from "@/services/documents";
import { scheduleReminder } from "@/services/notifications";

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 120, // Match header height + status bar
    gap: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  cardTitle: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.semibold,
    marginBottom: Spacing.md,
  },
  toolText: {
    flex: 1,
  },
  toolTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    marginBottom: 4,
  },
  toolDescription: {
    fontSize: Typography.sizes.sm,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.sm,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 8,
    marginBottom: Spacing.xs,
  },
});

export default function ToolsScreen() {
  const router = useRouter();
  const { colors } = useTheme(); // Add theme hook
  const [docs, setDocs] = useState<StoredDocument[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderMinutes, setReminderMinutes] = useState("");
  const [scheduling, setScheduling] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const data = await listDocuments();
        if (!isMounted) return;
        setDocs(data);

        // Fade in animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.warn("Tools load error", error);
        if (!isMounted) return;
        setDocs([]);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fadeAnim]);

  const handleAddDocument = async () => {
    if (!newTitle.trim()) return;

    setSaving(true);
    try {
      await addDocument({ title: newTitle.trim(), type: "other" });
      setNewTitle("");
      const updated = await listDocuments();
      setDocs(updated);
    } catch (error) {
      console.warn("Add document error", error);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveDocument = async (id: string) => {
    try {
      await removeDocument(id);
      const updated = await listDocuments();
      setDocs(updated);
    } catch (error) {
      console.warn("Remove document error", error);
    }
  };

  const handleScheduleReminder = async () => {
    if (!reminderTitle.trim() || !reminderMinutes.trim()) return;

    setScheduling(true);
    try {
      const title = reminderTitle.trim();
      const body = "Reminder from Simorgh app";
      const seconds = parseInt(reminderMinutes) * 60;
      await scheduleReminder(title, body, seconds);
      setReminderTitle("");
      setReminderMinutes("");
    } catch (error) {
      console.warn("Schedule reminder error", error);
    } finally {
      setScheduling(false);
    }
  };

  return (
    <View style={[Layout.container, { backgroundColor: colors.background }]}>
      {/* Page Header */}
      <PageHeader
        title="Tools"
        showBackButton={true}
        onBackPress={() => router.back()}
        height="medium"
      />

      {/* Card-based Content */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[{ opacity: fadeAnim }]}>
          <ThemedView
            style={[
              Card.glass,
              {
                backgroundColor: colors.card as any,
                borderColor: colors.border as any,
              },
            ]}
          >
            <ThemedText
              type="heading"
              style={[styles.cardTitle, { color: colors.text as any }]}
            >
              Productivity Tools
            </ThemedText>
            <ThemedText
              style={{
                fontSize: Typography.sizes.sm,
                color: colors.textMuted as any,
                lineHeight: 20,
                marginBottom: Spacing.md,
              }}
            >
              Essential tools to help you stay organized and productive during
              your journey in Germany.
            </ThemedText>

            <View
              style={[
                List.item,
                List.itemWithBorderLeft,
                {
                  backgroundColor: colors.card + "0D",
                  borderLeftColor: colors.primary,
                },
              ]}
            >
              <View style={List.iconContainer}>
                <IconSymbol
                  name="doc.text.fill"
                  size={20}
                  color={colors.primary}
                />
              </View>
              <View style={styles.toolText}>
                <ThemedText
                  style={[styles.toolTitle, { color: colors.text as any }]}
                >
                  Document Manager
                </ThemedText>
                <ThemedText style={{ color: colors.textMuted as any }}>
                  Store and manage important documents like visas, contracts,
                  and certificates.
                </ThemedText>
              </View>
            </View>

            <View
              style={[
                List.item,
                List.itemWithBorderLeft,
                {
                  backgroundColor: colors.card + "0D",
                  borderLeftColor: colors.primary,
                },
              ]}
            >
              <View style={List.iconContainer}>
                <IconSymbol name="bell.fill" size={20} color={colors.primary} />
              </View>
              <View style={styles.toolText}>
                <ThemedText
                  style={[styles.toolTitle, { color: colors.text as any }]}
                >
                  Reminder System
                </ThemedText>
                <ThemedText style={{ color: colors.textMuted as any }}>
                  Set reminders for appointments, deadlines, and important
                  tasks.
                </ThemedText>
              </View>
            </View>

            <View
              style={[
                List.item,
                List.itemWithBorderLeft,
                {
                  backgroundColor: colors.card + "0D",
                  borderLeftColor: colors.primary,
                },
              ]}
            >
              <View style={List.iconContainer}>
                <IconSymbol
                  name="checkmark.square.fill"
                  size={20}
                  color={colors.primary}
                />
              </View>
              <View style={styles.toolText}>
                <ThemedText
                  style={[styles.toolTitle, { color: colors.text as any }]}
                >
                  Checklist Tracker
                </ThemedText>
                <ThemedText style={{ color: colors.textMuted as any }}>
                  Track your progress through immigration and integration
                  checklists.
                </ThemedText>
              </View>
            </View>
          </ThemedView>

          {/* Document Manager */}
          <ThemedView
            style={[
              Card.glass,
              {
                backgroundColor: colors.card as any,
                borderColor: colors.border as any,
              },
            ]}
          >
            <ThemedText
              type="heading"
              style={[styles.cardTitle, { color: colors.text as any }]}
            >
              Quick Document Add
            </ThemedText>

            <TextInput
              style={[Input.search, { color: colors.text }]}
              placeholder="Document title..."
              placeholderTextColor={colors.textMuted}
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <TouchableOpacity
              style={[Button.base, { backgroundColor: colors.primary }]}
              onPress={handleAddDocument}
              disabled={saving}
            >
              <ThemedText style={[styles.buttonText, { color: colors.text }]}>
                {saving ? "Saving..." : "Add Document"}
              </ThemedText>
            </TouchableOpacity>

            {docs.slice(0, 3).map((doc) => (
              <View
                key={doc.id}
                style={[
                  styles.documentItem,
                  { backgroundColor: colors.card + "0D" },
                ]}
              >
                <ThemedText style={{ color: colors.text as any, flex: 1 }}>
                  {doc.title}
                </ThemedText>
                <TouchableOpacity onPress={() => handleRemoveDocument(doc.id)}>
                  <IconSymbol
                    name="trash.fill"
                    size={16}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </ThemedView>

          {/* Reminder System */}
          <ThemedView
            style={[
              Card.glass,
              {
                backgroundColor: colors.card as any,
                borderColor: colors.border as any,
              },
            ]}
          >
            <ThemedText
              type="heading"
              style={[styles.cardTitle, { color: colors.text as any }]}
            >
              Quick Reminder
            </ThemedText>

            <TextInput
              style={[Input.search, { color: colors.text }]}
              placeholder="Reminder title..."
              placeholderTextColor={colors.textMuted}
              value={reminderTitle}
              onChangeText={setReminderTitle}
            />

            <TextInput
              style={[Input.search, { color: colors.text }]}
              placeholder="Minutes from now..."
              placeholderTextColor={colors.textMuted}
              value={reminderMinutes}
              onChangeText={setReminderMinutes}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={[Button.base, { backgroundColor: colors.primary }]}
              onPress={handleScheduleReminder}
              disabled={scheduling}
            >
              <ThemedText style={[styles.buttonText, { color: colors.text }]}>
                {scheduling ? "Scheduling..." : "Set Reminder"}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

ToolsScreen.options = {
  title: "Tools",
};
