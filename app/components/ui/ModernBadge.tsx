import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { BorderRadius, Colors, Spacing, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type ModernBadgeProps = {
  text: string;
  variant?: "default" | "primary" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  style?: any;
};

export function ModernBadge({
  text,
  variant = "default",
  size = "md",
  style,
}: ModernBadgeProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const getBadgeStyle = (): any[] => {
    const baseStyle: any[] = [styles.badge, styles[size]];

    switch (variant) {
      case "primary":
        baseStyle.push({ backgroundColor: colors.primary[500] });
        break;
      case "success":
        baseStyle.push({ backgroundColor: colors.success });
        break;
      case "warning":
        baseStyle.push({ backgroundColor: colors.warning });
        break;
      case "error":
        baseStyle.push({ backgroundColor: colors.error });
        break;
      default:
        baseStyle.push({ backgroundColor: colors.backgroundSecondary });
    }

    return baseStyle;
  };

  const getTextStyle = (): any[] => {
    const baseStyle: any[] = [styles.text, styles[`${size}Text`]];

    switch (variant) {
      case "primary":
      case "success":
      case "warning":
      case "error":
        baseStyle.push({ color: "#FFFFFF" });
        break;
      default:
        baseStyle.push({ color: colors.textMuted });
    }

    return baseStyle;
  };

  return (
    <View style={[getBadgeStyle(), style]}>
      <Text style={getTextStyle()}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  sm: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    minHeight: 20,
  },
  md: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    minHeight: 24,
  },
  lg: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 6,
    minHeight: 32,
  },
  text: {
    fontWeight: "600" as const,
    textAlign: "center",
  },
  smText: {
    fontSize: Typography.sizes.xs,
  },
  mdText: {
    fontSize: Typography.sizes.sm,
  },
  lgText: {
    fontSize: Typography.sizes.base,
  },
});
