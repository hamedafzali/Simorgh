import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { Colors, Spacing, Typography } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Screen } from "../components/ui/Screen";
import { germanyFaq } from "../services/germany-data";

export default function FaqScreen() {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  const grouped = useMemo(() => {
    return germanyFaq.reduce<Record<string, typeof germanyFaq>>((acc, faq) => {
      if (!acc[faq.category]) acc[faq.category] = [];
      acc[faq.category].push(faq);
      return acc;
    }, {});
  }, []);

  return (
    <Screen>
      <PageHeader title="FAQ" subtitle="Quick answers for Germany" />

      {Object.entries(grouped).map(([category, items]) => (
        <View key={category}>
          <Text
            style={{
              fontSize: Typography.sizes.headingM,
              fontWeight: Typography.fontWeight.bold,
              color: palette.textPrimary,
              marginTop: Spacing.md,
              marginBottom: Spacing.sm,
            }}
          >
            {category}
          </Text>
          {items.map((item) => (
            <Card key={item.id}>
              <Text
                style={{
                  fontSize: Typography.sizes.headingM,
                  fontWeight: Typography.fontWeight.bold,
                  color: palette.textPrimary,
                  marginBottom: Spacing.xs,
                }}
              >
                {item.question}
              </Text>
              <Text
                style={{
                  fontSize: Typography.sizes.bodySecondary,
                  color: palette.textSecondary,
                  lineHeight: 22,
                }}
              >
                {item.answer}
              </Text>
            </Card>
          ))}
        </View>
      ))}
    </Screen>
  );
}
