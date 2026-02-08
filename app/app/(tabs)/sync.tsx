import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { useDatabase } from "../../contexts/DatabaseContext";
import { PageHeader } from "../../components/ui/PageHeader";
import { GlassCard } from "../../components/ui/GlassCard";
import { SyncButton } from "../../components/ui/SyncButton";
import { Button } from "../../components/ui/Button";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { Screen } from "../../components/ui/Screen";

interface SyncResult {
  entityType: string;
  success: boolean;
  syncedCount: number;
  error?: string;
  timestamp: number;
}

export default function SyncScreen() {
  const {
    isOnline,
    isSyncing,
    fullSync,
    getSyncStatus,
    onSyncProgress,
    offSyncProgress,
    getWords,
    getFlashcards,
    getExams,
  } = useDatabase();

  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [localStats, setLocalStats] = useState({
    words: 0,
    flashcards: 0,
    exams: 0,
  });
  const [lastSyncResults, setLastSyncResults] = useState<SyncResult[]>([]);
  const [progress, setProgress] = useState<{
    entity: string;
    percentage: number;
  } | null>(null);

  // Load initial data
  useEffect(() => {
    loadSyncStatus();
    loadLocalStats();
  }, []);

  const loadSyncStatus = async () => {
    try {
      const status = await getSyncStatus();
      setSyncStatus(status);
    } catch (error) {
      console.error("Failed to load sync status:", error);
    }
  };

  const loadLocalStats = async () => {
    try {
      const [words, flashcards, exams] = await Promise.all([
        getWords(undefined, undefined, 1), // Just get count
        getFlashcards(undefined, undefined, false, 1),
        getExams(undefined, undefined, true, 1),
      ]);

      setLocalStats({
        words: words.length,
        flashcards: flashcards.length,
        exams: exams.length,
      });
    } catch (error) {
      console.error("Failed to load local stats:", error);
    }
  };

  const handleSyncProgress = (progress: any) => {
    setProgress({
      entity: progress.entity,
      percentage: progress.percentage,
    });
  };

  const handleSyncComplete = async (
    success: boolean,
    results?: SyncResult[]
  ) => {
    setProgress(null);

    if (results) {
      setLastSyncResults(results);
    }

    // Reload status and stats
    await Promise.all([loadSyncStatus(), loadLocalStats()]);

    if (success) {
      const totalSynced =
        results?.reduce((sum, r) => sum + r.syncedCount, 0) || 0;
      Alert.alert("Sync Complete", `Successfully synced ${totalSynced} items.`);
    } else {
      Alert.alert(
        "Sync Failed",
        "Some items failed to sync. Check the results below."
      );
    }
  };

  const formatTimestamp = (timestamp: number) => {
    if (timestamp === 0) return "Never";

    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) {
      return "Just now";
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} days ago`;
    }
  };

  return (
    <Screen>
      <PageHeader title="Data Sync" subtitle="Manage offline content" />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Connection Status */}
        <GlassCard style={{ marginBottom: Spacing.md }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: Typography.sizes.body,
                  color: palette.textPrimary,
                  fontWeight: "600",
                }}
              >
                Connection Status
              </Text>
              <Text
                style={{
                  fontSize: Typography.sizes.bodySecondary,
                  color: palette.textSecondary,
                  marginTop: 2,
                }}
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
        </GlassCard>

        {/* Sync Controls */}
        <GlassCard style={{ marginBottom: Spacing.md }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: Typography.sizes.body,
                  color: palette.textPrimary,
                  fontWeight: "600",
                }}
              >
                Manual Sync
              </Text>
              <Text
                style={{
                  fontSize: Typography.sizes.bodySecondary,
                  color: palette.textSecondary,
                  marginTop: 2,
                }}
              >
                Last sync:{" "}
                {syncStatus ? formatTimestamp(syncStatus.lastSync) : "Never"}
              </Text>
            </View>

            <SyncButton size="large" onSyncComplete={handleSyncComplete} />
          </View>

          {progress && (
            <View style={{ marginTop: Spacing.md }}>
              <Text
                style={{
                  fontSize: Typography.sizes.bodySecondary,
                  color: palette.textSecondary,
                }}
              >
                Syncing {progress.entity}... {progress.percentage}%
              </Text>
              <View
                style={{
                  height: 4,
                  backgroundColor: palette.borderLight,
                  borderRadius: 2,
                  marginTop: Spacing.xs,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: `${progress.percentage}%`,
                    backgroundColor: palette.primary,
                    borderRadius: 2,
                  }}
                />
              </View>
            </View>
          )}
        </GlassCard>

        {/* Local Database Stats */}
        <GlassCard style={{ marginBottom: Spacing.md }}>
          <Text
            style={{
              fontSize: Typography.sizes.body,
              color: palette.textPrimary,
              fontWeight: "600",
              marginBottom: Spacing.sm,
            }}
          >
            Local Database
          </Text>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ alignItems: "center", flex: 1 }}>
              <Text
                style={{
                  fontSize: Typography.sizes.headingL,
                  color: palette.primary,
                  fontWeight: "bold",
                }}
              >
                {localStats.words}
              </Text>
              <Text
                style={{
                  fontSize: Typography.sizes.bodySmall,
                  color: palette.textSecondary,
                }}
              >
                Words
              </Text>
            </View>

            <View style={{ alignItems: "center", flex: 1 }}>
              <Text
                style={{
                  fontSize: Typography.sizes.headingL,
                  color: palette.primary,
                  fontWeight: "bold",
                }}
              >
                {localStats.flashcards}
              </Text>
              <Text
                style={{
                  fontSize: Typography.sizes.bodySmall,
                  color: palette.textSecondary,
                }}
              >
                Flashcards
              </Text>
            </View>

            <View style={{ alignItems: "center", flex: 1 }}>
              <Text
                style={{
                  fontSize: Typography.sizes.headingL,
                  color: palette.primary,
                  fontWeight: "bold",
                }}
              >
                {localStats.exams}
              </Text>
              <Text
                style={{
                  fontSize: Typography.sizes.bodySmall,
                  color: palette.textSecondary,
                }}
              >
                Exams
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Entity Sync Status */}
        {syncStatus && (
          <GlassCard style={{ marginBottom: Spacing.md }}>
            <Text
              style={{
                fontSize: Typography.sizes.body,
                color: palette.textPrimary,
                fontWeight: "600",
                marginBottom: Spacing.sm,
              }}
            >
              Entity Sync Status
            </Text>

            {Object.entries(syncStatus.entityStatus).map(([entity, status]) => {
              const statusData = status as {
                lastSync: number;
                count: number;
                version: string;
              } | null;
              return (
                <View
                  key={entity}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: Spacing.xs,
                    borderBottomWidth: 1,
                    borderBottomColor: palette.borderLight,
                  }}
                >
                  <Text
                    style={{
                      fontSize: Typography.sizes.bodySecondary,
                      color: palette.textPrimary,
                    }}
                  >
                    {entity.charAt(0).toUpperCase() + entity.slice(1)}
                  </Text>

                  {statusData ? (
                    <View style={{ alignItems: "flex-end" }}>
                      <Text
                        style={{
                          fontSize: Typography.sizes.bodySmall,
                          color: palette.textSecondary,
                        }}
                      >
                        {statusData.count} items
                      </Text>
                      <Text
                        style={{
                          fontSize: Typography.sizes.bodySmall,
                          color: palette.textMuted,
                        }}
                      >
                        {formatTimestamp(statusData.lastSync)}
                      </Text>
                    </View>
                  ) : (
                    <Text
                      style={{
                        fontSize: Typography.sizes.bodySmall,
                        color: palette.textMuted,
                      }}
                    >
                      Not synced
                    </Text>
                  )}
                </View>
              );
            })}
          </GlassCard>
        )}

        {/* Last Sync Results */}
        {lastSyncResults.length > 0 && (
          <GlassCard style={{ marginBottom: Spacing.md }}>
            <Text
              style={{
                fontSize: Typography.sizes.body,
                color: palette.textPrimary,
                fontWeight: "600",
                marginBottom: Spacing.sm,
              }}
            >
              Last Sync Results
            </Text>

            {lastSyncResults.map((result, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: Spacing.xs,
                  borderBottomWidth: index < lastSyncResults.length - 1 ? 1 : 0,
                  borderBottomColor: palette.borderLight,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: result.success
                        ? palette.success
                        : palette.error,
                      marginRight: Spacing.sm,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: Typography.sizes.bodySecondary,
                      color: palette.textPrimary,
                    }}
                  >
                    {result.entityType.charAt(0).toUpperCase() +
                      result.entityType.slice(1)}
                  </Text>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={{
                      fontSize: Typography.sizes.bodySmall,
                      color: palette.textSecondary,
                    }}
                  >
                    {result.syncedCount} items
                  </Text>
                  {result.error && (
                    <Text
                      style={{
                        fontSize: Typography.sizes.bodySmall,
                        color: palette.error,
                      }}
                    >
                      Failed
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </GlassCard>
        )}

        {/* Instructions */}
        <GlassCard style={{ marginBottom: Spacing.lg }}>
          <Text
            style={{
              fontSize: Typography.sizes.body,
              color: palette.textPrimary,
              fontWeight: "600",
              marginBottom: Spacing.sm,
            }}
          >
            How Sync Works
          </Text>

          <Text
            style={{
              fontSize: Typography.sizes.bodySecondary,
              color: palette.textSecondary,
              lineHeight: 22,
            }}
          >
            • The app stores content locally for offline use{"\n"}• When online,
            sync downloads the latest content from the server{"\n"}• Sync
            includes words, flashcards, and exams{"\n"}• Your progress and
            settings are always saved locally
          </Text>
        </GlassCard>

        <View style={{ height: Spacing.lg }} />
      </ScrollView>
    </Screen>
  );
}
