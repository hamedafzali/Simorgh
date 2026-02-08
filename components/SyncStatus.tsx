import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useTheme } from "../hooks/use-theme";
import { useSync } from "../hooks/use-sync";
import { Ionicons } from "@expo/vector-icons";

export const SyncStatus: React.FC = () => {
  const { theme } = useTheme();
  const {
    isOnline,
    isSyncing,
    queueStats,
    forceSyncAll,
    clearFailedSyncs,
    retryFailedSyncs,
  } = useSync();

  const getStatusColor = () => {
    if (!isOnline) return theme.error;
    if (isSyncing) return theme.warning;
    if (queueStats.pending > 0) return theme.warning;
    if (queueStats.failed > 0) return theme.error;
    return theme.success;
  };

  const getStatusText = () => {
    if (!isOnline) return "Offline";
    if (isSyncing) return "Syncing...";
    if (queueStats.pending > 0) return `Syncing ${queueStats.pending} items`;
    if (queueStats.failed > 0) return `${queueStats.failed} failed`;
    return "Synced";
  };

  const getStatusIcon = () => {
    if (!isOnline) return "wifi-off-outline";
    if (isSyncing) return "sync-outline";
    if (queueStats.pending > 0) return "time-outline";
    if (queueStats.failed > 0) return "alert-circle-outline";
    return "checkmark-circle-outline";
  };

  const handleSyncPress = () => {
    if (!isOnline) {
      Alert.alert(
        "Offline",
        "You are currently offline. Please check your internet connection."
      );
      return;
    }

    if (queueStats.failed > 0) {
      Alert.alert(
        "Sync Issues",
        `${queueStats.failed} items failed to sync. Would you like to retry?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Retry", onPress: retryFailedSyncs },
          { text: "Clear", style: "destructive", onPress: clearFailedSyncs },
        ]
      );
    } else if (queueStats.pending > 0) {
      Alert.alert(
        "Sync Pending",
        `${queueStats.pending} items waiting to sync. Force sync now?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Sync Now", onPress: () => forceSyncAll() },
        ]
      );
    } else {
      Alert.alert("Sync Status", "All data is synced.");
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: theme.cardBackground, borderColor: theme.border },
      ]}
      onPress={handleSyncPress}
      disabled={isSyncing}
    >
      <View style={styles.statusInfo}>
        <Ionicons
          name={getStatusIcon() as any}
          size={16}
          color={getStatusColor()}
          style={styles.statusIcon}
        />
        <Text style={[styles.statusText, { color: theme.text }]}>
          {getStatusText()}
        </Text>
      </View>

      {isSyncing && (
        <View style={styles.syncingIndicator}>
          <View
            style={[styles.syncingDot, { backgroundColor: theme.warning }]}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  statusInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statusIcon: {
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  syncingIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  syncingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
});

export default SyncStatus;
