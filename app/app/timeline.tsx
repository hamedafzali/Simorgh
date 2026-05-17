import React from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors, Spacing, Typography } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import FeatureGate from "../components/FeatureGate";
import { Screen } from "../components/ui/Screen";
import { getTimeline, supportedCountries } from "../services/countries-data";
import { usePreferences } from "../contexts/PreferencesContext";
import { fa, faArr } from "../services/l10n";

export default function TimelineScreen() {
  const params = useLocalSearchParams<{ country?: string }>();
  const code = (params.country || "DE").toUpperCase();
  const country = supportedCountries.find((c) => c.code === code);
  const { language } = usePreferences();

  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const timeline = getTimeline(code);

  return (
    <FeatureGate feature="timeline">
      <Screen>
      <PageHeader
        title="Arrival Timeline"
        subtitle={country ? country.name : "Global"}
      />

      {timeline.map((block) => (
        <Card key={block.dayRange}>
          <Text
            style={{
              fontSize: Typography.sizes.headingM,
              fontWeight: Typography.fontWeight.bold,
              color: palette.textPrimary,
              marginBottom: Spacing.sm,
            }}
          >
            {block.dayRange} · {fa(block.titleFa, block.title, language)}
          </Text>
          {faArr(block.itemsFa, block.items, language).map((item) => (
            <Text
              key={item}
              style={{
                fontSize: Typography.sizes.bodySecondary,
                color: palette.textSecondary,
                lineHeight: 22,
              }}
            >
              • {item}
            </Text>
          ))}
        </Card>
      ))}
      </Screen>
    </FeatureGate>
  );
}
