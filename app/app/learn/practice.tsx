import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { PageHeader } from "../../components/ui/PageHeader";
import { Screen } from "../../components/ui/Screen";
import { useDatabase } from "../../contexts/DatabaseContext";

export default function PracticeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { getWords, isInitialized } = useDatabase();

  const [selected, setSelected] = useState<string | null>(null);
  const [words, setWords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [current, setCurrent] = useState<any | null>(null);
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!isInitialized) return;
      setIsLoading(true);
      try {
        const next = await getWords(undefined, undefined, 80);
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

  const pickQuestion = () => {
    if (words.length < 4) return;
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const question = shuffled[0];
    const choices = shuffled.slice(0, 4);
    setCurrent(question);
    setOptions(choices);
    setSelected(null);
  };

  useEffect(() => {
    if (words.length >= 4) {
      pickQuestion();
    }
  }, [words]);

  const isCorrect = selected ? selected === current?.id : false;

  const prompt = current?.english || current?.german;

  return (
    <Screen>
      <PageHeader title="Practice" subtitle="Quick exercise" />

      {!isLoading && words.length < 4 ? (
        <Card>
          <EmptyState
            message="Not enough words to generate practice questions. Sync to download more."
            action={{
              title: "Open Sync",
              onPress: () => router.push("/(tabs)/sync" as any),
            }}
          />
        </Card>
      ) : null}

      {current ? (
        <Card>
          <Text
            style={{
              fontSize: Typography.sizes.headingM,
              fontWeight: Typography.fontWeight.bold,
              color: palette.textPrimary,
              marginBottom: Spacing.sm,
            }}
          >
            Choose the German word for “{prompt}”
          </Text>

          {options.map((o) => (
            <View key={o.id} style={{ marginBottom: Spacing.sm }}>
              <Button
                title={o.german}
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
          <View style={{ height: Spacing.sm }} />
          <Button title="Next" variant="secondary" onPress={pickQuestion} />
        </Card>
      ) : null}
    </Screen>
  );
}
