import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Animated,
  Linking,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ModernButton } from "@/components/ui/modern-button";
import { ModernCard } from "@/components/ui/modern-card";
import PageHeader from "@/components/ui/page-header";
import { Layout } from "@/constants/common-styles";
import { Spacing, Typography } from "@/constants/theme";
import { getJobById, type Job } from "@/services/jobs";

export default function JobDetailScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  useEffect(() => {
    const loadJob = async () => {
      if (!id) return;

      try {
        const jobData = await getJobById(String(id));
        setJob(jobData || null);

        // Fade in animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.warn("Job load error", error);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id, fadeAnim]);

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChanged = () => {
      forceUpdate();
    };

    i18n.on("languageChanged", handleLanguageChanged);

    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, [i18n, forceUpdate]);

  if (loading) {
    return (
      <View style={Layout.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      </View>
    );
  }

  if (!job) {
    return (
      <View style={Layout.container} key={i18n.language}>
        <ThemedText
          style={{ textAlign: "center", color: "rgba(255,255,255,0.5)" }}
        >
          {t("jobs.jobNotFound")}
        </ThemedText>
      </View>
    );
  }

  const localized =
    job.localized[i18n.language as keyof typeof job.localized] ||
    job.localized.en;

  const handleApply = () => {
    if (job.applyUrl) {
      Linking.openURL(job.applyUrl);
    }
  };

  return (
    <View style={Layout.container} key={i18n.language}>
      {/* Page Header */}
      <PageHeader
        title={t("jobs.jobDetails")}
        showBackButton={true}
        onBackPress={() => router.back()}
        height="medium"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[{ opacity: fadeAnim }]}>
          <ModernCard variant="glass" size="md">
            <ThemedText style={styles.jobTitle}>{localized.title}</ThemedText>
            <ThemedText style={styles.company}>{localized.company}</ThemedText>
            <ThemedText style={styles.location}>
              {localized.locationText}
            </ThemedText>

            <View style={styles.jobMeta}>
              <View style={styles.metaItem}>
                <ThemedText style={styles.metaText}>{job.jobType}</ThemedText>
              </View>
              <View style={styles.metaItem}>
                <ThemedText style={styles.metaText}>
                  {job.skillLevel}
                </ThemedText>
              </View>
              <View style={styles.metaItem}>
                <ThemedText style={styles.metaText}>
                  {job.germanLevel}
                </ThemedText>
              </View>
            </View>
          </ModernCard>

          <ModernCard variant="glass" size="md">
            <ThemedText style={styles.sectionTitle}>
              {t("jobs.description")}
            </ThemedText>
            <ThemedText style={styles.description}>
              {localized.description}
            </ThemedText>

            {localized.requirements && localized.requirements.length > 0 && (
              <>
                <ThemedText style={styles.sectionTitle}>
                  {t("jobs.requirements")}
                </ThemedText>
                <View style={styles.requirementsList}>
                  {localized.requirements.map((requirement, index) => (
                    <ThemedText key={index} style={styles.requirementItem}>
                      • {requirement}
                    </ThemedText>
                  ))}
                </View>
              </>
            )}

            <ModernButton
              title={t("jobs.applyNow")}
              variant="primary"
              size="md"
              onPress={handleApply}
              fullWidth
            />
          </ModernCard>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 100, // Reduced for modern header
    paddingBottom: Spacing.xl,
  },
  jobTitle: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.bold,
    color: "#FFFFFF",
    marginBottom: Spacing.sm,
  },
  company: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: "#3B82F6",
    marginBottom: Spacing.xs,
  },
  location: {
    fontSize: Typography.sizes.base,
    color: "rgba(255,255,255,0.7)",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: "#FFFFFF",
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  description: {
    fontSize: Typography.sizes.base,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  requirementsList: {
    marginBottom: Spacing.md,
  },
  requirementItem: {
    fontSize: Typography.sizes.base,
    color: "rgba(255,255,255,0.8)",
    marginBottom: Spacing.xs,
    paddingLeft: Spacing.md,
  },
  jobMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  metaItem: {
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    borderRadius: 8,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  metaText: {
    color: "#3B82F6",
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
