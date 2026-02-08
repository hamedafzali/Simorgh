import React from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Header } from "../../components/ui/Header";
import { Screen } from "../../components/ui/Screen";
import {
  getStarterPack,
  getTimeline,
  getServices,
  supportedCountries,
} from "../../services/countries-data";

export default function CountryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ code?: string }>();
  const code = (params.code || "GLOBAL").toUpperCase();

  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  const country = supportedCountries.find((c) => c.code === code);
  const starter = getStarterPack(code);
  const timeline = getTimeline(code);
  const services = getServices(code);

  return (
    <Screen>
      <Header
        title={country ? country.name : "Country"}
        subtitle={country?.summary || "Starter pack"}
      />

      <Card>
        <Text
          style={{
            fontSize: Typography.sizes.headingM,
            fontWeight: Typography.fontWeight.bold,
            color: palette.textPrimary,
            marginBottom: Spacing.xs,
          }}
        >
          {starter.title}
        </Text>
        <Text
          style={{
            fontSize: Typography.sizes.bodySecondary,
            color: palette.textSecondary,
            lineHeight: 22,
          }}
        >
          {starter.overview}
        </Text>
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
          Top steps
        </Text>
        {starter.steps.map((step) => (
          <Text
            key={step}
            style={{
              fontSize: Typography.sizes.bodySecondary,
              color: palette.textSecondary,
              lineHeight: 22,
            }}
          >
            • {step}
          </Text>
        ))}
      </Card>

      <View style={{ height: Spacing.sm }} />

      <Button
        title="View timeline"
        onPress={() => router.push(`/timeline?country=${code}` as any)}
      />
      <View style={{ height: Spacing.sm }} />
      <Button
        title="Trusted services"
        variant="secondary"
        onPress={() => router.push(`/services?country=${code}` as any)}
      />
      <View style={{ height: Spacing.sm }} />
      <Button
        title="Deadlines"
        variant="secondary"
        onPress={() => router.push(`/deadlines?country=${code}` as any)}
      />
      <View style={{ height: Spacing.sm }} />
      <Button
        title="Document Tracker"
        variant="secondary"
        onPress={() => router.push(`/documents-tracker?country=${code}` as any)}
      />
      <View style={{ height: Spacing.sm }} />
      <Button
        title="Phrasebook"
        variant="secondary"
        onPress={() => router.push(`/phrasebook?country=${code}` as any)}
      />

      <View style={{ height: Spacing.lg }} />

      <Card>
        <Text
          style={{
            fontSize: Typography.sizes.headingM,
            fontWeight: Typography.fontWeight.bold,
            color: palette.textPrimary,
            marginBottom: Spacing.sm,
          }}
        >
          First 90 days
        </Text>
        {timeline.map((block) => (
          <View key={block.dayRange} style={{ marginBottom: Spacing.sm }}>
            <Text
              style={{
                fontSize: Typography.sizes.bodySecondary,
                color: palette.textPrimary,
                fontWeight: Typography.fontWeight.semibold,
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
          </View>
        ))}
      </Card>

      {services.length === 0 ? (
        <Card>
          <Text
            style={{
              fontSize: Typography.sizes.bodySecondary,
              color: palette.textSecondary,
              lineHeight: 22,
            }}
          >
            No services listed yet for this country. We will add vetted
            providers soon.
          </Text>
        </Card>
      ) : null}
    </Screen>
  );
}
