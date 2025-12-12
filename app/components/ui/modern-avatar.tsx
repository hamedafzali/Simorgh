import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { BorderRadius, Colors, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type ModernAvatarProps = {
  source?: { uri: string } | null;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  variant?: "circle" | "square";
  style?: any;
  fallbackText?: string;
};

export function ModernAvatar({
  source,
  name,
  size = "md",
  variant = "circle",
  style,
  fallbackText,
}: ModernAvatarProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const getAvatarStyle = (): any[] => {
    const baseStyle: any[] = [styles.avatar];

    switch (size) {
      case "xs":
        baseStyle.push({ width: 24, height: 24 });
        break;
      case "sm":
        baseStyle.push({ width: 32, height: 32 });
        break;
      case "lg":
        baseStyle.push({ width: 64, height: 64 });
        break;
      case "xl":
        baseStyle.push({ width: 80, height: 80 });
        break;
      case "2xl":
        baseStyle.push({ width: 96, height: 96 });
        break;
      default:
        baseStyle.push({ width: 48, height: 48 });
    }

    if (variant === "square") {
      baseStyle.push({ borderRadius: BorderRadius.lg });
    } else {
      baseStyle.push({ borderRadius: BorderRadius.full });
    }

    return baseStyle;
  };

  const getTextStyle = (): any[] => {
    const baseTextStyle: any[] = [styles.avatarText];

    switch (size) {
      case "xs":
        baseTextStyle.push({ fontSize: Typography.sizes.xs });
        break;
      case "sm":
        baseTextStyle.push({ fontSize: Typography.sizes.sm });
        break;
      case "lg":
        baseTextStyle.push({ fontSize: Typography.sizes.lg });
        break;
      case "xl":
        baseTextStyle.push({ fontSize: Typography.sizes.xl });
        break;
      case "2xl":
        baseTextStyle.push({ fontSize: Typography.sizes["2xl"] });
        break;
      default:
        baseTextStyle.push({ fontSize: Typography.sizes.base });
    }

    return baseTextStyle;
  };

  const getInitials = () => {
    if (fallbackText) return fallbackText;
    if (!name) return "?";

    const words = name.trim().split(" ");
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return (
      words[0].charAt(0) + words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  const getBackgroundColor = () => {
    if (!name) return colors.backgroundSecondary;

    const colorOptions = [
      colors.primary[500],
      colors.success,
      colors.warning,
      colors.error,
      "#8B5CF6", // purple
      "#F59E0B", // amber
      "#10B981", // emerald
      "#F43F5E", // rose
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colorOptions[Math.abs(hash) % colorOptions.length];
  };

  if (source?.uri) {
    return (
      <View style={[getAvatarStyle(), style]}>
        <View
          style={[
            styles.avatarImage,
            { backgroundColor: colors.backgroundSecondary },
          ]}
        >
          {/* Image component would go here - using placeholder for now */}
          <Text style={[getTextStyle(), { color: colors.textMuted }]}>
            {getInitials()}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        getAvatarStyle(),
        { backgroundColor: getBackgroundColor() },
        style,
      ]}
    >
      <Text style={[getTextStyle(), { color: "#FFFFFF" }]}>
        {getInitials()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontWeight: "600",
    textAlign: "center",
  },
});
