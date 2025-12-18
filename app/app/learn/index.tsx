import React from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { Card } from "../../components/ui/Card";
import { PageHeader } from "../../components/ui/PageHeader";
import { ListItem } from "../../components/ui/ListItem";
import { Screen } from "../../components/ui/Screen";
import { Chevron } from "../../components/ui/Chevron";

export default function LearnHubScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <Screen>
      <PageHeader title="Learn" subtitle="Choose a module" />

      <Card>
        <Text
          style={{
            fontSize: Typography.sizes.bodySecondary,
            color: palette.textSecondary,
            lineHeight: 22,
          }}
        >
          This hub is a scaffold around the features described in
          PROJECT_SUMMARY.md.
        </Text>
      </Card>

      <ListItem
        title="Vocabulary"
        subtitle="Browse words by level and category"
        onPress={() => router.push("/learn/vocabulary" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="Flashcards"
        subtitle="Spaced repetition review"
        onPress={() => router.push("/learn/flashcards" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="Practice"
        subtitle="Quick exercises with feedback"
        onPress={() => router.push("/learn/practice" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="Exams"
        subtitle="Mock tests and assessments"
        onPress={() => router.push("/learn/exams" as any)}
        right={<Chevron />}
      />

      <View style={{ height: Spacing.lg }} />

      <Card>
        <Text
          style={{
            fontSize: Typography.sizes.headingM,
            fontWeight: Typography.fontWeight.bold,
            color: palette.textPrimary,
            marginBottom: Spacing.xs,
          }}
        >
          Next
        </Text>
        <Text
          style={{
            fontSize: Typography.sizes.bodySecondary,
            color: palette.textSecondary,
            lineHeight: 22,
          }}
        >
          Wire these modules to backend endpoints:
          {"\n"}- /api/words
          {"\n"}- /api/flashcards
          {"\n"}- /api/exams
        </Text>
      </Card>
    </Screen>
  );
}
