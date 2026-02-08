import React from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors, Spacing, Typography } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Screen } from "../components/ui/Screen";
import { getTimeline, supportedCountries } from "../services/countries-data";

export default function TimelineScreen() {
  const params = useLocalSearchParams<{ country?: string }>();
  const code = (params.country || "GLOBAL").toUpperCase();
  const country = supportedCountries.find((c) => c.code === code);

  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const timeline = getTimeline(code);

  return (
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
            {block.dayRange} · {block.title}
          </Text>
          {block.items.map((item) => (
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
  );
}
