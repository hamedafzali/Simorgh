import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { usePreferences } from "../../contexts/PreferencesContext";

type Props = {
  title: string;
  subtitle?: string;
};

export function Header({ title, subtitle }: Props) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { isRTL } = usePreferences();
  const textAlign = isRTL ? ("right" as const) : ("left" as const);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: palette.textPrimary, textAlign }]}>
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={[styles.subtitle, { color: palette.textSecondary, textAlign }]}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.sizes.headingXl,
    fontWeight: Typography.fontWeight.bold,
    lineHeight: 32,
  },
  subtitle: {
    marginTop: Spacing.sm,
    fontSize: Typography.sizes.bodySecondary,
    fontWeight: Typography.fontWeight.normal,
    lineHeight: 22,
  },
});
