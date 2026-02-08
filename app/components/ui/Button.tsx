import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";

type Variant = "primary" | "secondary";

type Props = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function Button({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
  style,
  textStyle,
}: Props) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  const isDisabled = disabled || loading;

  const containerStyle: ViewStyle =
    variant === "primary"
      ? {
          backgroundColor: palette.primary,
          borderColor: palette.primary,
          shadowColor: palette.primary,
        }
      : {
          backgroundColor: "transparent",
          borderColor: palette.borderLight,
          shadowColor: "transparent",
        };

  const labelStyle: TextStyle =
    variant === "primary"
      ? { color: palette.white }
      : { color: palette.primary };

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        containerStyle,
        pressed && !isDisabled ? styles.pressed : null,
        isDisabled ? styles.disabled : null,
        variant === "secondary" && pressed && !isDisabled
          ? styles.secondaryPressed
          : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={labelStyle.color} />
      ) : (
        <Text style={[styles.label, labelStyle, textStyle]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.button,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.button,
  },
  label: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.fontWeight.semibold,
    letterSpacing: 0.2,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  secondaryPressed: {
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.5,
  },
});
