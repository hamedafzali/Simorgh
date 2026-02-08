import React from "react";
import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors, Spacing, Typography } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Screen } from "../components/ui/Screen";
import {
  getSupportResources,
  supportedCountries,
} from "../services/countries-data";

export default function SupportScreen() {
  const params = useLocalSearchParams<{ country?: string }>();
  const code = (params.country || "DE").toUpperCase();
  const country = supportedCountries.find((c) => c.code === code);

  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const resources = getSupportResources(code);

  return (
    <Screen>
      <PageHeader
        title="Support Resources"
        subtitle={country ? country.name : "Global"}
      />

      {resources.map((resource) => (
        <Card key={`${resource.category}-${resource.name}`}>
          <Text
            style={{
              fontSize: Typography.sizes.headingM,
              fontWeight: Typography.fontWeight.bold,
              color: palette.textPrimary,
              marginBottom: Spacing.xs,
            }}
          >
            {resource.name}
          </Text>
          <Text
            style={{
              fontSize: Typography.sizes.bodySecondary,
              color: palette.textSecondary,
              lineHeight: 22,
            }}
          >
            {resource.category}
            {"\n"}{resource.summary}
            {resource.contact ? `\nContact: ${resource.contact}` : ""}
          </Text>
        </Card>
      ))}
    </Screen>
  );
}
