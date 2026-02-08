import React from "react";
import { Text } from "react-native";
import { Colors } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { usePreferences } from "../../contexts/PreferencesContext";

type Props = {
  color?: string;
};

export function Chevron({ color }: Props) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { isRTL } = usePreferences();

  return (
    <Text style={{ color: color ?? palette.textMuted }}>
      {isRTL ? "‹" : "›"}
    </Text>
  );
}
