import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { GlassCard } from "./GlassCard";

type Props = {
  title: string;
  value?: string;
  subtitle?: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function GlassWidget({
  title,
  value,
  subtitle,
  icon,
  onPress,
  style,
}: Props) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <GlassCard onPress={onPress} style={[styles.card, style]}>
      <View style={styles.topRow}>
        <Text style={[styles.title, { color: palette.textMuted }]}>
          {title}
        </Text>
        <Feather name={icon} size={18} color={palette.primary} />
      </View>
      {value ? (
        <Text style={[styles.value, { color: palette.textPrimary }]}>
          {value}
        </Text>
      ) : null}
      {subtitle ? (
        <Text style={[styles.subtitle, { color: palette.textSecondary }]}>
          {subtitle}
        </Text>
      ) : null}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 0,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.fontWeight.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  value: {
    marginTop: Spacing.sm,
    fontSize: Typography.sizes.headingL,
    fontWeight: Typography.fontWeight.bold,
    lineHeight: 26,
  },
  subtitle: {
    marginTop: 2,
    fontSize: Typography.sizes.bodySecondary,
    lineHeight: 22,
  },
});
