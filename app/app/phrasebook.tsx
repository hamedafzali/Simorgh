import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors, Spacing, Typography } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Screen } from "../components/ui/Screen";
import {
  getPhrasebook,
  supportedCountries,
} from "../services/countries-data";

export default function PhrasebookScreen() {
  const params = useLocalSearchParams<{ country?: string }>();
  const code = (params.country || "DE").toUpperCase();
  const country = supportedCountries.find((c) => c.code === code);

  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  const phrases = getPhrasebook(code);
  const grouped = useMemo(() => {
    return phrases.reduce<Record<string, typeof phrases>>((acc, phrase) => {
      if (!acc[phrase.category]) acc[phrase.category] = [];
      acc[phrase.category].push(phrase);
      return acc;
    }, {});
  }, [phrases]);

  return (
    <Screen>
      <PageHeader
        title="Phrasebook"
        subtitle={country ? country.name : "Global"}
      />

      {Object.entries(grouped).map(([category, items]) => (
        <Card key={category}>
          <Text
            style={{
              fontSize: Typography.sizes.headingM,
              fontWeight: Typography.fontWeight.bold,
              color: palette.textPrimary,
              marginBottom: Spacing.sm,
            }}
          >
            {category}
          </Text>
          {items.map((item) => (
            <View key={`${item.category}-${item.phrase}`} style={{ marginBottom: Spacing.sm }}>
              <Text
                style={{
                  fontSize: Typography.sizes.bodySecondary,
                  color: palette.textPrimary,
                  fontWeight: Typography.fontWeight.semibold,
                }}
              >
                {item.phrase}
              </Text>
              <Text
                style={{
                  fontSize: Typography.sizes.bodySecondary,
                  color: palette.textSecondary,
                  lineHeight: 22,
                }}
              >
                {item.persian}
              </Text>
              {item.romanized ? (
                <Text
                  style={{
                    fontSize: Typography.sizes.bodySecondary,
                    color: palette.textMuted,
                    lineHeight: 22,
                  }}
                >
                  {item.romanized}
                </Text>
              ) : null}
            </View>
          ))}
        </Card>
      ))}
    </Screen>
  );
}
