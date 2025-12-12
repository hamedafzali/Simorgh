import { ReactNode, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import { BorderRadius, Colors, Spacing, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type ModernButtonProps = {
  title?: string;
  children?: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gradient";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
};

export function ModernButton({
  title,
  children,
  onPress,
  style,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
}: ModernButtonProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!disabled && !loading) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0.98,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          useNativeDriver: true,
          duration: 100,
        }),
      ]).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled && !loading) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          useNativeDriver: true,
          duration: 100,
        }),
      ]).start();
    }
  };

  const getButtonStyle = (): any[] => {
    const baseStyle: any[] = [
      styles.button,
      styles[size],
      fullWidth && styles.fullWidth,
    ];

    switch (variant) {
      case "primary":
        baseStyle.push({
          backgroundColor: colors.primary[500],
          ...colors.shadow.md,
        });
        break;
      case "secondary":
        baseStyle.push({
          backgroundColor: colors.backgroundSecondary,
          borderWidth: 1,
          borderColor: colors.border,
        });
        break;
      case "outline":
        baseStyle.push({
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: colors.primary[500],
        });
        break;
      case "ghost":
        baseStyle.push({
          backgroundColor: "transparent",
        });
        break;
      case "gradient":
        baseStyle.push(styles.gradientButton, colors.shadow.md);
        break;
    }

    return baseStyle;
  };

  const getTextStyle = (): any[] => {
    const baseStyle: any[] = [styles.text, styles[`${size}Text`]];

    switch (variant) {
      case "primary":
      case "gradient":
        baseStyle.push({ color: "#FFFFFF" });
        break;
      case "secondary":
        baseStyle.push({ color: colors.text });
        break;
      case "outline":
        baseStyle.push({ color: colors.primary[500] });
        break;
      case "ghost":
        baseStyle.push({ color: colors.primary[500] });
        break;
    }

    return baseStyle;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Animated.View style={styles.loadingContainer}>
          <Text style={getTextStyle()}>Loading...</Text>
        </Animated.View>
      );
    }

    return (
      <Animated.View
        style={[
          styles.content,
          iconPosition === "right" && styles.contentReverse,
        ]}
      >
        {icon && iconPosition === "left" && (
          <View style={styles.iconLeft}>{icon}</View>
        )}
        {(title || children) && (
          <Text style={getTextStyle()}>{title || children}</Text>
        )}
        {icon && iconPosition === "right" && (
          <View style={styles.iconRight}>{icon}</View>
        )}
      </Animated.View>
    );
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={styles.pressable}
    >
      <Animated.View
        style={[
          getButtonStyle(),
          {
            transform: [{ scale: scaleAnim }],
            opacity: disabled ? 0.5 : opacityAnim,
          },
          style,
        ]}
      >
        {renderContent()}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  sm: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 36,
  },
  md: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minHeight: 44,
  },
  lg: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    minHeight: 52,
  },
  fullWidth: {
    width: "100%",
  },
  gradientButton: {
    backgroundColor: "#FFFFFF",
  },
  pressable: {
    borderRadius: BorderRadius.lg,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  contentReverse: {
    flexDirection: "row-reverse",
  },
  iconLeft: {
    marginRight: Spacing.sm,
  },
  iconRight: {
    marginLeft: Spacing.sm,
  },
  text: {
    fontWeight: "600" as const,
    textAlign: "center",
  },
  smText: {
    fontSize: Typography.sizes.sm,
  },
  mdText: {
    fontSize: Typography.sizes.base,
  },
  lgText: {
    fontSize: Typography.sizes.lg,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
