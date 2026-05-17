import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, Typography } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { ListItem } from "../components/ui/ListItem";
import FeatureGate from "../components/FeatureGate";
import { Screen } from "../components/ui/Screen";
import { Chevron } from "../components/ui/Chevron";
import { germanyGuides } from "../services/germany-data";
import { usePreferences } from "../contexts/PreferencesContext";
import { fa } from "../services/l10n";

export default function GuidesScreen() {
  const router = useRouter();
  const { language } = usePreferences();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  const grouped = useMemo(() => {
    return germanyGuides.reduce<Record<string, typeof germanyGuides>>(
      (acc, guide) => {
        if (!acc[guide.category]) acc[guide.category] = [];
        acc[guide.category].push(guide);
        return acc;
      },
      {}
    );
  }, []);

  return (
    <FeatureGate feature="guides">
      <Screen>
      <PageHeader
        title="Guides"
        subtitle="Germany essentials for newcomers"
      />

      <Card>
        <Text
          style={{
            fontSize: Typography.sizes.bodySecondary,
            color: palette.textSecondary,
            lineHeight: 22,
          }}
        >
          {language === "fa"
            ? "چک‌لیست‌های گام‌به‌گام برای مهم‌ترین کارها در ماه‌های اول."
            : "Step-by-step checklists for the most important tasks in the first months."}
        </Text>
      </Card>

      {Object.entries(grouped).map(([category, guides]) => (
        <View key={category}>
          <Text
            style={{
              fontSize: Typography.sizes.headingM,
              fontWeight: Typography.fontWeight.bold,
              color: palette.textPrimary,
              marginTop: Spacing.md,
              marginBottom: Spacing.sm,
            }}
          >
            {fa(guides[0]?.categoryFa, category, language)}
          </Text>
          {guides.map((guide) => (
            <ListItem
              key={guide.id}
              title={fa(guide.titleFa, guide.title, language)}
              subtitle={fa(guide.summaryFa, guide.summary, language)}
              onPress={() => router.push(`/guide/${guide.id}` as any)}
              right={<Chevron />}
            />
          ))}
        </View>
      ))}
      </Screen>
    </FeatureGate>
  );
}
