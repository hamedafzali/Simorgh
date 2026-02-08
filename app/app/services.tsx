import React from "react";
import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors, Spacing, Typography } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Screen } from "../components/ui/Screen";
import { getServices, supportedCountries } from "../services/countries-data";

export default function ServicesScreen() {
  const params = useLocalSearchParams<{ country?: string }>();
  const code = (params.country || "GLOBAL").toUpperCase();
  const country = supportedCountries.find((c) => c.code === code);

  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const services = getServices(code);

  return (
    <Screen>
      <PageHeader
        title="Trusted Services"
        subtitle={country ? country.name : "Global"}
      />

      {services.length === 0 ? (
        <Card>
          <Text
            style={{
              fontSize: Typography.sizes.bodySecondary,
              color: palette.textSecondary,
              lineHeight: 22,
            }}
          >
            No services listed yet. We will add vetted providers soon.
          </Text>
        </Card>
      ) : null}

      {services.map((service) => (
        <Card key={`${service.category}-${service.name}`}>
          <Text
            style={{
              fontSize: Typography.sizes.headingM,
              fontWeight: Typography.fontWeight.bold,
              color: palette.textPrimary,
              marginBottom: Spacing.xs,
            }}
          >
            {service.name}
          </Text>
          <Text
            style={{
              fontSize: Typography.sizes.bodySecondary,
              color: palette.textSecondary,
              lineHeight: 22,
            }}
          >
            {service.category}
            {service.city ? ` · ${service.city}` : ""}
            {"\n"}{service.summary}
            {service.contact ? `\nContact: ${service.contact}` : ""}
          </Text>
        </Card>
      ))}
    </Screen>
  );
}
