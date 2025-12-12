import { StyleSheet, View } from "react-native";

import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { ModernCard } from "@/components/ui/modern-card";
import { ProgressBar } from "@/components/progress-bar";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppState } from "@/store/appState";

export default function HomeScreenWeb() {
  const { t } = useTranslation();
  const { learnSummary, jobFavorites, jobInterested } = useAppState();
  const router = useRouter();
  const theme = useColorScheme() ?? "light";

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{t("home.title")}</ThemedText>
      <ThemedText type="subtitle">{t("home.subtitle")}</ThemedText>
      <ModernCard title="Your progress" style={styles.summaryCard}>
        <ThemedView style={styles.cardRow}>
          <IconSymbol
            name="house.fill"
            size={22}
            color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
          />
          <ThemedView style={styles.cardColumn}>
            <ThemedText>
              Learn: {learnSummary?.totalReviews ?? 0} reviews ·{" "}
              {learnSummary?.streakDays ?? 0}-day streak
            </ThemedText>
            <ProgressBar
              value={
                learnSummary && learnSummary.totalReviews > 0
                  ? Math.min(1, (learnSummary.streakDays || 0) / 7)
                  : 0
              }
              style={{ marginTop: 4, marginBottom: 4 }}
            />
            <ThemedText>
              Jobs: {jobFavorites} favorites · {jobInterested} interested
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ModernCard>

      <View style={styles.grid}>
        <ModernCard
          title={t("home.localInfoTitle")}
          onPress={() => router.push("/local-info")}
        >
          <ThemedView style={styles.cardRow}>
            <IconSymbol
              name="info.circle.fill"
              size={22}
              color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
            />
            <ThemedText>{t("home.localInfoDesc")}</ThemedText>
          </ThemedView>
        </ModernCard>

        <ModernCard
          title={t("home.learningTitle")}
          onPress={() => router.push("/(tabs)/learn")}
        >
          <ThemedView style={styles.cardRow}>
            <IconSymbol
              name="book.fill"
              size={22}
              color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
            />
            <ThemedText>{t("home.learningDesc")}</ThemedText>
          </ThemedView>
        </ModernCard>

        <ModernCard
          title={t("home.communityTitle")}
          onPress={() => router.push("/(tabs)/community")}
        >
          <ThemedView style={styles.cardRow}>
            <IconSymbol
              name="person.2.fill"
              size={22}
              color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
            />
            <ThemedText>{t("home.communityDesc")}</ThemedText>
          </ThemedView>
        </ModernCard>

        <ModernCard
          title={t("home.jobsTitle")}
          onPress={() => router.push("/jobs")}
        >
          <ThemedView style={styles.cardRow}>
            <IconSymbol
              name="briefcase.fill"
              size={22}
              color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
            />
            <ThemedText>{t("home.jobsDesc")}</ThemedText>
          </ThemedView>
        </ModernCard>

        <ModernCard
          title={t("home.toolsTitle")}
          onPress={() => router.push("/(tabs)/tools")}
        >
          <ThemedView style={styles.cardRow}>
            <IconSymbol
              name="wrench.fill"
              size={22}
              color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
            />
            <ThemedText>{t("home.toolsDesc")}</ThemedText>
          </ThemedView>
        </ModernCard>

        <ModernCard
          title={t("home.wellbeingTitle")}
          onPress={() => router.push("/wellbeing")}
        >
          <ThemedView style={styles.cardRow}>
            <IconSymbol
              name="heart.fill"
              size={22}
              color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
            />
            <ThemedText>{t("home.wellbeingDesc")}</ThemedText>
          </ThemedView>
        </ModernCard>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  summaryCard: {
    width: "100%",
    maxWidth: 900,
  },
  grid: {
    marginTop: 16,
    width: "100%",
    maxWidth: 900,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardColumn: {
    flex: 1,
    gap: 4,
  },
});
