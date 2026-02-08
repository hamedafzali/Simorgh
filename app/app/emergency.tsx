import React from "react";
import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors, Spacing, Typography } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Screen } from "../components/ui/Screen";
import {
  getEmergencyContacts,
  supportedCountries,
} from "../services/countries-data";

export default function EmergencyScreen() {
  const params = useLocalSearchParams<{ country?: string }>();
  const code = (params.country || "DE").toUpperCase();
  const country = supportedCountries.find((c) => c.code === code);

  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const contacts = getEmergencyContacts(code);

  return (
    <Screen>
      <PageHeader
        title="Emergency Kit"
        subtitle={country ? country.name : "Global"}
      />

      {contacts.map((contact) => (
        <Card key={`${contact.category}-${contact.number}`}>
          <Text
            style={{
              fontSize: Typography.sizes.headingM,
              fontWeight: Typography.fontWeight.bold,
              color: palette.textPrimary,
              marginBottom: Spacing.xs,
            }}
          >
            {contact.category}: {contact.number}
          </Text>
          {contact.notes ? (
            <Text
              style={{
                fontSize: Typography.sizes.bodySecondary,
                color: palette.textSecondary,
                lineHeight: 22,
              }}
            >
              {contact.notes}
            </Text>
          ) : null}
        </Card>
      ))}

      <Card>
        <Text
          style={{
            fontSize: Typography.sizes.bodySecondary,
            color: palette.textSecondary,
            lineHeight: 22,
          }}
        >
          Save these numbers offline. If you are unsure, call the emergency
          number and say you need help in English or Persian.
        </Text>
      </Card>
    </Screen>
  );
}
