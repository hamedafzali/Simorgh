import React from "react";
import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors, Spacing, Typography } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Screen } from "../components/ui/Screen";
import { getFormGuides, supportedCountries } from "../services/countries-data";

export default function FormsScreen() {
  const params = useLocalSearchParams<{ country?: string }>();
  const code = (params.country || "DE").toUpperCase();
  const country = supportedCountries.find((c) => c.code === code);

  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const guides = getFormGuides(code);

  return (
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
            {guide.title}
          </Text>
          <Text
            style={{
              fontSize: Typography.sizes.bodySecondary,
              color: palette.textSecondary,
              lineHeight: 22,
            }}
          >
            {guide.summary}
          </Text>
          <Text
            style={{
              fontSize: Typography.sizes.bodySecondary,
              color: palette.textPrimary,
              marginTop: Spacing.sm,
              fontWeight: Typography.fontWeight.semibold,
            }}
          >
            Fields
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
            Tips
          </Text>
          {guide.tips.map((tip) => (
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
  );
}
