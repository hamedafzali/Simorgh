import React, { forwardRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";

import { BorderRadius, Colors, Spacing, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type ModernInputProps = TextInputProps & {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "filled" | "outlined";
  size?: "sm" | "md" | "lg";
  containerStyle?: ViewStyle;
};

export const ModernInput = forwardRef<TextInput, ModernInputProps>(
  (
    {
      label,
      error,
      helper,
      leftIcon,
      rightIcon,
      variant = "default",
      size = "md",
      containerStyle,
      style,
      ...props
    },
    ref
  ) => {
    const theme = useColorScheme() ?? "light";
    const colors = Colors[theme];

    const getInputStyle = () => {
      const baseStyle: any[] = [styles.input, styles[size]];

      switch (variant) {
        case "filled":
          baseStyle.push({
            backgroundColor: colors.backgroundSecondary,
            borderWidth: 0,
          });
          break;
        case "outlined":
          baseStyle.push({
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: error ? colors.error : colors.border,
          });
          break;
        default:
          baseStyle.push({
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: error ? colors.error : colors.borderLight,
          });
      }

      return baseStyle;
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        )}

        <View style={styles.inputContainer}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

          <TextInput
            ref={ref}
            style={[
              getInputStyle(),
              { color: colors.text },
              leftIcon && ({ paddingLeft: Spacing.xl } as any),
              rightIcon && ({ paddingRight: Spacing.xl } as any),
              style,
            ]}
            placeholderTextColor={colors.textLight}
            {...props}
          />

          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>

        {error && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        )}
        {helper && !error && (
          <Text style={[styles.helperText, { color: colors.textMuted }]}>
            {helper}
          </Text>
        )}
      </View>
    );
  }
);

ModernInput.displayName = "ModernInput";

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontWeight: "500" as const,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    position: "relative",
  },
  input: {
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
  },
  sm: {
    fontSize: Typography.sizes.sm,
    paddingVertical: Spacing.sm,
    minHeight: 36,
  },
  md: {
    fontSize: Typography.sizes.base,
    paddingVertical: Spacing.md,
    minHeight: 44,
  },
  lg: {
    fontSize: Typography.sizes.lg,
    paddingVertical: Spacing.lg,
    minHeight: 52,
  },
  leftIcon: {
    position: "absolute",
    left: Spacing.md,
    top: "50%",
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
  rightIcon: {
    position: "absolute",
    right: Spacing.md,
    top: "50%",
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
  errorText: {
    fontSize: Typography.sizes.sm,
    marginTop: Spacing.xs,
  },
  helperText: {
    fontSize: Typography.sizes.sm,
    marginTop: Spacing.xs,
  },
});
