import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
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
import { IconBadge } from "./IconBadge";

type Props = {
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof IconBadge>["name"];
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function ActionTile({ title, subtitle, icon, onPress, style }: Props) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      android_ripple={onPress ? { color: "rgba(31, 58, 95, 0.08)" } : undefined}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: palette.surface,
          borderColor: palette.borderLight,
          opacity: pressed && onPress ? 0.92 : 1,
        },
        pressed && onPress ? styles.pressed : null,
        style,
      ]}
    >
      <IconBadge name={icon} />
      <View style={styles.textCol}>
        <Text style={[styles.title, { color: palette.textPrimary }]}>
          {title}
        </Text>
        <Text style={[styles.subtitle, { color: palette.textSecondary }]}>
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    ...Shadows.card,
  },
  pressed: {
    transform: [{ scale: 0.995 }],
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: 22,
  },
  subtitle: {
    marginTop: 2,
    fontSize: Typography.sizes.bodySecondary,
    fontWeight: Typography.fontWeight.normal,
    lineHeight: 22,
  },
});
