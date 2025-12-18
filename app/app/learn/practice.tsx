import React, { useState } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { PageHeader } from "../../components/ui/PageHeader";
import { Screen } from "../../components/ui/Screen";

type Option = { id: string; label: string; correct?: boolean };

const options: Option[] = [
  { id: "o1", label: "Danke", correct: true },
  { id: "o2", label: "Tschüss" },
  { id: "o3", label: "Bitte" },
  { id: "o4", label: "Hallo" },
];

export default function PracticeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  const [selected, setSelected] = useState<string | null>(null);

  const isCorrect = selected
    ? options.find((o) => o.id === selected)?.correct
    : false;

  return (
    <Screen>
      <PageHeader title="Practice" subtitle="Quick exercise (mock)" />

      <Card>
        <Text
          style={{
            fontSize: Typography.sizes.headingM,
            fontWeight: Typography.fontWeight.bold,
            color: palette.textPrimary,
            marginBottom: Spacing.sm,
          }}
        >
          Choose the translation for “Thank you”
        </Text>

        {options.map((o) => (
          <View key={o.id} style={{ marginBottom: Spacing.sm }}>
            <Button
              title={o.label}
              variant={selected === o.id ? "primary" : "secondary"}
              onPress={() => setSelected(o.id)}
            />
          </View>
        ))}

        {selected ? (
          <Text
            style={{
              marginTop: Spacing.sm,
              fontSize: Typography.sizes.bodySecondary,
              color: isCorrect ? palette.success : palette.error,
              fontWeight: Typography.fontWeight.semibold,
            }}
          >
            {isCorrect ? "Correct" : "Try again"}
          </Text>
        ) : null}
      </Card>
    </Screen>
  );
}
