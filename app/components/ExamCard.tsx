import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "./themed-text";
import { IconSymbol } from "./ui/icon-symbol";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/theme-context";
import { Exam } from "@/services/learningService";

interface ExamCardProps {
  exam: Exam;
  onStart: (examId: string) => void;
}

export function ExamCard({ exam, onStart }: ExamCardProps) {
  const { colors } = useTheme();

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "A1":
        return "#10B981";
      case "A2":
        return "#3B82F6";
      case "B1":
        return "#8B5CF6";
      case "B2":
        return "#F59E0B";
      case "C1":
        return "#EF4444";
      case "C2":
        return "#DC2626";
      default:
        return "#6B7280";
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <ThemedText style={styles.title}>{exam.title}</ThemedText>
          <View
            style={[
              styles.levelBadge,
              { backgroundColor: getDifficultyColor(exam.level) },
            ]}
          >
            <ThemedText style={styles.levelText}>{exam.level}</ThemedText>
          </View>
        </View>
        <IconSymbol
          name="doc.text.fill"
          size={24}
          color={getDifficultyColor(exam.level)}
        />
      </View>

      <ThemedText style={[styles.description, { color: colors.text }]}>
        {exam.description}
      </ThemedText>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <IconSymbol name="clock.fill" size={16} color={colors.textMuted} />
          <ThemedText style={[styles.statText, { color: colors.textMuted }]}>
            {exam.duration} min
          </ThemedText>
        </View>
        <View style={styles.stat}>
          <IconSymbol
            name="questionmark.circle.fill"
            size={16}
            color={colors.textMuted}
          />
          <ThemedText style={[styles.statText, { color: colors.textMuted }]}>
            {exam.questionCount} questions
          </ThemedText>
        </View>
        <View style={styles.stat}>
          <IconSymbol name="target" size={16} color={colors.textMuted} />
          <ThemedText style={[styles.statText, { color: colors.textMuted }]}>
            {exam.passingScore}% to pass
          </ThemedText>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.startButton, { backgroundColor: colors.primary }]}
        onPress={() => onStart(exam.id)}
      >
        <ThemedText style={styles.startButtonText}>Start Exam</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  titleSection: {
    flex: 1,
    marginRight: Spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  levelText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  description: {
    fontSize: 14,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
  },
  startButton: {
    borderRadius: 12,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
