import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { Card } from "../../components/ui/Card";
import { PageHeader } from "../../components/ui/PageHeader";
import { ListItem } from "../../components/ui/ListItem";
import { Screen } from "../../components/ui/Screen";
import { Button } from "../../components/ui/Button";
import { Chevron } from "../../components/ui/Chevron";

export default function LearnTab() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <Screen>
      <PageHeader
        title="Learning"
        subtitle="Vocabulary, flashcards, practice, and exams"
      />

      <Card>
        <Text style={[styles.kpiTitle, { color: palette.textPrimary }]}>
          Progress
        </Text>
        <Text style={[styles.kpiSub, { color: palette.textSecondary }]}>
          Connect this to backend stats later (`GET /api/stats`).
        </Text>
        <View style={{ height: Spacing.md }} />
        <Text style={[styles.kpiValue, { color: palette.primary }]}>0%</Text>
        <View style={{ height: Spacing.md }} />
        <Button
          title="Open Learn Hub"
          variant="secondary"
          onPress={() => router.push("/learn" as any)}
        />
      </Card>

      <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>
        Modules
      </Text>

      <ListItem
        title="Vocabulary"
        subtitle="Browse words by level and category"
        onPress={() => router.push("/learn/vocabulary" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="Flashcards"
        subtitle="Spaced repetition reviews"
        onPress={() => router.push("/learn/flashcards" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="Practice"
        subtitle="Multiple-choice, translation, fill-in"
        onPress={() => router.push("/learn/practice" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="Survival Phrases"
        subtitle="Everyday German with Persian/English"
        onPress={() => router.push("/learn/phrases" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="Exams"
        subtitle="Mock tests and assessments"
        onPress={() => router.push("/learn/exams" as any)}
        right={<Chevron />}
      />

      <View style={{ height: Spacing.lg }} />

      <Card>
        <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>
          Tip
        </Text>
        <Text style={[styles.tip, { color: palette.textSecondary }]}>
          Focus on survival phrases first. They help in appointments, housing,
          and daily tasks.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kpiTitle: {
    fontSize: Typography.sizes.headingM,
    fontWeight: Typography.fontWeight.bold,
  },
  kpiSub: {
    marginTop: Spacing.xs,
    fontSize: Typography.sizes.bodySecondary,
    lineHeight: 22,
  },
  kpiValue: {
    fontSize: 32,
    fontWeight: Typography.fontWeight.bold,
  },
  sectionTitle: {
    fontSize: Typography.sizes.headingM,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.sm,
  },
  tip: {
    fontSize: Typography.sizes.bodySecondary,
    lineHeight: 22,
  },
});
