import React, { useState, useEffect } from "react";
import { Pressable, Text, View, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useDatabase } from "../../contexts/DatabaseContext";
import { Spacing, Typography, Colors } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { GlassCard } from "./GlassCard";

interface SyncButtonProps {
  size?: "small" | "medium" | "large";
  showStatus?: boolean;
  onSyncComplete?: (success: boolean, results?: any[]) => void;
}

export function SyncButton({
  size = "medium",
  showStatus = false,
  onSyncComplete,
}: SyncButtonProps) {
  const {
    isOnline,
    isSyncing,
    lastSync,
    fullSync,
    isSyncNeeded,
    isInitialized,
  } = useDatabase();
  const [syncNeeded, setSyncNeeded] = useState(false);
  const [lastSyncText, setLastSyncText] = useState("");
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  // Check if sync is needed periodically (only after initialization)
  useEffect(() => {
    if (!isInitialized) return;

    const checkSyncNeeded = async () => {
      try {
        const needed = await isSyncNeeded();
        setSyncNeeded(needed);

        // Format last sync time
        if (lastSync > 0) {
          const date = new Date(lastSync);
          const now = new Date();
          const diffMs = now.getTime() - date.getTime();
          const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

          if (diffHours < 1) {
            setLastSyncText("Just now");
          } else if (diffHours < 24) {
            setLastSyncText(`${diffHours}h ago`);
          } else {
            const diffDays = Math.floor(diffHours / 24);
            setLastSyncText(`${diffDays}d ago`);
          }
        } else {
          setLastSyncText("Never");
        }
      } catch (error) {
        console.log("Sync check failed:", error);
        setLastSyncText("Unknown");
      }
    };

    checkSyncNeeded();
    const interval = setInterval(checkSyncNeeded, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [lastSync, isInitialized, isSyncNeeded]);

  const handleSync = async () => {
    if (!isOnline || isSyncing) return;

    try {
      const results = await fullSync();
      const success = results.every((r) => r.success);

      if (onSyncComplete) {
        onSyncComplete(success, results);
      }
    } catch (error) {
      console.error("Sync failed:", error);
      if (onSyncComplete) {
        onSyncComplete(false);
      }
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          button: {
            width: 36,
            height: 36,
            borderRadius: 10,
          },
          icon: 16,
          text: Typography.sizes.bodySmall,
        };
      case "large":
        return {
          button: {
            width: 56,
            height: 56,
            borderRadius: 16,
          },
          icon: 24,
          text: Typography.sizes.body,
        };
      default: // medium
        return {
          button: {
            width: 44,
            height: 44,
            borderRadius: 14,
          },
          icon: 18,
          text: Typography.sizes.bodySecondary,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  // Show loading state while database initializes
  if (!isInitialized) {
    return (
      <View style={{ alignItems: "center" }}>
        <GlassCard
          style={[
            sizeStyles.button,
            { alignItems: "center", justifyContent: "center" },
          ]}
        >
          <ActivityIndicator size="small" color={palette.textMuted} />
        </GlassCard>
        {showStatus && (
          <Text
            style={{
              fontSize: Typography.sizes.bodySmall,
              color: palette.textMuted,
              marginTop: Spacing.xs,
              textAlign: "center",
            }}
          >
            Loading...
          </Text>
        )}
      </View>
    );
  }

  if (!isOnline) {
    return (
      <GlassCard
        style={[
          sizeStyles.button,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <Feather
          name="wifi-off"
          size={sizeStyles.icon}
          color={palette.textMuted}
        />
      </GlassCard>
    );
  }

  if (isSyncing) {
    return (
      <GlassCard
        style={[
          sizeStyles.button,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <ActivityIndicator size="small" color={palette.primary} />
      </GlassCard>
    );
  }

  return (
    <View style={{ alignItems: "center" }}>
      <Pressable
        onPress={handleSync}
        disabled={!isOnline || isSyncing}
        style={({ pressed }) => [
          sizeStyles.button,
          {
            alignItems: "center",
            justifyContent: "center",
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <GlassCard
          style={[
            sizeStyles.button,
            { alignItems: "center", justifyContent: "center" },
          ]}
        >
          <View style={{ position: "relative" }}>
            <Feather
              name="refresh-cw"
              size={sizeStyles.icon}
              color={syncNeeded ? palette.primary : palette.textSecondary}
            />
            {syncNeeded && (
              <View
                style={{
                  position: "absolute",
                  top: -2,
                  right: -2,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: palette.primary,
                }}
              />
            )}
          </View>
        </GlassCard>
      </Pressable>

      {showStatus && (
        <Text
          style={{
            fontSize: Typography.sizes.bodySmall,
            color: palette.textSecondary,
            marginTop: Spacing.xs,
            textAlign: "center",
          }}
        >
          {lastSyncText}
        </Text>
      )}
    </View>
  );
}
