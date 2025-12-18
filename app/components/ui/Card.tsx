import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Colors, BorderRadius, Shadows, Spacing } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, style }: Props) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: palette.surface,
          borderColor: palette.borderLight,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    ...Shadows.card,
  },
});
