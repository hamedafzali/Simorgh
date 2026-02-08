import React from "react";
import { Text, View, StyleProp, ViewStyle } from "react-native";
import {
  Colors,
  ComponentStyles,
  Spacing,
  Typography,
} from "../../constants/theme";
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
      <Text
        style={[
          ComponentStyles.emptyStateText,
          { color: palette.textSecondary },
        ]}
      >
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
