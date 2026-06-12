import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { BorderRadius, Colors, Spacing, Typography } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { Card } from "../../components/ui/Card";
import { PageHeader } from "../../components/ui/PageHeader";
import { Screen } from "../../components/ui/Screen";
import { ListItem } from "../../components/ui/ListItem";
import { Chevron } from "../../components/ui/Chevron";
import { Button } from "../../components/ui/Button";
import { documentGuides } from "../../services/germany-data";
import { searchJobs, type LiveJob } from "../../services/jobs";
import { track } from "../../services/analytics";
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

  const [what, setWhat] = useState("");
  const [where, setWhere] = useState("");
  const [jobs, setJobs] = useState<LiveJob[]>([]);
  const [total, setTotal] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);
  const [error, setError] = useState("");

  const [jobTranslations, setJobTranslations] = useState<
    Record<string, JobTranslation>
  >({});
  const [translatingJobIds, setTranslatingJobIds] = useState<
    Record<string, true>
  >({});

  const runSearch = useCallback(async (whatQ: string, whereQ: string) => {
    setLoading(true);
    setError("");
    try {
      const result = await searchJobs(whatQ, whereQ);
      setJobs(result.jobs);
      setTotal(result.total);
      setFromCache(result.fromCache);
      void track("jobs_searched", {
        hasQuery: !!(whatQ.trim() || whereQ.trim()),
        results: result.jobs.length,
      });
    } catch {
      setJobs([]);
      setTotal(undefined);
      setError(
        language === "fa"
          ? "جست‌وجوی مشاغل در دسترس نیست. اتصال اینترنت را بررسی کنید."
          : "Job search is unavailable right now. Check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    void runSearch("", "");
  }, [runSearch]);

  const openJob = (job: LiveJob) => {
    void track("job_opened", { city: job.city });
    void Linking.openURL(job.externalUrl);
  };

  const translateJob = async (job: LiveJob) => {
    if (language !== "fa") return;
    if (translatingJobIds[job.id]) return;

    setTranslatingJobIds((prev) => ({ ...prev, [job.id]: true }));
    try {
      const translatedTitle = await translate(job.title, "de", "fa");
      const originalSubtitle = `${job.company} · ${job.city}`;
      const translatedSubtitle = await translate(originalSubtitle, "de", "fa");

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

  const inputStyle = {
    flex: 1,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: palette.borderLight,
    backgroundColor: palette.surface,
    color: palette.textPrimary,
    fontSize: Typography.sizes.bodySecondary,
  } as const;

  return (
    <FeatureGate feature="jobs" title="Jobs" subtitle="Find opportunities in Germany">
      <Screen>
      <PageHeader
        title="Jobs"
        subtitle="Live listings from the Federal Employment Agency"
        showBack={true}
        onBackPress={() => router.push("/(tabs)" as any)}
      />

      <Card>
        <View style={{ flexDirection: "row", marginBottom: Spacing.sm }}>
          <TextInput
            value={what}
            onChangeText={setWhat}
            placeholder={language === "fa" ? "شغل (مثلاً Pflege)" : "Job (e.g. Pflege, Software)"}
            placeholderTextColor={palette.textMuted}
            style={inputStyle}
            returnKeyType="search"
            onSubmitEditing={() => void runSearch(what, where)}
          />
          <View style={{ width: Spacing.sm }} />
          <TextInput
            value={where}
            onChangeText={setWhere}
            placeholder={language === "fa" ? "شهر" : "City"}
            placeholderTextColor={palette.textMuted}
            style={inputStyle}
            returnKeyType="search"
            onSubmitEditing={() => void runSearch(what, where)}
          />
        </View>
        <Button
          title={language === "fa" ? "جست‌وجو" : "Search"}
          onPress={() => void runSearch(what, where)}
          disabled={loading}
        />
        {typeof total === "number" && !loading ? (
          <Text
            style={{
              marginTop: Spacing.sm,
              fontSize: Typography.sizes.caption,
              color: palette.textMuted,
            }}
          >
            {total.toLocaleString()} {language === "fa" ? "آگهی یافت شد" : "listings found"}
            {fromCache ? (language === "fa" ? " (آفلاین)" : " (offline)") : ""}
          </Text>
        ) : null}
      </Card>

      {loading ? (
        <Card>
          <ActivityIndicator color={palette.primary} />
        </Card>
      ) : null}

      {error ? (
        <Card>
          <Text
            style={{
              fontSize: Typography.sizes.bodySecondary,
              color: palette.textSecondary,
              lineHeight: 22,
            }}
          >
            {error}
          </Text>
        </Card>
      ) : null}

      {jobs.map((job) => {
        const translated = jobTranslations[job.id];
        const title = translated?.title ?? job.title;
        const subtitle =
          translated?.subtitle ?? `${job.company} · ${job.city}`;
        const isTranslating = !!translatingJobIds[job.id];

        return (
          <ListItem
            key={job.id}
            title={title}
            subtitle={subtitle}
            onPress={() => openJob(job)}
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
      })}

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
