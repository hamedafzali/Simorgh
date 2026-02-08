import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { PageHeader } from "../../components/ui/PageHeader";
import { ListItem } from "../../components/ui/ListItem";
import { Screen } from "../../components/ui/Screen";
import { Button } from "../../components/ui/Button";
import { Chevron } from "../../components/ui/Chevron";
import { StatCard } from "../../components/ui/StatCard";
import { useDatabase } from "../../contexts/DatabaseContext";
import learningService, { LearningStats } from "../../services/learningService";

export default function LearnTab() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { isInitialized } = useDatabase();
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!isInitialized) return;
      setIsLoading(true);
      try {
        const next = await learningService.getUserStats();
        if (mounted) setStats(next);
      } catch {
        if (mounted) setStats(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [isInitialized]);

  const progress =
    stats && stats.totalWords > 0
      ? Math.round((stats.masteredWords / stats.totalWords) * 100)
      : 0;

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
          Your offline progress from the local database.
        </Text>
        <View style={{ height: Spacing.md }} />
        <Text style={[styles.kpiValue, { color: palette.primary }]}>
          {isLoading ? "…" : `${progress}%`}
        </Text>
        {stats ? (
          <>
            <View style={{ height: Spacing.md }} />
            <View style={styles.statsRow}>
              <StatCard
                label="Accuracy"
                value={`${stats.accuracy}%`}
                icon="check"
              />
              <StatCard
                label="Streak"
                value={`${stats.streakDays} days`}
                icon="zap"
              />
            </View>
            <View style={{ height: Spacing.sm }} />
            <View style={styles.statsRow}>
              <StatCard
                label="Reviews"
                value={`${stats.totalReviews}`}
                icon="repeat"
              />
              <StatCard
                label="Level"
                value={stats.currentLevel}
                icon="award"
              />
            </View>
          </>
        ) : null}
        <View style={{ height: Spacing.md }} />
        <Button
          title="Open Learn Hub"
          variant="secondary"
          onPress={() => router.push("/learn" as any)}
        />
      </Card>

      {!isLoading && stats?.totalWords === 0 ? (
        <Card>
          <EmptyState
            message="No learning data yet. Sync to download the word list."
            action={{
              title: "Open Sync",
              onPress: () => router.push("/(tabs)/sync" as any),
            }}
          />
        </Card>
      ) : null}

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
  statsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  tip: {
    fontSize: Typography.sizes.bodySecondary,
    lineHeight: 22,
  },
});
