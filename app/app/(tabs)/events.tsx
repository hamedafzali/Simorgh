import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ActivityIndicator, TouchableOpacity } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import PageHeader from "@/components/ui/page-header";
import { Spacing, Typography } from "@/constants/theme";

interface RadioStation {
  id: string;
  name: string;
  url: string;
  genre?: string;
  country?: string;
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
    paddingTop: 100,
    paddingBottom: Spacing.xl,
  },
  card: {
    borderRadius: 16,
    padding: Spacing.lg,
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
  radioPlayer: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
    marginBottom: Spacing.lg,
  },
  nowPlaying: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  stationName: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.semibold,
    color: "#FFFFFF",
    marginBottom: Spacing.xs,
  },
  stationGenre: {
    fontSize: Typography.sizes.sm,
    color: "rgba(255,255,255,0.7)",
  },
  playerControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3B82F6",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  stationList: {
    gap: Spacing.sm,
  },
  stationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  stationItemActive: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  stationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  stationInfo: {
    flex: 1,
  },
  stationItemName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: "#FFFFFF",
    marginBottom: Spacing.xs,
  },
  stationItemGenre: {
    fontSize: Typography.sizes.sm,
    color: "rgba(255,255,255,0.7)",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default function RadioScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  useEffect(() => {
    // Mock data - replace with actual API call when you provide the endpoint
    const mockStations: RadioStation[] = [
      {
        id: "1",
        name: "BBC Persian",
        genre: "News & Talk",
        url: "https://example.com/bbc-persian",
        country: "UK",
      },
      {
        id: "2",
        name: "Radio Farda",
        genre: "News & Music",
        url: "https://example.com/radio-farda",
        country: "USA",
      },
      {
        id: "3",
        name: "Deutsche Welle Persian",
        genre: "News & Culture",
        url: "https://example.com/dw-persian",
        country: "Germany",
      },
      {
        id: "4",
        name: "Radio Javan",
        genre: "Music",
        url: "https://example.com/radio-javan",
        country: "USA",
      },
    ];

    const loadStations = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('YOUR_ENDPOINT_HERE');
        // const data = await response.json();
        // setStations(data);

        // Using mock data for now
        setStations(mockStations);

        // Fade in animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.warn("Radio stations load error", error);
        setStations([]);
      } finally {
        setLoading(false);
      }
    };

    loadStations();
  }, [fadeAnim]);

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChanged = () => {
      forceUpdate();
    };

    i18n.on("languageChanged", handleLanguageChanged);

    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, [i18n]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // TODO: Implement actual audio playback logic
  };

  const handleStationSelect = (station: RadioStation) => {
    setCurrentStation(station);
    setIsPlaying(false);
    // TODO: Stop current playback and prepare new station
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container} key={i18n.language}>
      {/* Page Header */}
      <PageHeader
        title={t("home.radio")}
        showBackButton={true}
        onBackPress={() => router.back()}
        height="medium"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[{ opacity: fadeAnim }]}>
          {/* Radio Player Card */}
          <ThemedView style={styles.card}>
            <ThemedText style={styles.cardTitle}>
              {t("radio.nowPlaying")}
            </ThemedText>

            <View style={styles.radioPlayer}>
              {currentStation ? (
                <View style={styles.nowPlaying}>
                  <ThemedText style={styles.stationName}>
                    {currentStation.name}
                  </ThemedText>
                  <ThemedText style={styles.stationGenre}>
                    {currentStation.genre} • {currentStation.country}
                  </ThemedText>
                </View>
              ) : (
                <View style={styles.nowPlaying}>
                  <ThemedText style={styles.stationName}>
                    {t("radio.selectStation")}
                  </ThemedText>
                  <ThemedText style={styles.stationGenre}>
                    {t("radio.noStationSelected")}
                  </ThemedText>
                </View>
              )}

              <View style={styles.playerControls}>
                <TouchableOpacity style={styles.controlButton}>
                  <IconSymbol name="backward.fill" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.playButton}
                  onPress={handlePlayPause}
                  disabled={!currentStation}
                >
                  <IconSymbol
                    name={isPlaying ? "pause.fill" : "play.fill"}
                    size={24}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.controlButton}>
                  <IconSymbol name="forward.fill" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </ThemedView>

          {/* Stations List Card */}
          <ThemedView style={styles.card}>
            <ThemedText style={styles.cardTitle}>
              {t("radio.stations")}
            </ThemedText>

            <View style={styles.stationList}>
              {stations.map((station) => (
                <TouchableOpacity
                  key={station.id}
                  style={[
                    styles.stationItem,
                    currentStation?.id === station.id &&
                      styles.stationItemActive,
                  ]}
                  onPress={() => handleStationSelect(station)}
                >
                  <View style={styles.stationIcon}>
                    <IconSymbol name="radio" size={24} color="#3B82F6" />
                  </View>
                  <View style={styles.stationInfo}>
                    <ThemedText style={styles.stationItemName}>
                      {station.name}
                    </ThemedText>
                    <ThemedText style={styles.stationItemGenre}>
                      {station.genre} • {station.country}
                    </ThemedText>
                  </View>
                  <IconSymbol
                    name="chevron.right"
                    size={16}
                    color="rgba(255,255,255,0.5)"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ThemedView>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
