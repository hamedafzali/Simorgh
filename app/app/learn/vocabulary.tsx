import React, { useMemo, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import {
  BorderRadius,
  Colors,
  Spacing,
  Typography,
} from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { PageHeader } from "../../components/ui/PageHeader";
import { ListItem } from "../../components/ui/ListItem";
import { Screen } from "../../components/ui/Screen";
import { Chevron } from "../../components/ui/Chevron";

type Word = {
  id: string;
  word: string;
  level: "A1" | "A2" | "B1";
  translationFa: string;
};

const sampleWords: Word[] = [
  { id: "w1", word: "Hallo", level: "A1", translationFa: "سلام" },
  { id: "w2", word: "Danke", level: "A1", translationFa: "ممنون" },
  { id: "w3", word: "Arbeit", level: "A2", translationFa: "کار" },
  { id: "w4", word: "Termin", level: "A2", translationFa: "قرار/وقت" },
  { id: "w5", word: "Bewerbung", level: "B1", translationFa: "درخواست کار" },
];

export default function VocabularyScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return sampleWords;
    return sampleWords.filter(
      (w) =>
        w.word.toLowerCase().includes(query) ||
        w.translationFa.toLowerCase().includes(query)
    );
  }, [q]);

  return (
    <Screen>
      <PageHeader title="Vocabulary" subtitle="Search and browse (mock)" />

      <Card>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search…"
          placeholderTextColor={palette.textMuted}
          style={{
            height: 48,
            borderWidth: 1,
            borderColor: palette.borderLight,
            borderRadius: BorderRadius.md,
            paddingHorizontal: 14,
            color: palette.textPrimary,
            backgroundColor: palette.surface,
            fontSize: Typography.sizes.bodySecondary,
          }}
        />
        <View style={{ height: Spacing.sm }} />
        <Text
          style={{
            color: palette.textSecondary,
            fontSize: Typography.sizes.caption,
            fontWeight: Typography.fontWeight.semibold,
          }}
        >
          Results: {filtered.length}
        </Text>
      </Card>

      {filtered.map((w) => (
        <ListItem
          key={w.id}
          title={`${w.word} · ${w.level}`}
          subtitle={w.translationFa}
          onPress={() => {}}
          right={<Chevron />}
        />
      ))}

      <View style={{ height: Spacing.lg }} />
    </Screen>
  );
}
