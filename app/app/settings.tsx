import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Colors, Spacing, Typography } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Screen } from "../components/ui/Screen";
import { GlassCard } from "../components/ui/GlassCard";
import { PageHeader } from "../components/ui/PageHeader";
import { SyncButton } from "../components/ui/SyncButton";
import { usePreferences } from "../contexts/PreferencesContext";
import { useDatabase } from "../contexts/DatabaseContext";
import { homeShortcuts } from "../services/homeShortcuts";
import { getJson, setJson } from "../services/localStore";

const GERMAN_STATES = [
  "Baden-Württemberg",
  "Bayern",
  "Berlin",
  "Brandenburg",
  "Bremen",
  "Hamburg",
  "Hessen",
  "Mecklenburg-Vorpommern",
  "Niedersachsen",
  "Nordrhein-Westfalen",
  "Rheinland-Pfalz",
  "Saarland",
  "Sachsen",
  "Sachsen-Anhalt",
  "Schleswig-Holstein",
  "Thüringen",
] as const;

type NominatimResult = {
  display_name?: string;
  lat?: string;
  lon?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
};

function pickCityName(r: NominatimResult): string {
  return r.address?.city ?? r.address?.town ?? r.address?.village ?? "";
}

async function nominatimSearch(query: string): Promise<NominatimResult[]> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "10");

  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Search failed");
  }

  return (await res.json()) as NominatimResult[];
}

export default function SettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { location, setLocation, useDeviceLocation, setUseDeviceLocation } =
    usePreferences();
  const {
    isOnline,
    isSyncing,
    lastSync,
    isInitialized,
    getSyncStatus,
    getWords,
    getFlashcards,
    getExams,
    fullSync,
    getCurrentDatabaseVersion,
    checkForDatabaseUpdates,
    syncDatabaseVersion,
  } = useDatabase();

  const [selectedState, setSelectedState] = useState<string>(
    location?.state ?? ""
  );
  const [query, setQuery] = useState<string>(
    location?.postalCode ?? location?.city ?? ""
  );
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dbStats, setDbStats] = useState({ words: 0, flashcards: 0, exams: 0 });
  const [dbVersion, setDbVersion] = useState<any>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateCheckResult, setUpdateCheckResult] = useState<any>(null);
  const [homeShortcutState, setHomeShortcutState] = useState<Record<
    string,
    boolean
  >>({});

  React.useEffect(() => {
    const load = async () => {
      const defaults = homeShortcuts.reduce<Record<string, boolean>>(
        (acc, item) => {
          acc[item.key] = true;
          return acc;
        },
        {}
      );
      const stored = await getJson<Record<string, boolean>>(
        "home_shortcuts",
        defaults
      );
      setHomeShortcutState(stored);
    };

    load();
  }, []);

  // Load database stats when initialized
  React.useEffect(() => {
    if (isInitialized && isOnline) {
      const loadData = async () => {
        try {
          const [words, flashcards, exams, currentVersion] = await Promise.all([
            getWords(undefined, undefined, 1000), // Get count up to 1000
            getFlashcards(undefined, undefined, false, 1000),
            getExams(undefined, undefined, true, 1000),
            getCurrentDatabaseVersion(),
          ]);

          setDbStats({
            words: words.length,
            flashcards: flashcards.length,
            exams: exams.length,
          });

          setDbVersion(currentVersion);

          // Check for updates
          const updateResult = await checkForDatabaseUpdates();
          setUpdateCheckResult(updateResult);
          setUpdateAvailable(updateResult.hasUpdate);

          // Log the reason for debugging
          if (
            !updateResult.hasUpdate &&
            updateResult.reason !== "Already up to date"
          ) {
            console.log("Update check reason:", updateResult.reason);
          }
        } catch (err) {
          console.error("Failed to load database data:", err);
        }
      };

      loadData();
    }
  }, [
    isInitialized,
    isOnline,
    getWords,
    getFlashcards,
    getExams,
    getCurrentDatabaseVersion,
    checkForDatabaseUpdates,
  ]);

  const stateOptions = useMemo(() => GERMAN_STATES.slice(), []);

  async function runSearch() {
    const q = query.trim();
    if (!q) return;

    try {
      setError(null);
      setLoading(true);

      const statePart = selectedState ? `, ${selectedState}` : "";
      const fullQuery = `${q}${statePart}, Germany`;
      const r = await nominatimSearch(fullQuery);
      setResults(
        r.filter((x) => x.address?.country?.toLowerCase() === "germany")
      );
    } catch {
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function applyResult(r: NominatimResult) {
    const city = pickCityName(r);
    const state = r.address?.state ?? selectedState;
    const postalCode = r.address?.postcode ?? "";
    const lat = r.lat ? Number(r.lat) : undefined;
    const lon = r.lon ? Number(r.lon) : undefined;

    setLocation({
      state: state || "",
      city: city || "",
      postalCode,
      lat,
      lon,
      source: "manual",
    });
  }

  async function enablePhoneLocation() {
    try {
      setError(null);
      setLoading(true);

      const perm = await Location.requestForegroundPermissionsAsync();
      if (perm.status !== "granted") {
        setError("Location permission was not granted.");
        setUseDeviceLocation(false);
        return;
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const rev = await Location.reverseGeocodeAsync({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });

      const first = rev[0];
      const city = (first?.city ||
        first?.subregion ||
        first?.region ||
        "") as string;
      const state = (first?.region || "") as string;
      const postalCode = (first?.postalCode || "") as string;

      setLocation({
        state,
        city,
        postalCode,
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        source: "device",
      });

      setUseDeviceLocation(true);
    } catch {
      setError("Could not read your location. Please try again.");
      setUseDeviceLocation(false);
    } finally {
      setLoading(false);
    }
  }

  function disablePhoneLocation() {
    setUseDeviceLocation(false);
    if (location?.source === "device") {
      setLocation(null);
    }
  }

  function toggleHomeShortcut(key: string) {
    const next = {
      ...homeShortcutState,
      [key]: homeShortcutState[key] === false ? true : !homeShortcutState[key],
    };
    setHomeShortcutState(next);
    void setJson("home_shortcuts", next);
  }

  return (
    <Screen>
      <PageHeader
        title="Settings"
        subtitle="Location in Germany"
        onBackPress={() => router.back()}
      />

      <GlassCard>
        <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>
          Use phone location
        </Text>
        <Text style={[styles.sectionHint, { color: palette.textSecondary }]}>
          Enable to show local jobs, events, and documents near you.
        </Text>

        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: palette.textPrimary }]}>
            Use device location
          </Text>
          <Pressable
            onPress={() => {
              if (useDeviceLocation) {
                disablePhoneLocation();
              } else {
                void enablePhoneLocation();
              }
            }}
            accessibilityRole="switch"
            accessibilityState={{ checked: useDeviceLocation }}
            style={({ pressed }) => [
              styles.toggle,
              {
                backgroundColor: useDeviceLocation
                  ? palette.accentGreen
                  : "rgba(255,255,255,0.20)",
                borderColor: useDeviceLocation
                  ? palette.accentGreen
                  : palette.borderLight,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <View
              style={[
                styles.knob,
                {
                  transform: [{ translateX: useDeviceLocation ? 18 : 0 }],
                  backgroundColor: palette.white,
                },
              ]}
            />
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator />
            <Text
              style={[styles.loadingText, { color: palette.textSecondary }]}
            >
              Working…
            </Text>
          </View>
        ) : null}

        {location ? (
          <View style={styles.currentBox}>
            <Text style={[styles.currentTitle, { color: palette.textPrimary }]}>
              Current
            </Text>
            <Text
              style={[styles.currentValue, { color: palette.textSecondary }]}
              numberOfLines={2}
            >
              {location.city ? `${location.city}, ` : ""}
              {location.state}
              {location.postalCode ? ` · ${location.postalCode}` : ""}
            </Text>
            <Text style={[styles.currentMeta, { color: palette.textMuted }]}>
              Source: {location.source}
            </Text>
          </View>
        ) : null}

        {error ? (
          <Text style={[styles.error, { color: palette.error }]}>{error}</Text>
        ) : null}
      </GlassCard>

      <GlassCard>
        <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>
          Set my city
        </Text>
        <Text style={[styles.sectionHint, { color: palette.textSecondary }]}>
          Choose your Bundesland, then search by city name or postal code (PLZ).
        </Text>

        <View style={styles.stateRow}>
          <Text style={[styles.fieldLabel, { color: palette.textSecondary }]}>
            State
          </Text>
          <View style={styles.stateGrid}>
            {stateOptions.map((st) => {
              const active = st === selectedState;
              return (
                <Pressable
                  key={st}
                  onPress={() => setSelectedState(active ? "" : st)}
                  accessibilityRole="button"
                  accessibilityLabel={st}
                  style={({ pressed }) => [
                    styles.stateChip,
                    {
                      borderColor: active
                        ? palette.primary
                        : palette.borderLight,
                      backgroundColor: active
                        ? "rgba(31,58,95,0.12)"
                        : "rgba(255,255,255,0.18)",
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: Typography.sizes.caption,
                      fontWeight: Typography.fontWeight.semibold,
                      color: active ? palette.primary : palette.textPrimary,
                    }}
                    numberOfLines={1}
                  >
                    {st}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Text style={[styles.fieldLabel, { color: palette.textSecondary }]}>
          City / postal code
        </Text>
        <View
          style={[
            styles.inputRow,
            {
              borderColor: palette.borderLight,
              backgroundColor:
                colorScheme === "dark"
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(255,255,255,0.35)",
            },
          ]}
        >
          <Feather name="search" size={16} color={palette.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="e.g. Berlin, 10115"
            placeholderTextColor={palette.textMuted}
            style={[styles.input, { color: palette.textPrimary }]}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={() => void runSearch()}
          />
          <Pressable
            onPress={() => void runSearch()}
            accessibilityRole="button"
            accessibilityLabel="Search"
            style={({ pressed }) => [
              styles.searchBtn,
              { opacity: pressed ? 0.75 : 1 },
            ]}
          >
            <Text style={[styles.searchText, { color: palette.primary }]}>
              Search
            </Text>
          </Pressable>
        </View>

        {results.length ? (
          <View style={styles.results}>
            {results.map((r, idx) => {
              const city = pickCityName(r);
              const state = r.address?.state ?? "";
              const plz = r.address?.postcode ?? "";

              return (
                <Pressable
                  key={`${r.lat ?? ""}-${r.lon ?? ""}-${idx}`}
                  onPress={() => applyResult(r)}
                  accessibilityRole="button"
                  accessibilityLabel={r.display_name ?? "Result"}
                  style={({ pressed }) => [
                    styles.resultRow,
                    {
                      borderColor: palette.borderLight,
                      backgroundColor:
                        colorScheme === "dark"
                          ? "rgba(255,255,255,0.04)"
                          : "rgba(255,255,255,0.22)",
                      opacity: pressed ? 0.85 : 1,
                    },
                  ]}
                >
                  <View style={styles.resultText}>
                    <Text
                      style={[
                        styles.resultTitle,
                        { color: palette.textPrimary },
                      ]}
                    >
                      {city || r.display_name || "Unknown"}
                    </Text>
                    <Text
                      style={[
                        styles.resultSubtitle,
                        { color: palette.textSecondary },
                      ]}
                      numberOfLines={2}
                    >
                      {state}
                      {plz ? ` · ${plz}` : ""}
                    </Text>
                  </View>
                  <Feather
                    name="chevron-right"
                    size={18}
                    color={palette.textMuted}
                  />
                </Pressable>
              );
            })}
          </View>
        ) : null}
      </GlassCard>

      <GlassCard>
        <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>
          Home screen shortcuts
        </Text>
        <Text style={[styles.sectionHint, { color: palette.textSecondary }]}>
          Choose which features show on the Home page.
        </Text>

        <View style={styles.shortcutList}>
          {homeShortcuts.map((item) => {
            const enabled = homeShortcutState[item.key] !== false;
            return (
              <View key={item.key} style={styles.shortcutRow}>
                <View style={styles.shortcutText}>
                  <Text
                    style={[
                      styles.shortcutTitle,
                      { color: palette.textPrimary },
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.shortcutSubtitle,
                      { color: palette.textSecondary },
                    ]}
                  >
                    {item.subtitle}
                  </Text>
                </View>
                <Pressable
                  onPress={() => toggleHomeShortcut(item.key)}
                  accessibilityRole="switch"
                  accessibilityState={{ checked: enabled }}
                  style={({ pressed }) => [
                    styles.toggle,
                    {
                      backgroundColor: enabled
                        ? palette.accentGreen
                        : "rgba(255,255,255,0.20)",
                      borderColor: enabled
                        ? palette.accentGreen
                        : palette.borderLight,
                      opacity: pressed ? 0.85 : 1,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.knob,
                      {
                        transform: [{ translateX: enabled ? 18 : 0 }],
                        backgroundColor: palette.white,
                      },
                    ]}
                  />
                </Pressable>
              </View>
            );
          })}
        </View>
      </GlassCard>

      {/* Database Information Section */}
      <GlassCard style={{ marginTop: Spacing.md }}>
        <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>
          Database & Sync
        </Text>
        <Text style={[styles.sectionHint, { color: palette.textSecondary }]}>
          Manage your offline content and sync with the server.
        </Text>

        {/* Sync Status */}
        <View style={styles.dbStatusRow}>
          <View style={styles.dbStatusLeft}>
            <Text
              style={[styles.dbStatusLabel, { color: palette.textPrimary }]}
            >
              Connection
            </Text>
            <Text
              style={[styles.dbStatusValue, { color: palette.textSecondary }]}
            >
              {isOnline ? "Online" : "Offline"}
            </Text>
          </View>
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: isOnline ? palette.success : palette.error,
            }}
          />
        </View>

        {/* Database Version */}
        <View style={styles.dbStatusRow}>
          <View style={styles.dbStatusLeft}>
            <Text
              style={[styles.dbStatusLabel, { color: palette.textPrimary }]}
            >
              Database Version
            </Text>
            <Text
              style={[styles.dbStatusValue, { color: palette.textSecondary }]}
            >
              {dbVersion
                ? `v${dbVersion.version} (Build ${dbVersion.buildNumber})`
                : "Unknown"}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: Spacing.xs,
            }}
          >
            {updateCheckResult &&
              updateCheckResult.reason === "Backend server unavailable" && (
                <View
                  style={{
                    backgroundColor: palette.error,
                    paddingHorizontal: 6,
                    paddingVertical: 3,
                    borderRadius: 6,
                  }}
                >
                  <Text
                    style={{
                      fontSize: Typography.sizes.bodySmall,
                      color: palette.white,
                      fontWeight: "600",
                    }}
                  >
                    Offline
                  </Text>
                </View>
              )}
            {updateAvailable && (
              <View
                style={{
                  backgroundColor: palette.primary,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: Typography.sizes.bodySmall,
                    color: palette.white,
                    fontWeight: "600",
                  }}
                >
                  Update
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Database Stats */}
        <View style={styles.dbStatsRow}>
          <Text style={[styles.dbStatsLabel, { color: palette.textPrimary }]}>
            Local Content
          </Text>
          <View style={styles.dbStatsNumbers}>
            <Text style={[styles.dbStatNumber, { color: palette.primary }]}>
              {isInitialized
                ? dbStats.words + dbStats.flashcards + dbStats.exams
                : "---"}
            </Text>
            <Text
              style={[styles.dbStatLabel, { color: palette.textSecondary }]}
            >
              items
            </Text>
          </View>
        </View>

        {/* Last Sync */}
        <View style={styles.dbStatusRow}>
          <View style={styles.dbStatusLeft}>
            <Text
              style={[styles.dbStatusLabel, { color: palette.textPrimary }]}
            >
              Last Sync
            </Text>
            <Text
              style={[styles.dbStatusValue, { color: palette.textSecondary }]}
            >
              {lastSync > 0 ? formatTimestamp(lastSync) : "Never"}
            </Text>
          </View>
          <SyncButton size="small" />
        </View>

        {/* Update Available Section */}
        {updateAvailable && updateCheckResult && (
          <GlassCard
            style={{
              marginTop: Spacing.md,
              backgroundColor: "rgba(79, 70, 229, 0.1)",
              borderColor: "rgba(79, 70, 229, 0.3)",
            }}
          >
            <Text style={[styles.sectionTitle, { color: palette.primary }]}>
              Database Update Available
            </Text>
            <Text
              style={[styles.sectionHint, { color: palette.textSecondary }]}
            >
              New version {updateCheckResult.latestVersion.version} is available
            </Text>

            {updateCheckResult.latestVersion.changelog.length > 0 && (
              <View style={{ marginTop: Spacing.sm }}>
                <Text
                  style={[styles.dbStatusLabel, { color: palette.textPrimary }]}
                >
                  What's new:
                </Text>
                {updateCheckResult.latestVersion.changelog.map(
                  (item: string, index: number) => (
                    <Text
                      key={index}
                      style={[
                        styles.dbStatusValue,
                        { color: palette.textSecondary, marginTop: 2 },
                      ]}
                    >
                      • {item}
                    </Text>
                  )
                )}
              </View>
            )}

            <View style={styles.updateButtonsRow}>
              <Pressable
                onPress={async () => {
                  if (isOnline && !isSyncing) {
                    const success = await syncDatabaseVersion();
                    if (success) {
                      // Refresh data
                      const currentVersion = await getCurrentDatabaseVersion();
                      setDbVersion(currentVersion);
                      setUpdateAvailable(false);
                      setUpdateCheckResult(null);
                    }
                  }
                }}
                disabled={!isOnline || isSyncing}
                style={({ pressed }) => [
                  styles.updateButton,
                  {
                    backgroundColor: palette.primary,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text
                  style={[styles.updateButtonText, { color: palette.white }]}
                >
                  {isSyncing ? "Updating..." : "Update Now"}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setUpdateAvailable(false);
                  setUpdateCheckResult(null);
                }}
                style={({ pressed }) => [
                  styles.updateButton,
                  {
                    backgroundColor: "transparent",
                    borderWidth: 1,
                    borderColor: palette.borderLight,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.updateButtonText,
                    { color: palette.textSecondary },
                  ]}
                >
                  Dismiss
                </Text>
              </Pressable>
            </View>
          </GlassCard>
        )}

        {/* Manual Sync Button */}
        <View style={styles.syncButtonRow}>
          <Pressable
            onPress={() => {
              if (isOnline && !isSyncing) {
                fullSync()
                  .then((results) => {
                    const success = results.every((r) => r.success);
                    if (success) {
                      const totalSynced = results.reduce(
                        (sum, r) => sum + r.syncedCount,
                        0
                      );
                      console.log(`Synced ${totalSynced} items successfully`);
                    } else {
                      console.log("Some items failed to sync");
                    }
                  })
                  .catch((err) => {
                    console.error("Sync failed:", err);
                  });
              }
            }}
            disabled={!isOnline || isSyncing}
            style={({ pressed }) => [
              styles.syncButton,
              {
                backgroundColor: isOnline
                  ? isSyncing
                    ? palette.textMuted
                    : palette.primary
                  : palette.textMuted,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.syncButtonText,
                { color: isOnline ? palette.white : palette.textSecondary },
              ]}
            >
              {isSyncing ? "Syncing..." : "Manual Sync"}
            </Text>
          </Pressable>
        </View>

        {/* Test Update Button (for development) */}
        {__DEV__ && (
          <View style={styles.syncButtonRow}>
            <Pressable
              onPress={() => {
                // Simulate an update for testing
                setUpdateCheckResult({
                  hasUpdate: true,
                  isForced: false,
                  currentVersion: "1.0.0",
                  latestVersion: {
                    version: "1.1.0",
                    buildNumber: 2,
                    isPublished: true,
                    isForced: false,
                    description: "Test update with new vocabulary words",
                    changelog: [
                      "Added 50 new German vocabulary words",
                      "Improved flashcard algorithm",
                      "Fixed sync issues",
                    ],
                    releaseDate: new Date().toISOString(),
                    minAppVersion: "1.0.0",
                    dataStats: {
                      words: 150,
                      flashcards: 75,
                      exams: 10,
                      exercises: 25,
                    },
                  },
                  appVersionCompatible: true,
                  reason: "Test update triggered manually",
                });
                setUpdateAvailable(true);
              }}
              style={({ pressed }) => [
                styles.syncButton,
                {
                  backgroundColor: palette.warning,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text style={[styles.syncButtonText, { color: palette.white }]}>
                Test Update UI
              </Text>
            </Pressable>
          </View>
        )}
      </GlassCard>
    </Screen>
  );
}

// Helper function to format timestamp
function formatTimestamp(timestamp: number): string {
  if (timestamp === 0) return "Never";

  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) {
    return "Just now";
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else {
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: Typography.sizes.headingM,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
  },
  sectionHint: {
    fontSize: Typography.sizes.bodySecondary,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
  },
  toggleLabel: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.fontWeight.semibold,
  },
  toggle: {
    width: 46,
    height: 28,
    borderRadius: 999,
    borderWidth: 1,
    padding: 4,
    justifyContent: "center",
  },
  knob: {
    width: 20,
    height: 20,
    borderRadius: 999,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  loadingText: {
    fontSize: Typography.sizes.bodySecondary,
  },
  currentBox: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
  },
  currentTitle: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.fontWeight.semibold,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  currentValue: {
    marginTop: Spacing.xs,
    fontSize: Typography.sizes.bodySecondary,
    lineHeight: 22,
  },
  currentMeta: {
    marginTop: Spacing.sm,
    fontSize: Typography.sizes.caption,
  },
  error: {
    marginTop: Spacing.md,
    fontSize: Typography.sizes.bodySecondary,
  },
  stateRow: {
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    fontSize: Typography.sizes.bodySecondary,
    marginBottom: Spacing.sm,
  },
  stateGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  stateChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    maxWidth: "100%",
  },
  shortcutList: {
    gap: Spacing.sm,
  },
  shortcutRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
  },
  shortcutText: {
    flex: 1,
  },
  shortcutTitle: {
    fontSize: Typography.sizes.bodySecondary,
    fontWeight: Typography.fontWeight.semibold,
  },
  shortcutSubtitle: {
    marginTop: 2,
    fontSize: Typography.sizes.bodySmall,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: Typography.sizes.body,
    paddingVertical: 0,
  },
  searchBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  searchText: {
    fontSize: Typography.sizes.bodySecondary,
    fontWeight: Typography.fontWeight.semibold,
  },
  results: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  // Database section styles
  dbStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.10)",
  },
  dbStatusLeft: {
    flex: 1,
  },
  dbStatusLabel: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.fontWeight.semibold,
  },
  dbStatusValue: {
    fontSize: Typography.sizes.bodySecondary,
    marginTop: 2,
  },
  dbStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.10)",
  },
  dbStatsLabel: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.fontWeight.semibold,
  },
  dbStatsNumbers: {
    alignItems: "flex-end",
  },
  dbStatNumber: {
    fontSize: Typography.sizes.headingL,
    fontWeight: Typography.fontWeight.bold,
  },
  dbStatLabel: {
    fontSize: Typography.sizes.bodySmall,
    marginTop: 2,
  },
  syncButtonRow: {
    marginTop: Spacing.md,
  },
  syncButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 14,
    alignItems: "center",
  },
  syncButtonText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.fontWeight.semibold,
  },
  updateButtonsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  updateButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 14,
    alignItems: "center",
  },
  updateButtonText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.fontWeight.semibold,
  },
  resultText: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  resultTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: 22,
  },
  resultSubtitle: {
    marginTop: 2,
    fontSize: Typography.sizes.bodySecondary,
    lineHeight: 20,
  },
});
