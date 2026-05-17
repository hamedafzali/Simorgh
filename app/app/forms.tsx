import React from "react";
import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors, Spacing, Typography } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import FeatureGate from "../components/FeatureGate";
import { Screen } from "../components/ui/Screen";
import { getFormGuides, supportedCountries } from "../services/countries-data";
import { usePreferences } from "../contexts/PreferencesContext";
import { fa, faArr } from "../services/l10n";
import { t } from "../services/i18n";

export default function FormsScreen() {
  const params = useLocalSearchParams<{ country?: string }>();
  const code = (params.country || "DE").toUpperCase();
  const country = supportedCountries.find((c) => c.code === code);
  const { language } = usePreferences();

  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const guides = getFormGuides(code);

  return (
    <FeatureGate feature="forms">
      <Screen>
      <PageHeader
        title="Form Helper"
        subtitle={country ? country.name : "Global"}
      />

      {guides.map((guide) => (
        <Card key={guide.title}>
          <Text
            style={{
              fontSize: Typography.sizes.headingM,
              fontWeight: Typography.fontWeight.bold,
              color: palette.textPrimary,
              marginBottom: Spacing.xs,
            }}
          >
            {fa(guide.titleFa, guide.title, language)}
          </Text>
          <Text
            style={{
              fontSize: Typography.sizes.bodySecondary,
              color: palette.textSecondary,
              lineHeight: 22,
            }}
          >
            {fa(guide.summaryFa, guide.summary, language)}
          </Text>
          <Text
            style={{
              fontSize: Typography.sizes.bodySecondary,
              color: palette.textPrimary,
              marginTop: Spacing.sm,
              fontWeight: Typography.fontWeight.semibold,
            }}
          >
            {t(language, "settlement.fields")}
          </Text>
          {guide.fields.map((field) => (
            <Text
              key={field.name}
              style={{
                fontSize: Typography.sizes.bodySecondary,
                color: palette.textSecondary,
                lineHeight: 22,
              }}
            >
              • {field.name} — {field.persianHint}
              {field.example ? ` (مثال: ${field.example})` : ""}
            </Text>
          ))}
          <Text
            style={{
              fontSize: Typography.sizes.bodySecondary,
              color: palette.textPrimary,
              marginTop: Spacing.sm,
              fontWeight: Typography.fontWeight.semibold,
            }}
          >
            {t(language, "settlement.tips")}
          </Text>
          {faArr(guide.tipsFa, guide.tips, language).map((tip) => (
            <Text
              key={tip}
              style={{
                fontSize: Typography.sizes.bodySecondary,
                color: palette.textSecondary,
                lineHeight: 22,
              }}
            >
              • {tip}
            </Text>
          ))}
        </Card>
      ))}
      </Screen>
    </FeatureGate>
  );
}
