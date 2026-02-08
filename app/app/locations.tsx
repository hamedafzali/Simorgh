import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { Colors, Spacing, Typography } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Screen } from "../components/ui/Screen";
import { germanyLocations } from "../services/germany-data";

export default function LocationsScreen() {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  const grouped = useMemo(() => {
    return germanyLocations.reduce<Record<string, typeof germanyLocations>>(
      (acc, location) => {
        if (!acc[location.city]) acc[location.city] = [];
        acc[location.city].push(location);
        return acc;
      },
      {}
    );
  }, []);

  return (
    <Screen>
      <PageHeader
        title="Locations"
        subtitle="Offices and support centers"
      />

      <Card>
        <Text
          style={{
            fontSize: Typography.sizes.bodySecondary,
            color: palette.textSecondary,
            lineHeight: 22,
          }}
        >
          Useful offices and centers in Germany. Add your city as needed.
        </Text>
      </Card>

      {Object.entries(grouped).map(([city, locations]) => (
        <View key={city}>
          <Text
            style={{
              fontSize: Typography.sizes.headingM,
              fontWeight: Typography.fontWeight.bold,
              color: palette.textPrimary,
              marginTop: Spacing.md,
              marginBottom: Spacing.sm,
            }}
          >
            {city}
          </Text>
          {locations.map((location) => (
            <Card key={location.id}>
              <Text
                style={{
                  fontSize: Typography.sizes.headingM,
                  fontWeight: Typography.fontWeight.bold,
                  color: palette.textPrimary,
                  marginBottom: Spacing.xs,
                }}
              >
                {location.name}
              </Text>
              <Text
                style={{
                  fontSize: Typography.sizes.bodySecondary,
                  color: palette.textSecondary,
                  lineHeight: 22,
                }}
              >
                {location.category}
                {"\n"}Address: {location.address}
                {"\n"}Hours: {location.hours}
                {"\n"}Contact: {location.contact}
                {"\n"}Notes: {location.notes}
              </Text>
            </Card>
          ))}
        </View>
      ))}
    </Screen>
  );
}
