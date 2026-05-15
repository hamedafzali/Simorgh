import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { PageHeader } from "../../components/ui/PageHeader";
import { Screen } from "../../components/ui/Screen";
import { ListItem } from "../../components/ui/ListItem";
import { Chevron } from "../../components/ui/Chevron";
import { documentGuides, germanyJobs } from "../../services/germany-data";
import { usePreferences } from "../../contexts/PreferencesContext";
import FeatureGate from "../../components/FeatureGate";

// Translate function
const translate = async (text: string, from = "en", to = "de") => {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    text,
  )}&langpair=${from}|${to}`;

  const res = await fetch(url);
  const data = await res.json();

  return data.responseData.translatedText;
};

type JobTranslation = {
  title: string;
  subtitle: string;
};

export default function JobsTab() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { language } = usePreferences();
  const [jobTranslations, setJobTranslations] = useState<
    Record<string, JobTranslation>
  >({});
  const [translatingJobIds, setTranslatingJobIds] = useState<
    Record<string, true>
  >({});

  const translateJob = async (job: (typeof germanyJobs)[number]) => {
    if (language !== "fa") return;
    if (translatingJobIds[job.id]) return;

    setTranslatingJobIds((prev) => ({ ...prev, [job.id]: true }));
    try {
      const translatedTitle = await translate(job.title, "en", "fa");
      const originalSubtitle = `${job.company} · ${job.city} · ${job.type} · ${job.level}`;
      const translatedSubtitle = await translate(originalSubtitle, "en", "fa");

      setJobTranslations((prev) => ({
        ...prev,
        [job.id]: {
          title: translatedTitle,
          subtitle: translatedSubtitle,
        },
      }));
    } finally {
      setTranslatingJobIds((prev) => {
        const next = { ...prev };
        delete next[job.id];
        return next;
      });
    }
  };

  return (
    <FeatureGate feature="jobs" title="Jobs" subtitle="Find opportunities in Germany">
      <Screen>
      <PageHeader
        title="Jobs"
        subtitle="Find opportunities in Germany"
        showBack={true}
        onBackPress={() => router.push("/(tabs)" as any)}
      />

      <Card>
        <Text
          style={{
            fontSize: Typography.sizes.bodySecondary,
            color: palette.textSecondary,
            lineHeight: 22,
          }}
        >
          Germany-focused opportunities and job tools for newcomers.
        </Text>
        <View style={{ height: Spacing.md }} />
        <Button title="Refresh list" onPress={() => {}} />
        <View style={{ height: Spacing.sm }} />
        <Button title="Create alert" variant="secondary" onPress={() => {}} />
      </Card>

      {germanyJobs.map((job) =>
        (() => {
          const translated = jobTranslations[job.id];
          const title = translated?.title ?? job.title;
          const subtitle =
            translated?.subtitle ??
            `${job.company} · ${job.city} · ${job.type} · ${job.level}`;
          const isTranslating = !!translatingJobIds[job.id];

          return (
            <ListItem
              key={job.id}
              title={title}
              subtitle={subtitle}
              onPress={() => router.push(`/job/${job.id}` as any)}
              right={
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {language === "fa" ? (
                    <Pressable
                      onPress={(e: any) => {
                        e?.stopPropagation?.();
                        void translateJob(job);
                      }}
                      style={({ pressed }) => ({
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: palette.borderLight,
                        backgroundColor: palette.surface,
                        opacity: pressed ? 0.78 : 1,
                        marginRight: Spacing.sm,
                      })}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: palette.textPrimary,
                          fontWeight: "600",
                        }}
                      >
                        {isTranslating ? "..." : "ترجمه"}
                      </Text>
                    </Pressable>
                  ) : null}
                  <Chevron />
                </View>
              }
            />
          );
        })(),
      )}

      <Card>
        <Text
          style={{
            fontSize: Typography.sizes.headingM,
            fontWeight: Typography.fontWeight.bold,
            color: palette.textPrimary,
            marginBottom: Spacing.sm,
          }}
        >
          CV & Applications
        </Text>
        <Text
          style={{
            fontSize: Typography.sizes.bodySecondary,
            color: palette.textSecondary,
            lineHeight: 22,
          }}
        >
          Create a German-style application pack. Start with these guides:
        </Text>
        <View style={{ height: Spacing.sm }} />
        {documentGuides
          .filter((g) => g.category === "Work & Jobcenter")
          .map((guide) => (
            <ListItem
              key={guide.id}
              title={guide.title}
              subtitle={guide.summary}
              onPress={() => router.push(`/document/${guide.id}` as any)}
              right={<Chevron />}
            />
          ))}
      </Card>
      </Screen>
    </FeatureGate>
  );
}
