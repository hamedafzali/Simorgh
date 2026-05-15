import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  BorderRadius,
  Colors,
  getTextFontFamily,
  Spacing,
  Typography,
} from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { IconBadge } from "./IconBadge";
import { usePreferences } from "../../contexts/PreferencesContext";

type Props = {
  label: string;
  value: string;
  icon: React.ComponentProps<typeof IconBadge>["name"];
  style?: StyleProp<ViewStyle>;
};

export function StatCard({ label, value, icon, style }: Props) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { language } = usePreferences();
  const semiboldFont = getTextFontFamily(language, "semibold");
  const boldFont = getTextFontFamily(language, "bold");

  return (
    <View
      style={[
        styles.base,
        {
          borderColor: palette.borderLight,
          backgroundColor: palette.surface,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: colorScheme === "dark" ? 0.12 : 0.04,
          shadowRadius: 12,
          elevation: 1,
        },
        style,
      ]}
    >
      <View style={styles.topRow}>
        <Text
          style={[
            styles.label,
            { color: palette.textMuted, fontFamily: semiboldFont },
          ]}
        >
          {label}
        </Text>
        <IconBadge name={icon} />
      </View>
      <Text
        style={[
          styles.value,
          { color: palette.textPrimary, fontFamily: boldFont },
        ]}
      >
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
    letterSpacing: 0.3,
  },
  value: {
    marginTop: Spacing.sm,
    fontSize: Typography.sizes.headingL,
    fontWeight: Typography.fontWeight.bold,
    lineHeight: 26,
  },
});
