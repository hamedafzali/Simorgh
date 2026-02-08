import React, { useEffect, useMemo, useState } from "react";
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

export default function FlashcardsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { getFlashcards, updateFlashcard, isInitialized } = useDatabase();

  const [deck, setDeck] = useState<any[]>([]);
  const [i, setI] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!isInitialized) return;
      setIsLoading(true);
      try {
        const next = await getFlashcards(undefined, undefined, false, 50);
        if (mounted) setDeck(next);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [getFlashcards, isInitialized]);

  const card = useMemo(() => {
    if (!deck.length) return null;
    return deck[i % deck.length];
  }, [deck, i]);

  function next() {
    setShowBack(false);
    setI((v) => v + 1);
  }

  async function reviewCard(grade: "again" | "good") {
    if (!card) return;
    const reviewCount = card.reviewCount ?? 0;
    const easeFactor = card.easeFactor ?? 2.5;
    const interval = card.interval ?? 0;

    let nextInterval = 1;
    let nextEase = easeFactor;

    if (grade === "again") {
      nextInterval = 1;
      nextEase = Math.max(1.3, easeFactor - 0.2);
    } else {
      if (reviewCount <= 0) {
        nextInterval = 1;
      } else if (reviewCount === 1) {
        nextInterval = 3;
      } else {
        nextInterval = Math.max(1, Math.round(interval * easeFactor));
      }
      nextEase = Math.max(1.3, easeFactor + 0.1);
    }

    const nextReview = Date.now() + nextInterval * 24 * 60 * 60 * 1000;
    await updateFlashcard(card.id, {
      reviewCount: reviewCount + 1,
      interval: nextInterval,
      easeFactor: nextEase,
      nextReview,
    });

    setDeck((prev) =>
      prev.map((item) =>
        item.id === card.id
          ? {
              ...item,
              reviewCount: reviewCount + 1,
              interval: nextInterval,
              easeFactor: nextEase,
              nextReview,
            }
          : item
      )
    );
    next();
  }

  return (
    <Screen>
      <PageHeader title="Flashcards" subtitle="Spaced repetition reviews" />

      {!isLoading && deck.length === 0 ? (
        <Card>
          <EmptyState
            message="No flashcards yet. Sync to download the deck."
            action={{
              title: "Open Sync",
              onPress: () => router.push("/(tabs)/sync" as any),
            }}
          />
        </Card>
      ) : null}

      {card ? (
        <Card>
          <Text
            style={{
              fontSize: 24,
              fontWeight: Typography.fontWeight.bold,
              color: palette.textPrimary,
              textAlign: "center",
            }}
          >
            {showBack ? card.back : card.front}
          </Text>

          <View style={{ height: Spacing.lg }} />

          {!showBack ? (
            <Button title="Reveal" onPress={() => setShowBack(true)} />
          ) : (
            <>
              <Button title="Again" variant="secondary" onPress={() => reviewCard("again")} />
              <View style={{ height: Spacing.sm }} />
              <Button title="Good" onPress={() => reviewCard("good")} />
            </>
          )}
        </Card>
      ) : null}
    </Screen>
  );
}
