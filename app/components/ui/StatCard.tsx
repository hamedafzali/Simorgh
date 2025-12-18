import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  BorderRadius,
  Colors,
  Spacing,
  Typography,
} from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { IconBadge } from "./IconBadge";

type Props = {
  label: string;
  value: string;
  icon: React.ComponentProps<typeof IconBadge>["name"];
  style?: StyleProp<ViewStyle>;
};

export function StatCard({ label, value, icon, style }: Props) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <View
      style={[
        styles.base,
        {
          borderColor: palette.borderLight,
          backgroundColor: palette.surface,
        },
        style,
      ]}
    >
      <View style={styles.topRow}>
        <Text style={[styles.label, { color: palette.textMuted }]}>
          {label}
        </Text>
        <IconBadge name={icon} />
      </View>
      <Text style={[styles.value, { color: palette.textPrimary }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    minHeight: 88,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.fontWeight.semibold,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  value: {
    marginTop: Spacing.sm,
    fontSize: Typography.sizes.headingL,
    fontWeight: Typography.fontWeight.bold,
    lineHeight: 26,
  },
});
