import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Callout, Marker, Region } from "react-native-maps";

import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import PageHeader from "@/components/ui/page-header";
import { Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/contexts/theme-context";
import {
  fetchIranianCommunityLocations,
  type CommunityLocation,
} from "@/services/communityLocations";

const DEFAULT_REGION: Region = {
  latitude: 52.52,
  longitude: 13.405,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function CommunityMapNativeScreen() {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  // State hooks - must be called unconditionally at the top
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [locations, setLocations] = useState<CommunityLocation[]>([]);
  const [viewMode, setViewMode] = useState<"map" | "grid">("map");
  const [isLoading, setIsLoading] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const debouncedLoadDataRef = useRef<((region: Region) => void) | null>(null);
  const mapRef = useRef<MapView>(null);
  const initialDataLoadedRef = useRef(false);

  // Memoized functions using useCallback
  const loadFonts = useCallback(async () => {
    try {
      await Font.loadAsync({
        ...Ionicons.font,
      });
      setFontsLoaded(true);
    } catch (error) {
      console.error("Error loading fonts:", error);
      setFontsLoaded(true); // Continue even if font loading fails
    }
  }, []);

  const handleGetDirections = useCallback((location: CommunityLocation) => {
    try {
      const url = `https://maps.google.com/maps?q=${location.lat},${location.lon}`;
      Linking.openURL(url);
    } catch (err: any) {
      console.warn("Error opening directions:", err);
    }
  }, []);

  const loadLocationData = useCallback(async (regionToLoad: Region) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Location permission not granted");
        setIsLoading(false);
        return;
      }

      const { latitude, longitude, latitudeDelta } = regionToLoad;

      // Calculate radius based on zoom level (latitudeDelta)
      const radiusKm = Math.max(
        5,
        Math.min(20, Math.round(latitudeDelta * 111 * 0.5))
      );

      try {
        const dynamicLocations = await fetchIranianCommunityLocations(
          latitude,
          longitude,
          radiusKm
        );
        setLocations(dynamicLocations);
      } catch (error) {
        console.warn("Error loading locations:", error);
      }
    } catch (error) {
      console.warn("Error in location services:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === "map" ? "grid" : "map"));
  }, []);

  const renderGridItem = useCallback(
    ({ item }: { item: CommunityLocation }) => (
      <TouchableOpacity
        style={[
          styles.gridItem,
          {
            backgroundColor: colors.card + "0D",
            borderColor: colors.border + "1A",
          },
        ]}
        onPress={() => {
          setRegion((prev) => ({
            ...prev,
            latitude: item.lat,
            longitude: item.lon,
          }));
          setViewMode("map");
        }}
      >
        <Text
          style={{ fontWeight: "600", marginBottom: 4, color: colors.text }}
        >
          {item.name}
        </Text>
        {item.type && (
          <Text
            style={{
              fontSize: Typography.sizes.xs,
              color: colors.textMuted,
              marginBottom: 2,
            }}
          >
            {item.type}
          </Text>
        )}
        {item.address && (
          <Text
            style={{ fontSize: Typography.sizes.xs, color: colors.textMuted }}
            numberOfLines={1}
          >
            {item.address}
          </Text>
        )}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: 4,
          }}
        >
          <Text style={{ fontSize: Typography.sizes.sm }}>↗️</Text>
        </View>
      </TouchableOpacity>
    ),
    [colors.border, colors.card, colors.text, colors.textMuted]
  );

  // Initialize debounced function
  useEffect(() => {
    const debouncedLoadData = debounce((newRegion: Region) => {
      loadLocationData(newRegion);
    }, 1000); // Increase debounce time to 1 second

    debouncedLoadDataRef.current = debouncedLoadData;

    return () => {
      debouncedLoadData.cancel();
    };
  }, [loadLocationData]);

  // Initial data load
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        await loadFonts();
        if (!isMounted) return;

        // Get current position first
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.warn("Location permission not granted");
          setIsLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        if (!isMounted) return;

        // Only set region if it's the initial load
        if (!initialDataLoadedRef.current) {
          const initialRegion = {
            ...region,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          setRegion(initialRegion);
          initialDataLoadedRef.current = true;
          await loadLocationData(initialRegion);
        }
      } catch (error) {
        console.warn("Initialization error:", error);
        setIsLoading(false);
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [loadFonts, loadLocationData, region]);

  // Fade in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
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

  // Loading state
  if (isLoading || !fontsLoaded) {
    return (
      <ThemedView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </ThemedView>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background }]}
      key={i18n.language}
    >
      {/* Page Header */}
      <PageHeader
        title={t("nav.communityMap")}
        showBackButton={true}
        onBackPress={() => router.back()}
        height="medium"
      />

      {/* Toggle Button */}
      <TouchableOpacity
        style={[
          styles.toggleButton,
          {
            backgroundColor: colors.card + "B3",
            borderColor: colors.border + "4D",
          },
        ]}
        onPress={toggleViewMode}
        activeOpacity={0.7}
      >
        <Ionicons
          name={viewMode === "map" ? "grid-outline" : "map-outline"}
          size={24}
          color={colors.text}
        />
      </TouchableOpacity>

      {isLoadingMore && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      )}

      {viewMode === "map" ? (
        <ThemedView style={styles.mapCard}>
          <MapView
            ref={mapRef}
            style={styles.map}
            region={region}
            onRegionChangeComplete={(newRegion) => {
              // Add additional checks to prevent excessive calls
              if (isLoadingMore) return; // Don't trigger if already loading

              const isSignificantChange =
                Math.abs(newRegion.latitude - region.latitude) > 0.001 || // Increase threshold
                Math.abs(newRegion.longitude - region.longitude) > 0.001 ||
                Math.abs(newRegion.latitudeDelta - region.latitudeDelta) >
                  0.02 ||
                Math.abs(newRegion.longitudeDelta - region.longitudeDelta) >
                  0.02;

              if (isSignificantChange && debouncedLoadDataRef.current) {
                setRegion(newRegion);
                setIsLoadingMore(true);
                debouncedLoadDataRef.current(newRegion);
              }
            }}
            showsUserLocation
            showsMyLocationButton={false}
          >
            {locations.map((place) => (
              <Marker
                key={place.id}
                coordinate={{ latitude: place.lat, longitude: place.lon }}
              >
                <Callout
                  onPress={() => {
                    const lat = place.lat;
                    const lon = place.lon;
                    const label = encodeURIComponent(place.name);

                    const webUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}&query_place_id=${label}`;
                    console.log("🧭 Opening maps URL:", webUrl);
                    Linking.openURL(webUrl).catch((err) => {
                      console.log("🧭 Map open error", err);
                    });
                  }}
                >
                  <View style={{ maxWidth: 240 }}>
                    <Text style={{ fontWeight: "600", marginBottom: 4 }}>
                      {place.name}
                    </Text>
                    {place.type ? (
                      <Text
                        style={{
                          fontSize: Typography.sizes.xs,
                          marginBottom: 2,
                        }}
                      >
                        {place.type}
                      </Text>
                    ) : null}
                    {place.address ? (
                      <Text
                        style={{
                          fontSize: Typography.sizes.xs,
                          marginBottom: 8,
                        }}
                      >
                        {place.address}
                      </Text>
                    ) : null}
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
        </ThemedView>
      ) : (
        <FlatList
          data={locations}
          renderItem={renderGridItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#000000", // Remove hardcoded color
    padding: 16,
    gap: 8,
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
    // color: colors.text, // Use theme color in JSX instead
    flex: 1,
    textAlign: "center",
    marginHorizontal: Spacing.sm,
    marginTop: -35,
  },
  backButtonOnly: {
    position: "absolute",
    top: 20, // Move to top
    left: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    // backgroundColor: "rgba(0,0,0,0.7)", // Apply dynamically with theme
    borderWidth: 1,
    // borderColor: "rgba(255,255,255,0.3)", // Apply dynamically with theme
    alignItems: "center",
    justifyContent: "center",
    zIndex: 30,
  },
  headerSpacer: {
    width: 36,
    height: 36,
  },
  mapCard: {
    marginTop: 70, // Move down 10px
    borderRadius: 16,
    overflow: "hidden",
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  mapContainer: {
    flex: 1,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  toggleButton: {
    position: "absolute",
    top: 20, // Move to top
    right: 20,
    // backgroundColor: "rgba(0,0,0,0.7)", // Apply dynamically with theme
    borderRadius: 20,
    padding: 10,
    elevation: 4,
    zIndex: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 1,
    // borderColor: "rgba(255,255,255,0.3)", // Apply dynamically with theme
  },
  gridContainer: {
    padding: 4,
    paddingTop: 120, // Reduced since no header
  },
  loadingOverlay: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  gridItem: {
    // backgroundColor: "rgba(255,255,255,0.05)", // Apply dynamically with theme
    borderRadius: 12,
    padding: 12,
    margin: 4,
    flex: 1,
    minWidth: "47%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    // borderColor: "rgba(255,255,255,0.1)", // Apply dynamically with theme
  },
});
