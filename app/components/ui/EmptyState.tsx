import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { Button } from "./Button";

type Props = {
  message: string;
  action?: {
    title: string;
    onPress: () => void;
  };
  style?: StyleProp<ViewStyle>;
};

export function EmptyState({ message, action, style }: Props) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <View style={style}>
      <Text style={[styles.text, { color: palette.textSecondary }]}>
        {message}
      </Text>
      {action && <View style={{ height: Spacing.md }} />}
      {action && (
        <Button
          title={action.title}
          onPress={action.onPress}
          variant="secondary"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: Typography.sizes.bodySecondary,
    lineHeight: 22,
    textAlign: "center",
  },
});
