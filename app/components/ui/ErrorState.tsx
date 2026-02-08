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
  onRetry?: () => void;
  style?: StyleProp<ViewStyle>;
  retryText?: string;
};

export function ErrorState({
  message,
  onRetry,
  style,
  retryText = "Retry",
}: Props) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <View style={style}>
      <Text
        style={[
          ComponentStyles.errorText,
          { color: palette.error || "#ef4444" },
        ]}
      >
        {message}
      </Text>
      {onRetry && (
        <Button title={retryText} onPress={onRetry} variant="primary" />
      )}
    </View>
  );
}
