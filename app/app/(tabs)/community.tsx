import React from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { Card } from "../../components/ui/Card";
import { Header } from "../../components/ui/Header";
import { ListItem } from "../../components/ui/ListItem";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { Screen } from "../../components/ui/Screen";
import { Chevron } from "../../components/ui/Chevron";
import { usePreferences } from "../../contexts/PreferencesContext";
import { t } from "../../services/i18n";
import { useFeatureFlags } from "../../contexts/FeatureFlagsContext";
import FeatureGate from "../../components/FeatureGate";

export default function CommunityTab() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { language } = usePreferences();
  const { featureFlags } = useFeatureFlags();

  return (
    <FeatureGate
      feature="community"
      title={t(language, "community.title")}
      subtitle={t(language, "community.subtitle")}
    >
      <Screen>
      <Header
        title={t(language, "community.title")}
        subtitle={t(language, "community.subtitle")}
      />

      <Card>
        <Text
          style={{
            fontSize: Typography.sizes.bodySecondary,
            color: palette.textSecondary,
            lineHeight: 22,
          }}
        >
          {t(language, "community.intro")}
        </Text>
      </Card>

      {featureFlags.community ? (
        <>
      <SectionHeader
        title={t(language, "community.essentials")}
        subtitle={t(language, "community.essentialsSub")}
      />
      {featureFlags.countries ? (
      <ListItem
        title={t(language, "community.countries")}
        subtitle={t(language, "community.countriesSub")}
        onPress={() => router.push("/countries" as any)}
        right={<Chevron />}
      />
      ) : null}
      {featureFlags.checklist ? (
      <ListItem
        title={t(language, "community.checklist")}
        subtitle={t(language, "community.checklistSub")}
        onPress={() => router.push("/checklist" as any)}
        right={<Chevron />}
      />
      ) : null}
      {featureFlags.deadlines ? (
      <ListItem
        title={t(language, "community.deadlines")}
        subtitle={t(language, "community.deadlinesSub")}
        onPress={() => router.push("/deadlines" as any)}
        right={<Chevron />}
      />
      ) : null}
      {featureFlags.documents ? (
      <ListItem
        title={t(language, "community.documentsTracker")}
        subtitle={t(language, "community.documentsTrackerSub")}
        onPress={() => router.push("/documents-tracker" as any)}
        right={<Chevron />}
      />
      ) : null}
      {featureFlags.forms ? (
      <ListItem
        title={t(language, "community.formHelper")}
        subtitle={t(language, "community.formHelperSub")}
        onPress={() => router.push("/forms" as any)}
        right={<Chevron />}
      />
      ) : null}
      {featureFlags.emergency ? (
      <ListItem
        title={t(language, "community.emergencyKit")}
        subtitle={t(language, "community.emergencyKitSub")}
        onPress={() => router.push("/emergency" as any)}
        right={<Chevron />}
      />
      ) : null}
      {featureFlags.phrasebook ? (
      <ListItem
        title={t(language, "community.phrasebook")}
        subtitle={t(language, "community.phrasebookSub")}
        onPress={() => router.push("/phrasebook" as any)}
        right={<Chevron />}
      />
      ) : null}

      {featureFlags.guides || featureFlags.timeline || featureFlags.services || featureFlags.reminders || featureFlags.housing || featureFlags.tax || featureFlags.school ? (
        <>
      <SectionHeader
        title={t(language, "community.residency")}
        subtitle={t(language, "community.residencySub")}
      />
      {featureFlags.guides ? (
      <ListItem
        title={t(language, "community.guides")}
        subtitle={t(language, "community.guidesSub")}
        onPress={() => router.push("/guides" as any)}
        right={<Chevron />}
      />
      ) : null}
      {featureFlags.timeline ? (
      <ListItem
        title={t(language, "community.timeline")}
        subtitle={t(language, "community.timelineSub")}
        onPress={() => router.push("/timeline" as any)}
        right={<Chevron />}
      />
      ) : null}
      {featureFlags.services ? (
      <ListItem
        title={t(language, "community.services")}
        subtitle={t(language, "community.servicesSub")}
        onPress={() => router.push("/services" as any)}
        right={<Chevron />}
      />
      ) : null}
      {featureFlags.reminders ? (
      <ListItem
        title={t(language, "community.reminders")}
        subtitle={t(language, "community.remindersSub")}
        onPress={() => router.push("/residency-reminders" as any)}
        right={<Chevron />}
      />
      ) : null}
      {featureFlags.housing ? (
      <ListItem
        title={t(language, "community.housing")}
        subtitle={t(language, "community.housingSub")}
        onPress={() => router.push("/housing-safety" as any)}
        right={<Chevron />}
      />
      ) : null}
      {featureFlags.tax ? (
      <ListItem
        title={t(language, "community.tax")}
        subtitle={t(language, "community.taxSub")}
        onPress={() => router.push("/tax" as any)}
        right={<Chevron />}
      />
      ) : null}
      {featureFlags.school ? (
      <ListItem
        title={t(language, "community.school")}
        subtitle={t(language, "community.schoolSub")}
        onPress={() => router.push("/school" as any)}
        right={<Chevron />}
      />
      ) : null}
        </>
      ) : null}

      {featureFlags.support ? (
        <>
      <SectionHeader
        title={t(language, "community.support")}
        subtitle={t(language, "community.supportSub")}
      />
      <ListItem
        title={t(language, "community.supportResources")}
        subtitle={t(language, "community.supportResourcesSub")}
        onPress={() => router.push("/support" as any)}
        right={<Chevron />}
      />
        </>
      ) : null}

      {featureFlags.locations || featureFlags.events || featureFlags.chat || featureFlags.documents ? (
        <>
      <SectionHeader
        title={t(language, "community.community")}
        subtitle={t(language, "community.communitySub")}
      />
      {featureFlags.locations ? (
      <ListItem
        title={t(language, "community.locations")}
        subtitle={t(language, "community.locationsSub")}
        onPress={() => router.push("/locations" as any)}
        right={<Chevron />}
      />
      ) : null}
      {featureFlags.events ? (
      <ListItem
        title={t(language, "community.events")}
        subtitle={t(language, "community.eventsSub")}
        onPress={() => router.push("/events" as any)}
        right={<Chevron />}
      />
      ) : null}
      {featureFlags.chat ? (
      <ListItem
        title={t(language, "community.chat")}
        subtitle={t(language, "community.chatSub")}
        onPress={() => router.push("/chat" as any)}
        right={<Chevron />}
      />
      ) : null}
      {featureFlags.documents ? (
      <ListItem
        title={t(language, "community.documents")}
        subtitle={t(language, "community.documentsSub")}
        onPress={() => router.push("/documents" as any)}
        right={<Chevron />}
      />
      ) : null}
      <ListItem
        title={t(language, "community.faq")}
        subtitle={t(language, "community.faqSub")}
        onPress={() => router.push("/faq" as any)}
        right={<Chevron />}
      />
        </>
      ) : null}
        </>
      ) : (
        <Card>
          <Text
            style={{
              fontSize: Typography.sizes.bodySecondary,
              color: palette.textSecondary,
              lineHeight: 22,
            }}
          >
            Community features are currently disabled for this release.
          </Text>
        </Card>
      )}
      <View style={{ height: Spacing.lg }} />
      </Screen>
    </FeatureGate>
  );
}
