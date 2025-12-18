import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Feather } from "@expo/vector-icons";
import { BorderRadius, Colors, Spacing } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";

type Props = {
  name: React.ComponentProps<typeof Feather>["name"];
  color?: string;
  backgroundColor?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function IconBadge({
  name,
  color,
  backgroundColor,
  size = 18,
  style,
}: Props) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: backgroundColor ?? palette.accentGreenSoft,
        },
        style,
      ]}
    >
      <Feather name={name} size={size} color={color ?? palette.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.sm,
  },
});
