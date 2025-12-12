import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, ScrollView, StyleSheet, View, ActivityIndicator, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import { IconSymbol } from "@/components/ui/icon-symbol";
import PageHeader from "@/components/ui/page-header";
import { Spacing, Typography } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";

interface Game {
  id: string;
  name: string;
  nameFa: string;
  nameDe: string;
  description: string;
  descriptionFa: string;
  descriptionDe: string;
  icon: string;
  players: string;
  category: string;
  isOnline: boolean;
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
    backgroundColor: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(20px)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -48,
  },
  headerSpacer: {
    width: 36,
    height: 36,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 100, // Reduced for modern header
    gap: Spacing.lg,
    paddingBottom: Spacing.xl,
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
  categoryTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.semibold,
    color: "#FFFFFF",
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  gamesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: Spacing.md,
  },
  gameCard: {
    width: "45%",
    marginHorizontal: "2.5%",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  gameCardOnline: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  gameIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  gameName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  gamePlayers: {
    fontSize: Typography.sizes.xs,
    color: "rgba(255,255,255,0.7)",
    marginBottom: Spacing.sm,
  },
  gameDescription: {
    fontSize: Typography.sizes.xs,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    lineHeight: 16,
  },
  onlineBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#10B981",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  onlineBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default function GamesScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  // Theme colors
  const backgroundColor = useThemeColor({}, "background") as string;
  const games: Game[] = [
    {
      id: "backgammon",
      name: "Backgammon",
      nameFa: "تخته نرد",
      nameDe: "Backgammon",
      description: "Classic strategy board game",
      descriptionFa: "بازی تخته فکری کلاسیک",
      descriptionDe: "Klassisches Strategiespiel",
      icon: "gamecontroller.fill",
      players: "2 Players",
      category: "board",
      isOnline: true,
    },
    {
      id: "chess",
      name: "Chess",
      nameFa: "شطرنج",
      nameDe: "Schach",
      description: "Strategic chess game",
      descriptionFa: "بازی شطرنج استراتژیک",
      descriptionDe: "Strategiesches Schachspiel",
      icon: "crown.fill",
      players: "2 Players",
      category: "board",
      isOnline: true,
    },
    {
      id: "checkers",
      name: "Checkers",
      nameFa: "منچ",
      nameDe: "Dame",
      description: "Classic checkers game",
      descriptionFa: "بازی منچ کلاسیک",
      descriptionDe: "Klassisches Dame-Spiel",
      icon: "circle.grid.3x3.fill",
      players: "2 Players",
      category: "board",
      isOnline: true,
    },
    {
      id: "cards",
      name: "Cards",
      nameFa: "کارت",
      nameDe: "Karten",
      description: "Various card games",
      descriptionFa: "بازی‌های کارت مختلف",
      descriptionDe: "Verschiedene Kartenspiele",
      icon: "suit.spade.fill",
      players: "2-4 Players",
      category: "cards",
      isOnline: true,
    },
    {
      id: "puzzle",
      name: "Puzzle",
      nameFa: "پازل",
      nameDe: "Puzzle",
      description: "Brain teaser puzzles",
      descriptionFa: "پازل‌های فکری",
      descriptionDe: "Gehirn-Jigsaw-Puzzles",
      icon: "puzzlepiece.fill",
      players: "1 Player",
      category: "puzzle",
      isOnline: false,
    },
    {
      id: "word",
      name: "Word Games",
      nameFa: "بازی کلمات",
      nameDe: "Wortspiele",
      description: "Word and language games",
      descriptionFa: "بازی‌های کلمه و زبان",
      descriptionDe: "Wort- und Sprachspiele",
      icon: "textformat.abc",
      players: "1-4 Players",
      category: "word",
      isOnline: false,
    },
  ];

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    setLoading(false);

    // Listen for language changes
    const handleLanguageChanged = () => {
      forceUpdate();
    };

    i18n.on("languageChanged", handleLanguageChanged);

    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, [fadeAnim, i18n]);

  const handleGamePress = (game: Game) => {
    console.log(`Game pressed: ${game.name} (${game.id})`);

    // Navigate to specific game pages
    if (game.id === "cards") {
      router.push("/(tabs)/games/cards");
    } else {
      // For other games, show placeholder message
      console.log(`Game ${game.name} is not yet implemented`);
    }
  };

  const getLocalizedGameName = (game: Game) => {
    switch (i18n.language) {
      case "fa":
        return game.nameFa;
      case "de":
        return game.nameDe;
      default:
        return game.name;
    }
  };

  const getLocalizedGameDescription = (game: Game) => {
    switch (i18n.language) {
      case "fa":
        return game.descriptionFa;
      case "de":
        return game.descriptionDe;
      default:
        return game.description;
    }
  };

  const boardGames = games.filter((game) => game.category === "board");
  const cardGames = games.filter((game) => game.category === "cards");
  const otherGames = games.filter(
    (game) => !["board", "cards"].includes(game.category)
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]} key={i18n.language}>
      {/* Page Header */}
      <PageHeader
        title={t("games.title")}
        showBackButton={true}
        onBackPress={() => router.back()}
        height="medium"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[{ opacity: fadeAnim }]}>
          {/* Board Games */}
          <ThemedView style={styles.card}>
            <ThemedText style={styles.categoryTitle}>
              {t("games.boardGames")}
            </ThemedText>
            <View style={styles.gamesGrid}>
              {boardGames.map((game) => (
                <TouchableOpacity
                  key={game.id}
                  style={[
                    styles.gameCard,
                    game.isOnline && styles.gameCardOnline,
                  ]}
                  onPress={() => handleGamePress(game)}
                >
                  <View style={styles.gameIcon}>
                    <IconSymbol
                      name={game.icon as any}
                      size={28}
                      color="#3B82F6"
                    />
                    {game.isOnline && (
                      <View style={styles.onlineBadge}>
                        <ThemedText style={styles.onlineBadgeText}>
                          {t("games.online")}
                        </ThemedText>
                      </View>
                    )}
                  </View>
                  <ThemedText style={styles.gameName}>
                    {getLocalizedGameName(game)}
                  </ThemedText>
                  <ThemedText style={styles.gamePlayers}>
                    {game.players}
                  </ThemedText>
                  <ThemedText style={styles.gameDescription}>
                    {getLocalizedGameDescription(game)}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </ThemedView>

          {/* Card Games */}
          <ThemedView style={styles.card}>
            <ThemedText style={styles.categoryTitle}>
              {t("games.cardGames")}
            </ThemedText>
            <View style={styles.gamesGrid}>
              {cardGames.map((game) => (
                <TouchableOpacity
                  key={game.id}
                  style={[
                    styles.gameCard,
                    game.isOnline && styles.gameCardOnline,
                  ]}
                  onPress={() => handleGamePress(game)}
                >
                  <View style={styles.gameIcon}>
                    <IconSymbol
                      name={game.icon as any}
                      size={28}
                      color="#3B82F6"
                    />
                    {game.isOnline && (
                      <View style={styles.onlineBadge}>
                        <ThemedText style={styles.onlineBadgeText}>
                          {t("games.online")}
                        </ThemedText>
                      </View>
                    )}
                  </View>
                  <ThemedText style={styles.gameName}>
                    {getLocalizedGameName(game)}
                  </ThemedText>
                  <ThemedText style={styles.gamePlayers}>
                    {game.players}
                  </ThemedText>
                  <ThemedText style={styles.gameDescription}>
                    {getLocalizedGameDescription(game)}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </ThemedView>

          {/* Other Games */}
          {otherGames.length > 0 && (
            <ThemedView style={styles.card}>
              <ThemedText style={styles.categoryTitle}>
                {t("games.otherGames")}
              </ThemedText>
              <View style={styles.gamesGrid}>
                {otherGames.map((game) => (
                  <TouchableOpacity
                    key={game.id}
                    style={[
                      styles.gameCard,
                      game.isOnline && styles.gameCardOnline,
                    ]}
                    onPress={() => handleGamePress(game)}
                  >
                    <View style={styles.gameIcon}>
                      <IconSymbol
                        name={game.icon as any}
                        size={28}
                        color="#3B82F6"
                      />
                      {game.isOnline && (
                        <View style={styles.onlineBadge}>
                          <ThemedText style={styles.onlineBadgeText}>
                            {t("games.online")}
                          </ThemedText>
                        </View>
                      )}
                    </View>
                    <ThemedText style={styles.gameName}>
                      {getLocalizedGameName(game)}
                    </ThemedText>
                    <ThemedText style={styles.gamePlayers}>
                      {game.players}
                    </ThemedText>
                    <ThemedText style={styles.gameDescription}>
                      {getLocalizedGameDescription(game)}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </ThemedView>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}
