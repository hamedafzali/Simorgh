import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Spacing, Typography } from "@/constants/theme";

interface Card {
  code: string;
  image: string;
  images: {
    svg: string;
    png: string;
  };
  value: string;
  suit: string;
}

interface CardGameState {
  deckId: string | null;
  cards: Card[];
  remaining: number;
  loading: boolean;
  error: string | null;
  shuffled: boolean;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 5,
  },
  glassHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    paddingTop: 50,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    zIndex: 20,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 40,
  },
  headerTitle: {
    fontSize: Typography.sizes["3xl"],
    fontWeight: Typography.weights.semibold,
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
    marginHorizontal: Spacing.sm,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -35,
  },
  scrollView: {
    flex: 1,
    paddingTop: 100,
  },
  content: {
    padding: Spacing.lg,
  },
  card: {
    borderRadius: 16,
    padding: Spacing.md,
    backgroundColor: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.semibold,
    color: "#FFFFFF",
    marginBottom: Spacing.md,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: Spacing.md,
    flexWrap: "wrap",
  },
  button: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
    margin: 4,
  },
  drawButton: {
    backgroundColor: "#10B981",
  },
  shuffleButton: {
    backgroundColor: "#F59E0B",
  },
  resetButton: {
    backgroundColor: "#EF4444",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: Typography.weights.semibold,
    fontSize: Typography.sizes.sm,
  },
  loadingContainer: {
    alignItems: "center",
    padding: Spacing.lg,
  },
  errorContainer: {
    backgroundColor: "#EF4444",
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.md,
  },
  errorText: {
    color: "#FFFFFF",
    textAlign: "center",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: Spacing.md,
    padding: Spacing.sm,
    backgroundColor: "#1F2937",
    borderRadius: 8,
  },
  infoText: {
    color: "#FFFFFF",
    fontSize: Typography.sizes.sm,
  },
  cardsContainer: {
    marginTop: Spacing.md,
  },
  cardsTitle: {
    color: "#FFFFFF",
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    marginBottom: Spacing.sm,
  },
  cardsRow: {
    flexDirection: "row",
  },
  cardContainer: {
    alignItems: "center",
    marginRight: Spacing.md,
  },
  cardImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginBottom: Spacing.xs,
  },
  cardText: {
    color: "#FFFFFF",
    fontSize: Typography.sizes.xs,
    textAlign: "center",
    maxWidth: 80,
  },
  emptyState: {
    alignItems: "center",
    padding: Spacing.xl,
  },
  emptyStateText: {
    color: "#9CA3AF",
    fontSize: Typography.sizes.base,
    textAlign: "center",
    marginTop: Spacing.md,
  },
});

export default function CardGamePage() {
  const router = useRouter();

  const [gameState, setGameState] = useState<CardGameState>({
    deckId: null,
    cards: [],
    remaining: 52,
    loading: false,
    error: null,
    shuffled: false,
  });

  const createNewDeck = async () => {
    try {
      setGameState((prev) => ({ ...prev, loading: true, error: null }));

      const response = await fetch(
        "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
      );
      const data = await response.json();

      if (data.success) {
        setGameState({
          deckId: data.deck_id,
          cards: [],
          remaining: data.remaining,
          loading: false,
          error: null,
          shuffled: true,
        });
      }
    } catch {
      setGameState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to create deck",
      }));
    }
  };

  const drawCard = async () => {
    if (!gameState.deckId) return;

    try {
      setGameState((prev) => ({ ...prev, loading: true, error: null }));

      const response = await fetch(
        `https://deckofcardsapi.com/api/deck/${gameState.deckId}/draw/?count=1`
      );
      const data = await response.json();

      if (data.success && data.cards.length > 0) {
        setGameState((prev) => ({
          ...prev,
          cards: [...prev.cards, data.cards[0]],
          remaining: data.remaining,
          loading: false,
          error: null,
        }));
      }
    } catch {
      setGameState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to draw card",
      }));
    }
  };

  const drawMultipleCards = async (count: number) => {
    if (!gameState.deckId) return;

    try {
      setGameState((prev) => ({ ...prev, loading: true, error: null }));

      const response = await fetch(
        `https://deckofcardsapi.com/api/deck/${gameState.deckId}/draw/?count=${count}`
      );
      const data = await response.json();

      if (data.success && data.cards.length > 0) {
        setGameState((prev) => ({
          ...prev,
          cards: [...prev.cards, ...data.cards],
          remaining: data.remaining,
          loading: false,
          error: null,
        }));
      }
    } catch {
      setGameState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to draw cards",
      }));
    }
  };

  const shuffleDeck = async () => {
    if (!gameState.deckId) return;

    try {
      setGameState((prev) => ({ ...prev, loading: true, error: null }));

      const response = await fetch(
        `https://deckofcardsapi.com/api/deck/${gameState.deckId}/shuffle/`
      );
      const data = await response.json();

      if (data.success) {
        setGameState((prev) => ({
          ...prev,
          cards: [],
          remaining: data.remaining,
          loading: false,
          error: null,
          shuffled: true,
        }));
      }
    } catch {
      setGameState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to shuffle deck",
      }));
    }
  };

  const resetGame = () => {
    setGameState({
      deckId: null,
      cards: [],
      remaining: 52,
      loading: false,
      error: null,
      shuffled: false,
    });
  };

  const returnCardsToDeck = async () => {
    if (!gameState.deckId || gameState.cards.length === 0) return;

    try {
      setGameState((prev) => ({ ...prev, loading: true, error: null }));

      const cardCodes = gameState.cards.map((card) => card.code).join(",");
      const response = await fetch(
        `https://deckofcardsapi.com/api/deck/${gameState.deckId}/return/?cards=${cardCodes}`
      );
      const data = await response.json();

      if (data.success) {
        setGameState((prev) => ({
          ...prev,
          cards: [],
          remaining: data.remaining,
          loading: false,
          error: null,
        }));
      }
    } catch {
      setGameState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to return cards",
      }));
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1e3a8a", "#7c3aed", "#1e3a8a"]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.glassHeader}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <IconSymbol name="chevron.left" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Card Games</ThemedText>
          <View style={styles.backButton} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <ThemedView style={styles.card}>
            <ThemedText style={styles.cardTitle}>Deck of Cards</ThemedText>

            <View style={styles.controls}>
              {!gameState.deckId ? (
                <TouchableOpacity style={styles.button} onPress={createNewDeck}>
                  <ThemedText style={styles.buttonText}>New Deck</ThemedText>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    style={[styles.button, styles.drawButton]}
                    onPress={drawCard}
                    disabled={gameState.loading || gameState.remaining === 0}
                  >
                    <ThemedText style={styles.buttonText}>Draw 1</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.drawButton]}
                    onPress={() => drawMultipleCards(5)}
                    disabled={gameState.loading || gameState.remaining === 0}
                  >
                    <ThemedText style={styles.buttonText}>Draw 5</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.shuffleButton]}
                    onPress={shuffleDeck}
                  >
                    <ThemedText style={styles.buttonText}>Shuffle</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.resetButton]}
                    onPress={resetGame}
                  >
                    <ThemedText style={styles.buttonText}>Reset</ThemedText>
                  </TouchableOpacity>
                </>
              )}
            </View>

            {gameState.loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <ThemedText style={{ color: "#FFFFFF", marginTop: Spacing.sm }}>
                  {gameState.deckId ? "Drawing cards..." : "Creating deck..."}
                </ThemedText>
              </View>
            )}

            {gameState.error && (
              <View style={styles.errorContainer}>
                <ThemedText style={styles.errorText}>
                  {gameState.error}
                </ThemedText>
              </View>
            )}

            {gameState.deckId && (
              <View style={styles.infoContainer}>
                <ThemedText style={styles.infoText}>
                  Cards Remaining: {gameState.remaining}
                </ThemedText>
                <ThemedText style={styles.infoText}>
                  Cards Drawn: {gameState.cards.length}
                </ThemedText>
                <ThemedText style={styles.infoText}>
                  Deck: {gameState.shuffled ? "Shuffled" : "New"}
                </ThemedText>
              </View>
            )}

            {gameState.deckId && gameState.cards.length === 0 && (
              <View style={styles.emptyState}>
                <IconSymbol name="suit.spade.fill" size={48} color="#9CA3AF" />
                <ThemedText style={styles.emptyStateText}>
                  No cards drawn yet. Tap &apos;Draw&apos; to start!
                </ThemedText>
              </View>
            )}

            {gameState.cards.length > 0 && (
              <View style={styles.cardsContainer}>
                <View style={styles.controls}>
                  <ThemedText style={styles.cardsTitle}>
                    Drawn Cards ({gameState.cards.length})
                  </ThemedText>
                  {gameState.cards.length > 0 && (
                    <TouchableOpacity
                      style={[styles.button, styles.shuffleButton]}
                      onPress={returnCardsToDeck}
                      disabled={gameState.loading}
                    >
                      <ThemedText style={styles.buttonText}>
                        Return All
                      </ThemedText>
                    </TouchableOpacity>
                  )}
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.cardsRow}>
                    {gameState.cards.map((card, index) => (
                      <View
                        key={`${card.code}-${index}`}
                        style={styles.cardContainer}
                      >
                        <Image
                          source={{ uri: card.image }}
                          style={styles.cardImage}
                          resizeMode="contain"
                        />
                        <ThemedText style={styles.cardText}>
                          {card.value} of {card.suit}
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}
          </ThemedView>

          <ThemedView style={styles.card}>
            <ThemedText style={styles.cardTitle}>Game Rules</ThemedText>
            <ThemedText style={{ color: "#FFFFFF", lineHeight: 20 }}>
              • Create a new deck to start playing
              {"\n"}• Draw cards one at a time or multiple at once
              {"\n"}• Cards are drawn from a standard 52-card deck
              {"\n"}• Shuffle the deck to reset the draw order
              {"\n"}• Return cards to the deck to reuse them
              {"\n"}• Use these cards for any card game you like!
            </ThemedText>
          </ThemedView>
        </View>
      </ScrollView>
    </View>
  );
}
