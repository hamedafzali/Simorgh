import React from "react";
import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors, Spacing, Typography } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Screen } from "../components/ui/Screen";
import { getTaxReminders, supportedCountries } from "../services/countries-data";

export default function TaxBasicsScreen() {
  const params = useLocalSearchParams<{ country?: string }>();
  const code = (params.country || "DE").toUpperCase();
  const country = supportedCountries.find((c) => c.code === code);

  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const reminders = getTaxReminders(code);

  return (
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
            {item.title}
          </Text>
          <Text
            style={{
              fontSize: Typography.sizes.bodySecondary,
              color: palette.textSecondary,
              lineHeight: 22,
            }}
          >
            {item.timing}
            {"\n"}{item.notes}
          </Text>
        </Card>
      ))}
    </Screen>
  );
}
