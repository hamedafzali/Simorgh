import { useEffect, useMemo, useRef } from "react";
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type ModernProgressBarProps = {
  value: number; // 0..1
  style?: StyleProp<ViewStyle>;
  variant?: "default" | "primary" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  showLabel?: boolean;
  label?: string;
};

export function ModernProgressBar({
  value,
  style,
  variant = "default",
  size = "md",
  animated = true,
  showLabel = false,
  label,
}: ModernProgressBarProps) {
  const clamped = Math.max(0, Math.min(1, value || 0));
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: clamped,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(clamped);
    }
  }, [clamped, animated, animatedValue]);

  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      borderRadius: BorderRadius.full,
      overflow: "hidden",
    };

    switch (size) {
      case "sm":
        base.height = 4;
        break;
      case "lg":
        base.height = 12;
        break;
      default:
        base.height = 8;
    }

    return base;
  };

  const colorsConfig = useMemo(() => {
    const getColors = () => {
      switch (variant) {
        case "primary":
          return {
            background: colors.backgroundSecondary,
            border: colors.borderLight,
            fill: colors.primary[500],
          };
        case "success":
          return {
            background: colors.backgroundSecondary,
            border: colors.borderLight,
            fill: colors.success,
          };
        case "warning":
          return {
            background: colors.backgroundSecondary,
            border: colors.borderLight,
            fill: colors.warning,
          };
        case "error":
          return {
            background: colors.backgroundSecondary,
            border: colors.borderLight,
            fill: colors.error,
          };
        default:
          return {
            background: colors.backgroundSecondary,
            border: colors.border,
            fill: colors.primary[500],
          };
      }
    };

    return getColors();
  }, [variant, colors]);

  return (
    <View style={style}>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Animated.Text style={[styles.label, { color: colors.text }]}>
            {label || `${Math.round(clamped * 100)}%`}
          </Animated.Text>
        </View>
      )}
      <View
        style={[
          styles.container,
          getContainerStyle(),
          {
            backgroundColor: colorsConfig.background,
            borderColor: colorsConfig.border,
            borderWidth: 1,
          },
        ]}
      >
        {animated ? (
          <Animated.View
            style={[
              styles.fill,
              {
                backgroundColor: colorsConfig.fill,
                width: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                  extrapolate: "clamp",
                }),
              },
            ]}
          />
        ) : (
          <View
            style={[
              styles.fill,
              {
                backgroundColor: colorsConfig.fill,
                width: `${clamped * 100}%`,
              },
            ]}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  fill: {
    height: "100%",
    borderRadius: BorderRadius.full,
  },
  labelContainer: {
    marginBottom: Spacing.xs,
    alignItems: "flex-end",
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
  },
});
