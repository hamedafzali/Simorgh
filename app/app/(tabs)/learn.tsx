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
import { usePreferences } from "../../contexts/PreferencesContext";
import { t } from "../../services/i18n";
import FeatureGate from "../../components/FeatureGate";

export default function LearnTab() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { language } = usePreferences();
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
    <FeatureGate
      feature="learning"
      title={t(language, "learn.title")}
      subtitle={t(language, "learn.subtitle")}
    >
      <Screen>
      <PageHeader
        title={t(language, "learn.title")}
        subtitle={t(language, "learn.subtitle")}
      />

      <Card>
        <Text style={[styles.kpiTitle, { color: palette.textPrimary }]}>
          {t(language, "learn.progress")}
        </Text>
        <Text style={[styles.kpiSub, { color: palette.textSecondary }]}>
          {t(language, "learn.progressSub")}
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
                label={t(language, "learn.accuracy")}
                value={`${stats.accuracy}%`}
                icon="check"
              />
              <StatCard
                label={t(language, "learn.streak")}
                value={`${stats.streakDays} ${t(language, "learn.days")}`}
                icon="zap"
              />
            </View>
            <View style={{ height: Spacing.sm }} />
            <View style={styles.statsRow}>
              <StatCard
                label={t(language, "learn.reviews")}
                value={`${stats.totalReviews}`}
                icon="repeat"
              />
              <StatCard
                label={t(language, "learn.level")}
                value={stats.currentLevel}
                icon="award"
              />
            </View>
          </>
        ) : null}
        <View style={{ height: Spacing.md }} />
        <Button
          title={t(language, "learn.openHub")}
          variant="secondary"
          onPress={() => router.push("/learn" as any)}
        />
      </Card>

      {!isLoading && stats?.totalWords === 0 ? (
        <Card>
          <EmptyState
            message={t(language, "learn.empty")}
            action={{
              title: t(language, "learn.openSync"),
              onPress: () => router.push("/(tabs)/sync" as any),
            }}
          />
        </Card>
      ) : null}

      <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>
        {t(language, "learn.modules")}
      </Text>

      <ListItem
        title={t(language, "learn.vocabulary")}
        subtitle={t(language, "learn.vocabularySub")}
        onPress={() => router.push("/learn/vocabulary" as any)}
        right={<Chevron />}
      />
      <ListItem
        title={t(language, "learn.flashcards")}
        subtitle={t(language, "learn.flashcardsSub")}
        onPress={() => router.push("/learn/flashcards" as any)}
        right={<Chevron />}
      />
      <ListItem
        title={t(language, "learn.practice")}
        subtitle={t(language, "learn.practiceSub")}
        onPress={() => router.push("/learn/practice" as any)}
        right={<Chevron />}
      />
      <ListItem
        title={t(language, "learn.phrases")}
        subtitle={t(language, "learn.phrasesSub")}
        onPress={() => router.push("/learn/phrases" as any)}
        right={<Chevron />}
      />
      <ListItem
        title={t(language, "learn.exams")}
        subtitle={t(language, "learn.examsSub")}
        onPress={() => router.push("/learn/exams" as any)}
        right={<Chevron />}
      />

      <View style={{ height: Spacing.lg }} />

      <Card>
        <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>
          {t(language, "learn.focusTip")}
        </Text>
        <Text style={[styles.tip, { color: palette.textSecondary }]}>
          {t(language, "learn.focusTipBody")}
        </Text>
      </Card>
      </Screen>
    </FeatureGate>
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
