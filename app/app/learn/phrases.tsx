import React from "react";
import { Text, View } from "react-native";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { Card } from "../../components/ui/Card";
import { PageHeader } from "../../components/ui/PageHeader";
import { Screen } from "../../components/ui/Screen";
import { survivalPhrases } from "../../services/germany-data";

export default function PhrasesScreen() {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <Screen>
      <PageHeader title="Survival Phrases" subtitle="German + Persian + English" />

      {survivalPhrases.map((phrase) => (
        <Card key={phrase.id}>
          <Text
            style={{
              fontSize: Typography.sizes.headingM,
              fontWeight: Typography.fontWeight.bold,
              color: palette.textPrimary,
              marginBottom: Spacing.xs,
            }}
          >
            {phrase.german}
          </Text>
          <Text
            style={{
              fontSize: Typography.sizes.bodySecondary,
              color: palette.textSecondary,
              lineHeight: 22,
            }}
          >
            فارسی: {phrase.persian}
            {"\n"}English: {phrase.english}
            {"\n"}Category: {phrase.category}
          </Text>
        </Card>
      ))}
    </Screen>
  );
}
