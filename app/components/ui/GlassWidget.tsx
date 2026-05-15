import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  Colors,
  Spacing,
  Typography,
  getTextFontFamily,
} from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { GlassCard } from "./GlassCard";
import { usePreferences } from "../../contexts/PreferencesContext";

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
  const { language } = usePreferences();
  const regularFont = getTextFontFamily(language, "normal");
  const semiboldFont = getTextFontFamily(language, "semibold");
  const boldFont = getTextFontFamily(language, "bold");

  return (
    <GlassCard onPress={onPress} style={[styles.card, style]}>
      <View style={styles.topRow}>
        <Text
          style={[
            styles.title,
            { color: palette.textMuted, fontFamily: semiboldFont },
          ]}
        >
          {title}
        </Text>
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor:
                colorScheme === "dark"
                  ? "rgba(143,176,167,0.12)"
                  : "rgba(39,76,70,0.08)",
            },
          ]}
        >
          <Feather name={icon} size={16} color={palette.primary} />
        </View>
      </View>
      {value ? (
        <Text
          style={[
            styles.value,
            { color: palette.textPrimary, fontFamily: boldFont },
          ]}
        >
          {value}
        </Text>
      ) : null}
      {subtitle ? (
        <Text
          style={[
            styles.subtitle,
            { color: palette.textSecondary, fontFamily: regularFont },
          ]}
        >
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
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
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
  subtitle: {
    marginTop: 8,
    fontSize: Typography.sizes.bodySmall,
    lineHeight: 20,
  },
});
