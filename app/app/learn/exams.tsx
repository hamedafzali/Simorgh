import React from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { PageHeader } from "../../components/ui/PageHeader";
import { ListItem } from "../../components/ui/ListItem";
import { Screen } from "../../components/ui/Screen";
import { Chevron } from "../../components/ui/Chevron";

type Exam = {
  id: string;
  title: string;
  level: "A1" | "A2" | "B1";
  minutes: number;
};

const exams: Exam[] = [
  { id: "ex1", title: "Mock Exam 1", level: "A1", minutes: 20 },
  { id: "ex2", title: "Mock Exam 2", level: "A2", minutes: 30 },
  { id: "ex3", title: "Mock Exam 3", level: "B1", minutes: 45 },
];

export default function ExamsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <Screen>
      <PageHeader title="Exams" subtitle="Mock tests scaffold" />

      <Card>
        <Text
          style={{
            fontSize: Typography.sizes.bodySecondary,
            color: palette.textSecondary,
            lineHeight: 22,
          }}
        >
          Next step: load exams from `GET /api/exams` and implement start/submit
          flow.
        </Text>
      </Card>

      {exams.map((e) => (
        <ListItem
          key={e.id}
          title={`${e.title} · ${e.level}`}
          subtitle={`${e.minutes} minutes`}
          onPress={() => {}}
          right={<Chevron />}
        />
      ))}

      <View style={{ height: Spacing.lg }} />
    </Screen>
  );
}
