import { useMemo } from "react";
import { TextStyle, TouchableOpacity, ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BorderRadius, Colors, Spacing, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type ModernChipProps = {
  label: string;
  active?: boolean;
  colorOverride?: string;
  variant?: "default" | "primary" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress?: () => void;
};

export function ModernChip({
  label,
  active,
  colorOverride,
  variant = "default",
  size = "md",
  style,
  textStyle,
  onPress,
}: ModernChipProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const stylesArray = useMemo(() => {
    const getChipStyle = (): ViewStyle => {
      const base: ViewStyle = {
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
      };

      // Size variations
      switch (size) {
        case "sm":
          base.paddingHorizontal = Spacing.sm;
          base.paddingVertical = Spacing.xs;
          break;
        case "lg":
          base.paddingHorizontal = Spacing.lg;
          base.paddingVertical = Spacing.md;
          break;
        default:
          base.paddingHorizontal = Spacing.md;
          base.paddingVertical = Spacing.sm;
      }

      // Variant styles
      if (active) {
        if (variant === "primary") {
          base.backgroundColor = colors.primary[500];
          base.borderColor = colors.primary[500];
        } else if (variant === "success") {
          base.backgroundColor = colors.success;
          base.borderColor = colors.success;
        } else if (variant === "warning") {
          base.backgroundColor = colors.warning;
          base.borderColor = colors.warning;
        } else if (variant === "error") {
          base.backgroundColor = colors.error;
          base.borderColor = colors.error;
        } else {
          base.backgroundColor = colors.background;
          base.borderColor = colors.border;
        }
      } else {
        if (variant === "primary") {
          base.backgroundColor = "transparent";
          base.borderColor = colors.primary[500];
        } else if (variant === "success") {
          base.backgroundColor = "transparent";
          base.borderColor = colors.success;
        } else if (variant === "warning") {
          base.backgroundColor = "transparent";
          base.borderColor = colors.warning;
        } else if (variant === "error") {
          base.backgroundColor = "transparent";
          base.borderColor = colors.error;
        } else {
          base.backgroundColor = colors.background;
          base.borderColor = colors.border;
        }
      }

      return base;
    };

    return [getChipStyle(), style].filter(Boolean) as ViewStyle[];
  }, [active, variant, size, style, colors]);

  const getTextColor = (): string => {
    if (active) {
      if (variant === "default") {
        return colors.text;
      }
      return "#FFFFFF";
    }

    if (variant === "primary") {
      return colors.primary[500];
    } else if (variant === "success") {
      return colors.success;
    } else if (variant === "warning") {
      return colors.warning;
    } else if (variant === "error") {
      return colors.error;
    }

    return colorOverride || colors.text;
  };

  const getTextSize = (): TextStyle => {
    switch (size) {
      case "sm":
        return { fontSize: Typography.sizes.xs, fontWeight: "500" as const };
      case "lg":
        return { fontSize: Typography.sizes.base, fontWeight: "600" as const };
      default:
        return { fontSize: Typography.sizes.sm, fontWeight: "500" as const };
    }
  };

  const ChipComponent = (
    <ThemedView style={stylesArray}>
      <ThemedText style={[{ color: getTextColor() }, getTextSize(), textStyle]}>
        {label}
      </ThemedText>
    </ThemedView>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={stylesArray} onPress={onPress}>
        <ThemedText
          style={[{ color: getTextColor() }, getTextSize(), textStyle]}
        >
          {label}
        </ThemedText>
      </TouchableOpacity>
    );
  }

  return ChipComponent;
}
