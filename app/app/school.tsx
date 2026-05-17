import React from "react";
import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors, Spacing, Typography } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import FeatureGate from "../components/FeatureGate";
import { Screen } from "../components/ui/Screen";
import { getSchoolGuide, supportedCountries } from "../services/countries-data";
import { usePreferences } from "../contexts/PreferencesContext";
import { fa, faArr } from "../services/l10n";
import { t } from "../services/i18n";

export default function SchoolGuideScreen() {
  const params = useLocalSearchParams<{ country?: string }>();
  const code = (params.country || "DE").toUpperCase();
  const country = supportedCountries.find((c) => c.code === code);
  const { language } = usePreferences();

  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const guide = getSchoolGuide(code);

  return (
    <FeatureGate feature="school">
      <Screen>
      <PageHeader
        title="School Enrollment"
        subtitle={country ? country.name : "Global"}
      />

      <Card>
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
      </Card>

      <Card>
        <Text
          style={{
            fontSize: Typography.sizes.headingM,
            fontWeight: Typography.fontWeight.bold,
            color: palette.textPrimary,
            marginBottom: Spacing.sm,
          }}
        >
          {t(language, "settlement.steps")}
        </Text>
        {faArr(guide.stepsFa, guide.steps, language).map((step) => (
          <Text
            key={step}
            style={{
              fontSize: Typography.sizes.bodySecondary,
              color: palette.textSecondary,
              lineHeight: 22,
            }}
          >
            • {step}
          </Text>
        ))}
      </Card>

      <Card>
        <Text
          style={{
            fontSize: Typography.sizes.headingM,
            fontWeight: Typography.fontWeight.bold,
            color: palette.textPrimary,
            marginBottom: Spacing.sm,
          }}
        >
          {t(language, "settlement.documents")}
        </Text>
        {faArr(guide.documentsFa, guide.documents, language).map((doc) => (
          <Text
            key={doc}
            style={{
              fontSize: Typography.sizes.bodySecondary,
              color: palette.textSecondary,
              lineHeight: 22,
            }}
          >
            • {doc}
          </Text>
        ))}
      </Card>
      </Screen>
    </FeatureGate>
  );
}
