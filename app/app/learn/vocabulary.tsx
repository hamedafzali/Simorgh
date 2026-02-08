import React, { useEffect, useMemo, useState } from "react";
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
import { EmptyState } from "../../components/ui/EmptyState";
import { PageHeader } from "../../components/ui/PageHeader";
import { ListItem } from "../../components/ui/ListItem";
import { Screen } from "../../components/ui/Screen";
import { Chevron } from "../../components/ui/Chevron";
import { useDatabase } from "../../contexts/DatabaseContext";

export default function VocabularyScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { getWords, isInitialized } = useDatabase();

  const [q, setQ] = useState("");
  const [words, setWords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!isInitialized) return;
      setIsLoading(true);
      try {
        const next = await getWords(undefined, undefined, 200);
        if (mounted) setWords(next);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [getWords, isInitialized]);

  const pickPersian = (translations: any, fallback: string) => {
    try {
      const list = JSON.parse(translations || "[]") as Array<{
        language: string;
        text: string;
      }>;
      const fa = list.find(
        (t) => t.language === "fa" || t.language === "fa-IR"
      );
      if (fa?.text) return fa.text;
    } catch {
      // ignore parsing issues
    }
    return fallback;
  };

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return words;
    return words.filter((w) => {
      const persian = pickPersian(w.translations, w.english || "");
      return (
        w.german?.toLowerCase().includes(query) ||
        w.english?.toLowerCase().includes(query) ||
        persian.toLowerCase().includes(query)
      );
    });
  }, [q, words]);

  return (
    <Screen>
      <PageHeader title="Vocabulary" subtitle="Search and browse words" />

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
          Results: {isLoading ? "…" : filtered.length}
        </Text>
      </Card>

      {!isLoading && words.length === 0 ? (
        <Card>
          <EmptyState
            message="No words yet. Sync to download the word list."
            action={{
              title: "Open Sync",
              onPress: () => router.push("/(tabs)/sync" as any),
            }}
          />
        </Card>
      ) : null}

      {filtered.map((w) => {
        const persian = pickPersian(w.translations, w.english || "");
        return (
          <ListItem
            key={w.id}
            title={`${w.german} · ${w.level}`}
            subtitle={`${persian}${w.english ? ` · ${w.english}` : ""}`}
            onPress={() => {}}
            right={<Chevron />}
          />
        );
      })}

      <View style={{ height: Spacing.lg }} />
    </Screen>
  );
}
