import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import AudioPronunciation from "../../components/AudioPronunciation";

interface Flashcard {
  id: string;
  wordId: string;
  german: string;
  english: string;
  farsi: string;
  difficulty: number;
  interval: number;
  repetition: number;
  easeFactor: number;
  nextReview: Date;
  lastReview?: Date;
  hint?: string;
}

const mockFlashcards: Flashcard[] = [
  {
    id: "1",
    wordId: "1",
    german: "das Haus",
    english: "house",
    farsi: "خانه",
    difficulty: 3,
    interval: 1,
    repetition: 1,
    easeFactor: 2.5,
    nextReview: new Date(),
    hint: "A place where people live",
  },
  {
    id: "2",
    wordId: "2",
    german: "gehen",
    english: "to go",
    farsi: "رفتن",
    difficulty: 2,
    interval: 3,
    repetition: 2,
    easeFactor: 2.8,
    nextReview: new Date(),
    hint: "Movement action",
  },
  {
    id: "3",
    wordId: "3",
    german: "schön",
    english: "beautiful",
    farsi: "زیبا",
    difficulty: 4,
    interval: 7,
    repetition: 3,
    easeFactor: 2.2,
    nextReview: new Date(),
    hint: "Something that looks good",
  },
];

export default function FlashcardsScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    total: 0,
    correct: 0,
    incorrect: 0,
  });
  const [flipAnimation] = useState(new Animated.Value(0));
  const [slideAnimation] = useState(new Animated.Value(0));

  const currentCard = mockFlashcards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / mockFlashcards.length) * 100;

  const flipCard = () => {
    Animated.sequence([
      Animated.timing(flipAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(flipAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    setShowAnswer(!showAnswer);
  };

  const nextCard = (isCorrect: boolean) => {
    // Update stats
    setSessionStats((prev) => ({
      ...prev,
      total: prev.total + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
    }));

    // Animate card out
    Animated.timing(slideAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // Reset animations and state
      slideAnimation.setValue(0);
      flipAnimation.setValue(0);
      setShowAnswer(false);
      setShowHint(false);

      // Move to next card or finish
      if (currentCardIndex < mockFlashcards.length - 1) {
        setCurrentCardIndex((prev) => prev + 1);
      }
    });
  };

  const resetCard = () => {
    flipAnimation.setValue(0);
    slideAnimation.setValue(0);
    setShowAnswer(false);
    setShowHint(false);
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1:
      case 2:
        return theme.success;
      case 3:
        return theme.warning;
      case 4:
      case 5:
        return theme.error;
      default:
        return theme.textSecondary;
    }
  };

  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return "Very Easy";
      case 2:
        return "Easy";
      case 3:
        return "Medium";
      case 4:
        return "Hard";
      case 5:
        return "Very Hard";
      default:
        return "Unknown";
    }
  };

  const frontCardStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "90deg"],
        }),
      },
      {
        translateX: slideAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 300],
        }),
      },
    ],
    opacity: flipAnimation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.8, 0],
    }),
  };

  const backCardStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ["-90deg", "0deg"],
        }),
      },
      {
        translateX: slideAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 300],
        }),
      },
    ],
    opacity: flipAnimation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.8, 1],
    }),
  };

  if (sessionStats.total === mockFlashcards.length) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: theme.background, paddingTop: insets.top },
        ]}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.completionContainer}>
            <Ionicons
              name="trophy-outline"
              size={80}
              color={theme.accent}
              style={styles.trophyIcon}
            />
            <Text style={[styles.completionTitle, { color: theme.text }]}>
              Session Complete!
            </Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.success }]}>
                  {sessionStats.correct}
                </Text>
                <Text
                  style={[styles.statLabel, { color: theme.textSecondary }]}
                >
                  Correct
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.error }]}>
                  {sessionStats.incorrect}
                </Text>
                <Text
                  style={[styles.statLabel, { color: theme.textSecondary }]}
                >
                  Incorrect
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.accent }]}>
                  {Math.round(
                    (sessionStats.correct / sessionStats.total) * 100
                  )}
                  %
                </Text>
                <Text
                  style={[styles.statLabel, { color: theme.textSecondary }]}
                >
                  Accuracy
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.restartButton, { backgroundColor: theme.accent }]}
              onPress={() => {
                setCurrentCardIndex(0);
                setShowAnswer(false);
                setShowHint(false);
                setSessionStats({ total: 0, correct: 0, incorrect: 0 });
              }}
            >
              <Text style={styles.restartButtonText}>Start New Session</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background, paddingTop: insets.top },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            Flashcards Practice
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Card {currentCardIndex + 1} of {mockFlashcards.length}
          </Text>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View
              style={[styles.progressBar, { backgroundColor: theme.border }]}
            >
              <View
                style={[
                  styles.progressFill,
                  { backgroundColor: theme.accent, width: `${progress}%` },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: theme.textSecondary }]}>
              {Math.round(progress)}%
            </Text>
          </View>
        </View>

        {/* Flashcard */}
        <View style={styles.cardContainer}>
          {/* Front of card */}
          <Animated.View
            style={[
              styles.flashcard,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
              frontCardStyle,
            ]}
          >
            <View style={styles.cardHeader}>
              <Text
                style={[
                  styles.difficulty,
                  { color: getDifficultyColor(currentCard.difficulty) },
                ]}
              >
                {getDifficultyLabel(currentCard.difficulty)}
              </Text>
              <TouchableOpacity onPress={() => setShowHint(!showHint)}>
                <Ionicons
                  name="bulb-outline"
                  size={20}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.wordContainer}>
              <Text style={[styles.mainText, { color: theme.text }]}>
                {currentCard.german}
              </Text>
              <AudioPronunciation
                word={currentCard.german}
                language="german"
                compact={true}
              />
            </View>

            {showHint && (
              <View style={styles.hintContainer}>
                <Text style={[styles.hintText, { color: theme.textSecondary }]}>
                  Hint: {currentCard.hint}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.flipButton, { backgroundColor: theme.accent }]}
              onPress={flipCard}
            >
              <Ionicons
                name="sync-outline"
                size={20}
                color="#FFFFFF"
                style={styles.flipIcon}
              />
              <Text style={styles.flipButtonText}>Flip Card</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Back of card */}
          <Animated.View
            style={[
              styles.flashcard,
              styles.flashcardBack,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
              backCardStyle,
            ]}
          >
            <Text style={[styles.answerLabel, { color: theme.textSecondary }]}>
              English:
            </Text>
            <Text style={[styles.answerText, { color: theme.text }]}>
              {currentCard.english}
            </Text>

            <Text style={[styles.answerLabel, { color: theme.textSecondary }]}>
              Farsi:
            </Text>
            <Text style={[styles.answerText, { color: theme.text }]}>
              {currentCard.farsi}
            </Text>
          </Animated.View>
        </View>

        {/* Action Buttons */}
        {showAnswer && (
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.incorrectButton,
                { backgroundColor: theme.error },
              ]}
              onPress={() => nextCard(false)}
            >
              <Ionicons name="close-outline" size={24} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Incorrect</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.correctButton,
                { backgroundColor: theme.success },
              ]}
              onPress={() => nextCard(true)}
            >
              <Ionicons name="checkmark-outline" size={24} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Correct</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Session Stats */}
        <View style={styles.sessionStats}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.success }]}>
              {sessionStats.correct}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Correct
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.error }]}>
              {sessionStats.incorrect}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Incorrect
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.accent }]}>
              {sessionStats.total}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Total
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 20,
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "500",
  },
  cardContainer: {
    height: 400,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  flashcard: {
    width: "90%",
    height: 350,
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    backfaceVisibility: "hidden",
  },
  flashcardBack: {
    backfaceVisibility: "hidden",
  },
  cardHeader: {
    position: "absolute",
    top: 20,
    left: 24,
    right: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  difficulty: {
    fontSize: 14,
    fontWeight: "600",
  },
  mainText: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  wordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  hintContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 12,
    padding: 12,
    marginVertical: 20,
  },
  hintText: {
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
  },
  flipButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    position: "absolute",
    bottom: 24,
  },
  flipIcon: {
    marginRight: 8,
  },
  flipButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  answerLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  answerText: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    minWidth: 120,
    justifyContent: "center",
  },
  incorrectButton: {
    backgroundColor: "#DC3545",
  },
  correctButton: {
    backgroundColor: "#28A745",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  sessionStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "400",
  },
  completionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  trophyIcon: {
    marginBottom: 20,
  },
  completionTitle: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 40,
  },
  restartButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
  },
  restartButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
