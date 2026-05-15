import React, { useState, useEffect, useCallback } from "react";
import { Text, View, ScrollView, Alert } from "react-native";
import { useDatabase } from "../../contexts/DatabaseContext";
import { PageHeader } from "../../components/ui/PageHeader";
import { GlassCard } from "../../components/ui/GlassCard";
import { SyncButton } from "../../components/ui/SyncButton";
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
    getSyncStatus,
    onSyncProgress,
    offSyncProgress,
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

  const loadSyncStatus = async () => {
    try {
      const status = await getSyncStatus();
      setSyncStatus(status);
    } catch (error) {
      console.error("Failed to load sync status:", error);
    }
  };

  const loadLocalStats = useCallback(async () => {
    try {
      const status = await getSyncStatus();
      const words = status.entityStatus.words?.count ?? 0;
      const flashcards = status.entityStatus.flashcards?.count ?? 0;
      const exams = status.entityStatus.exams?.count ?? 0;

      setLocalStats({ words, flashcards, exams });
    } catch (error) {
      console.error("Failed to load local stats:", error);
    }
  }, [getSyncStatus]);

  const handleSyncProgress = useCallback((nextProgress: any) => {
    setProgress({
      entity: nextProgress.entity,
      percentage: nextProgress.percentage,
    });
  }, []);

  // Load initial data
  useEffect(() => {
    void loadSyncStatus();
    void loadLocalStats();
  }, [loadLocalStats]);

  useEffect(() => {
    onSyncProgress(handleSyncProgress);
    return () => {
      offSyncProgress(handleSyncProgress);
    };
  }, [handleSyncProgress, offSyncProgress, onSyncProgress]);

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
      <PageHeader title="Data Sync" subtitle="Refresh local learning content from the backend" />

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
                Sync now
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
            Local content
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
              Synced entities
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
              Latest sync results
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
            How sync works
          </Text>

          <Text
            style={{
              fontSize: Typography.sizes.bodySecondary,
              color: palette.textSecondary,
              lineHeight: 22,
            }}
          >
            • The app keeps learning content locally for offline use{"\n"}• When online, sync downloads the latest words, flashcards, and exams{"\n"}• The backend controls what content is available in this release{"\n"}• Your local progress stays on the device
          </Text>
        </GlassCard>

        <View style={{ height: Spacing.lg }} />
      </ScrollView>
    </Screen>
  );
}
