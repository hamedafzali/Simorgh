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

export function Header({ title, subtitle, onBackPress, showBack }: Props) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { isRTL } = usePreferences();
  const textAlign = isRTL ? ("right" as const) : ("left" as const);

  const backIcon = !isRTL
    ? ("chevron-right" as const)
    : ("chevron-left" as const);

  const canGoBack =
    typeof (router as any).canGoBack === "function"
      ? Boolean((router as any).canGoBack())
      : true;

  const shouldShowBack = showBack ?? false;

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
    <View style={styles.container}>
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
      ) : null}
      <Text style={[styles.title, { color: palette.textPrimary, textAlign }]}>
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={[styles.subtitle, { color: palette.textSecondary, textAlign }]}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  back: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: Typography.sizes.headingXl,
    fontWeight: Typography.fontWeight.bold,
    lineHeight: 32,
  },
  subtitle: {
    marginTop: Spacing.sm,
    fontSize: Typography.sizes.bodySecondary,
    fontWeight: Typography.fontWeight.normal,
    lineHeight: 22,
  },
});
