import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { usePreferences } from "../../contexts/PreferencesContext";

type Props = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onPressAction?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onPressAction,
  style,
}: Props) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { isRTL } = usePreferences();
  const textAlign = isRTL ? ("right" as const) : ("left" as const);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.textCol}>
        <Text style={[styles.title, { color: palette.textPrimary, textAlign }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[
              styles.subtitle,
              { color: palette.textSecondary, textAlign },
            ]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {actionLabel && onPressAction ? (
        <Pressable
          onPress={onPressAction}
          hitSlop={8}
          style={({ pressed }) => [
            styles.action,
            {
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Text style={[styles.actionText, { color: palette.primary }]}>
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontSize: Typography.sizes.headingM,
    fontWeight: Typography.fontWeight.bold,
    lineHeight: 24,
  },
  subtitle: {
    marginTop: Spacing.xs,
    fontSize: Typography.sizes.bodySecondary,
    fontWeight: Typography.fontWeight.normal,
    lineHeight: 22,
  },
  action: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  actionText: {
    fontSize: Typography.sizes.bodySecondary,
    fontWeight: Typography.fontWeight.semibold,
  },
});
