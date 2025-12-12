import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { ThemedText } from "./themed-text";
import { IconSymbol } from "./ui/icon-symbol";
import { Spacing } from "@/constants/theme";
import { fetchFromAPI } from "@/services/api";
import { Flashcard } from "@/services/learningService";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface FlashcardProps {
  flashcard: Flashcard;
  onUpdate: (id: string, updates: Partial<Flashcard>) => void;
}

export function FlashcardComponent({ flashcard, onUpdate }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipAnimation] = useState(new Animated.Value(0));
  const [scaleAnimation] = useState(new Animated.Value(1));
  const [opacityAnimation] = useState(new Animated.Value(1));
  const [glowAnimation] = useState(new Animated.Value(0));
  const [wordData, setWordData] = useState<any>(null);

  // Fetch word data from database when component mounts
  useEffect(() => {
    const fetchWordData = async () => {
      try {
        // Use wordId if available, otherwise fall back to german query
        let url;
        if (flashcard.wordId) {
          url = `/words/${flashcard.wordId}`;
        } else {
          url = `/words?german=${encodeURIComponent(flashcard.front)}`;
        }

        const response = await fetchFromAPI(url);
        if (response) {
          // Handle both single word response and array response
          const wordData = Array.isArray(response) ? response[0] : response;
          setWordData(wordData);
        }
      } catch {
        console.log("Word data not found, using fallback");
      }
    };

    fetchWordData();
  }, [flashcard.front, flashcard.wordId]);

  const flipCard = () => {
    console.log("Flipping card, current state:", isFlipped);
    const toValue = isFlipped ? 0 : 1;

    // Haptic feedback
    if (Platform.OS === "ios") {
      import("expo-haptics").then((haptic) => {
        haptic.impactAsync(haptic.ImpactFeedbackStyle.Medium);
      });
    }

    // Scale down effect
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(flipAnimation, {
          toValue,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnimation, {
          toValue: 1,
          tension: 200,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      console.log("Animation completed, setting flipped to:", !isFlipped);
      setIsFlipped(!isFlipped);
    });

    // Glow effect
    Animated.sequence([
      Animated.timing(glowAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(glowAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["-180deg", "0deg"],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }, { scale: scaleAnimation }],
    opacity: opacityAnimation,
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }, { scale: scaleAnimation }],
    opacity: opacityAnimation,
  };

  const getExamples = () => {
    if (wordData && wordData.examples && wordData.examples.length > 0) {
      return wordData.examples.map((example: any) => ({
        german: example.german,
        english: example.english,
      }));
    }

    // If no database data, return empty array - no hardcoded examples!
    return [];
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: "#E5E7EB",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 4,
          },
        ]}
      >
        <Animated.View style={[styles.cardFace, frontAnimatedStyle]}>
          <TouchableOpacity style={styles.cardContent} onPress={flipCard}>
            <View style={styles.header}>
              <View style={styles.typeBadge}>
                <ThemedText style={styles.cardType}>
                  {flashcard.type}
                </ThemedText>
              </View>
              <IconSymbol
                name="arrow.triangle.2.circlepath"
                size={16}
                color="#9CA3AF"
              />
            </View>
            <View style={styles.mainContent}>
              <ThemedText style={styles.cardText}>{flashcard.front}</ThemedText>
              <View style={styles.wordInfo}>
                <ThemedText style={styles.pronunciation}>
                  {wordData?.pronunciation ||
                    `[${flashcard.front.toLowerCase()}]`}
                </ThemedText>
                <ThemedText style={styles.partOfSpeech}>
                  {wordData?.category || "word"}
                </ThemedText>
              </View>
            </View>
            <ThemedText style={styles.hint}>Tap to flip →</ThemedText>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={[
            styles.cardFace,
            styles.cardBack,
            backAnimatedStyle,
            {
              backgroundColor: "#1A1A1A",
              borderWidth: 1,
              borderColor: "#2A2A2A",
            },
          ]}
        >
          <TouchableOpacity style={styles.cardContent} onPress={flipCard}>
            <View style={styles.header}>
              <View style={styles.typeBadgeDark}>
                <ThemedText style={styles.cardTypeDark}>TRANSLATION</ThemedText>
              </View>
              <IconSymbol
                name="arrow.triangle.2.circlepath"
                size={16}
                color="#666666"
              />
            </View>
            <View style={styles.mainContent}>
              <ThemedText style={styles.cardTextDark}>
                {flashcard.back}
              </ThemedText>

              {/* Examples Section */}
              <View style={styles.examplesSection}>
                <ThemedText style={styles.examplesTitle}>Examples</ThemedText>
                {getExamples().map(
                  (
                    example: { german: string; english: string },
                    index: number
                  ) => (
                    <View key={index} style={styles.exampleItem}>
                      <ThemedText style={styles.exampleGerman}>
                        {example.german}
                      </ThemedText>
                      <ThemedText style={styles.exampleEnglish}>
                        {example.english}
                      </ThemedText>
                    </View>
                  )
                )}
              </View>
            </View>
            <ThemedText style={styles.hintDark}>← Tap to flip back</ThemedText>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth - 20,
    height: screenHeight * 0.6,
    alignSelf: "center",
    position: "relative",
  },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    overflow: "hidden",
  },
  cardFace: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    borderRadius: 20,
    overflow: "hidden",
  },
  cardBack: {
    // backgroundColor set dynamically
  },
  cardContent: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  typeBadgeDark: {
    backgroundColor: "#2A2A2A",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  cardType: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#6B7280",
  },
  cardTypeDark: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#999999",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    fontSize: 42,
    fontWeight: "300",
    textAlign: "center",
    color: "#111827",
    lineHeight: 50,
    letterSpacing: -0.5,
    marginBottom: Spacing.md,
  },
  cardTextDark: {
    fontSize: 38,
    fontWeight: "400",
    textAlign: "center",
    color: "#FFFFFF",
    lineHeight: 46,
    letterSpacing: -0.5,
    marginBottom: Spacing.lg,
  },
  wordInfo: {
    alignItems: "center",
    gap: 4,
  },
  pronunciation: {
    fontSize: 16,
    fontWeight: "400",
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  partOfSpeech: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    textTransform: "capitalize",
  },
  hint: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    color: "#9CA3AF",
  },
  hintDark: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    color: "#666666",
  },
  examplesSection: {
    width: "100%",
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "#333333",
  },
  examplesTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999999",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  exampleItem: {
    marginBottom: Spacing.md,
  },
  exampleGerman: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  exampleEnglish: {
    fontSize: 15,
    fontWeight: "400",
    color: "#CCCCCC",
    fontStyle: "italic",
  },
});
