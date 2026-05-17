import React from "react";
import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors, Spacing, Typography } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import FeatureGate from "../components/FeatureGate";
import { Screen } from "../components/ui/Screen";
import { getTaxReminders, supportedCountries } from "../services/countries-data";
import { usePreferences } from "../contexts/PreferencesContext";
import { fa } from "../services/l10n";

export default function TaxBasicsScreen() {
  const params = useLocalSearchParams<{ country?: string }>();
  const code = (params.country || "DE").toUpperCase();
  const country = supportedCountries.find((c) => c.code === code);
  const { language } = usePreferences();

  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const reminders = getTaxReminders(code);

  return (
    <FeatureGate feature="tax">
      <Screen>
      <PageHeader
        title="Tax Basics"
        subtitle={country ? country.name : "Global"}
      />

      {reminders.map((item) => (
        <Card key={item.title}>
          <Text
            style={{
              fontSize: Typography.sizes.headingM,
              fontWeight: Typography.fontWeight.bold,
              color: palette.textPrimary,
              marginBottom: Spacing.xs,
            }}
          >
            {fa(item.titleFa, item.title, language)}
          </Text>
          <Text
            style={{
              fontSize: Typography.sizes.bodySecondary,
              color: palette.textSecondary,
              lineHeight: 22,
            }}
          >
            {fa(item.timingFa, item.timing, language)}
            {"\n"}{fa(item.notesFa, item.notes, language)}
          </Text>
        </Card>
      ))}
      </Screen>
    </FeatureGate>
  );
}
