import React from "react";
import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors, Spacing, Typography } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Screen } from "../components/ui/Screen";
import {
  getHousingChecklist,
  supportedCountries,
} from "../services/countries-data";

export default function HousingSafetyScreen() {
  const params = useLocalSearchParams<{ country?: string }>();
  const code = (params.country || "DE").toUpperCase();
  const country = supportedCountries.find((c) => c.code === code);

  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const checklist = getHousingChecklist(code);

  return (
    <Screen>
      <PageHeader
        title="Housing Safety"
        subtitle={country ? country.name : "Global"}
      />

      <Card>
        <Text
          style={{
            fontSize: Typography.sizes.headingM,
            fontWeight: Typography.fontWeight.bold,
            color: palette.textPrimary,
            marginBottom: Spacing.sm,
          }}
        >
          {checklist.title}
        </Text>
        {checklist.items.map((item) => (
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

      <Card>
        <Text
          style={{
            fontSize: Typography.sizes.headingM,
            fontWeight: Typography.fontWeight.bold,
            color: palette.textPrimary,
            marginBottom: Spacing.sm,
          }}
        >
          Scam warnings
        </Text>
        {checklist.warnings.map((warning) => (
          <Text
            key={warning}
            style={{
              fontSize: Typography.sizes.bodySecondary,
              color: palette.textSecondary,
              lineHeight: 22,
            }}
          >
            • {warning}
          </Text>
        ))}
      </Card>
    </Screen>
  );
}
