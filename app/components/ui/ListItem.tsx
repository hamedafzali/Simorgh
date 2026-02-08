import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  StyleProp,
} from "react-native";
import {
  BorderRadius,
  Colors,
  Spacing,
  Typography,
} from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { usePreferences } from "../../contexts/PreferencesContext";

type Props = {
  title: string;
  subtitle?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function ListItem({
  title,
  subtitle,
  left,
  right,
  onPress,
  style,
}: Props) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { isRTL } = usePreferences();
  const textAlign = isRTL ? ("right" as const) : ("left" as const);

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      android_ripple={onPress ? { color: "rgba(31, 58, 95, 0.08)" } : undefined}
      style={({ pressed }) => [
        styles.container,
        { flexDirection: isRTL ? "row-reverse" : "row" },
        {
          backgroundColor: palette.surface,
          borderColor: palette.borderLight,
          opacity: pressed && onPress ? 0.92 : 1,
        },
        pressed && onPress ? styles.pressed : null,
        style,
      ]}
    >
      {left ? (
        <View style={[styles.left, isRTL ? styles.leftRTL : null]}>{left}</View>
      ) : null}
      <View style={styles.text}>
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
      {right ? (
        <View style={[styles.right, isRTL ? styles.rightRTL : null]}>
          {right}
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  left: {
    marginRight: Spacing.md,
  },
  leftRTL: {
    marginRight: 0,
    marginLeft: Spacing.md,
  },
  text: {
    flex: 1,
  },
  right: {
    marginLeft: Spacing.md,
  },
  rightRTL: {
    marginLeft: 0,
    marginRight: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.fontWeight.semibold,
  },
  subtitle: {
    marginTop: 2,
    fontSize: Typography.sizes.bodySecondary,
    fontWeight: Typography.fontWeight.normal,
  },
  pressed: {
    transform: [{ scale: 0.995 }],
  },
});
