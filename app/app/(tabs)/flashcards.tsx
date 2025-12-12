import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import FlashcardComponent from "@/components/flashcard";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/contexts/theme-context";
import {
  getFlashcards,
  updateFlashcard,
  type Flashcard,
} from "@/services/learningService";
import { useRouter } from "expo-router";

export default function FlashcardsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  console.log(
    "FlashcardsScreen rendering, loading:",
    loading,
    "flashcards count:",
    flashcards.length
  );

  useEffect(() => {
    loadFlashcards();
    // Test direct API call
    testDirectAPI();
  }, []);

  const testDirectAPI = async () => {
    try {
      console.log("Testing direct API call...");
      const response = await fetch("http://192.168.178.78:3001/api/stats");
      console.log("Direct API response status:", response.status);
      const data = await response.json();
      console.log("Direct API data:", data);
    } catch (error) {
      console.error("Direct API error:", error);
    }
  };

  const loadFlashcards = async () => {
    try {
      setLoading(true);
      console.log("Loading flashcards...");
      // Load all flashcards by explicitly setting due=false
      const flashcardsData = await getFlashcards("all");
      console.log("Flashcards loaded:", flashcardsData);
      setFlashcards(flashcardsData);
    } catch (error) {
      console.error("Error loading flashcards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFlashcards();
    setRefreshing(false);
  };

  const handleUpdateFlashcard = async (
    id: string,
    updates: Partial<Flashcard>
  ) => {
    try {
      await updateFlashcard(id, updates);

      // Update local state
      setFlashcards((prev) =>
        prev.map((card) => (card.id === id ? { ...card, ...updates } : card))
      );

      // Move to next card
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    } catch (error) {
      console.error("Error updating flashcard:", error);
    }
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <IconSymbol name="hourglass" size={48} color={colors.textMuted} />
          <ThemedText style={[styles.loadingText, { color: colors.textMuted }]}>
            Loading flashcards...
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (flashcards.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.emptyState}>
          <IconSymbol
            name="rectangle.stack"
            size={64}
            color={colors.textMuted}
          />
          <ThemedText style={[styles.emptyText, { color: colors.textMuted }]}>
            No flashcards due for review
          </ThemedText>
          <ThemedText
            style={[styles.emptySubtext, { color: colors.textMuted }]}
          >
            Great job! Check back later for new cards
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <IconSymbol name="chevron.left" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <ThemedText style={[styles.title, { color: colors.text }]}>
              Flashcard Practice
            </ThemedText>
            <View style={styles.progress}>
              <ThemedText
                style={[styles.progressText, { color: colors.textMuted }]}
              >
                {currentIndex + 1} / {flashcards.length}
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.cardContainer}>
          {currentCard && (
            <FlashcardComponent
              front={currentCard.front}
              back={currentCard.back}
              isFlipped={isFlipped}
              onFlip={() => setIsFlipped(!isFlipped)}
            />
          )}
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: colors.card }]}
            onPress={handlePrevious}
            disabled={currentIndex === 0}
          >
            <IconSymbol name="chevron.left" size={24} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: colors.card }]}
            onPress={handleShuffle}
          >
            <IconSymbol name="shuffle" size={24} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: colors.card }]}
            onPress={handleNext}
            disabled={currentIndex === flashcards.length - 1}
          >
            <IconSymbol name="chevron.right" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${((currentIndex + 1) / flashcards.length) * 100}%`,
                backgroundColor: colors.primary,
              },
            ]}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.semibold,
  },
  progress: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 16,
  },
  progressText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: Typography.sizes.base,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
  },
  emptySubtext: {
    fontSize: Typography.sizes.sm,
    opacity: 0.8,
    textAlign: "center",
  },
  cardContainer: {
    marginBottom: Spacing.xl,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  controlButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
});
