import React from "react";
import { Text } from "react-native";
import { useRouter } from "expo-router";
import { Colors, Typography } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { PageHeader } from "../components/ui/PageHeader";
import { ListItem } from "../components/ui/ListItem";
import { Screen } from "../components/ui/Screen";
import { Chevron } from "../components/ui/Chevron";
import { supportedCountries } from "../services/countries-data";

export default function CountriesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <Screen>
      <PageHeader title="Countries" subtitle="Pick your country to begin" />

      {supportedCountries.map((country) => (
        <ListItem
          key={country.code}
          title={`${country.name}${country.localName ? ` (${country.localName})` : ""}`}
          subtitle={country.summary}
          onPress={() => router.push(`/country/${country.code}` as any)}
          right={<Chevron />}
        />
      ))}

      <Text
        style={{
          fontSize: Typography.sizes.bodySecondary,
          color: palette.textSecondary,
          marginTop: 16,
          lineHeight: 22,
        }}
      >
        We are adding more countries continuously. Germany is fully populated
        right now.
      </Text>
    </Screen>
  );
}
