import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { usePreferences } from "../../contexts/PreferencesContext";

type Props = {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  showBack?: boolean;
};

export function PageHeader({ title, subtitle, onBackPress, showBack }: Props) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { isRTL } = usePreferences();

  const backIcon = !isRTL
    ? ("chevron-right" as const)
    : ("chevron-left" as const);

  const canGoBack =
    typeof (router as any).canGoBack === "function"
      ? Boolean((router as any).canGoBack())
      : true;

  const shouldShowBack = showBack ?? canGoBack;

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    if (canGoBack) {
      router.back();
      return;
    }

    router.push("/(tabs)" as any);
  };

  return (
    <View style={styles.headerRow}>
      {shouldShowBack ? (
        <Pressable
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={({ pressed }) => [
            styles.back,
            {
              opacity: pressed ? 0.7 : 1,
              borderColor: palette.borderLight,
              backgroundColor:
                colorScheme === "dark"
                  ? "rgba(255,255,255,0.10)"
                  : "rgba(255,255,255,0.20)",
            },
          ]}
        >
          <Feather name={backIcon} size={18} color={palette.textPrimary} />
        </Pressable>
      ) : (
        <View style={styles.backSpacer} />
      )}
      <View style={styles.headerText}>
        <Text style={[styles.title, { color: palette.textPrimary }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: palette.textSecondary }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  back: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backSpacer: {
    width: 44,
    height: 44,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: Typography.sizes.headingL,
    fontWeight: Typography.fontWeight.bold,
    lineHeight: 26,
  },
  subtitle: {
    marginTop: 2,
    fontSize: Typography.sizes.bodySecondary,
    lineHeight: 20,
  },
});
