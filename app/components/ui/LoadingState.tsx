import React from "react";
import {
  ActivityIndicator,
  Text,
  View,
  StyleProp,
  ViewStyle,
} from "react-native";
import {
  Colors,
  ComponentStyles,
  Spacing,
  Typography,
} from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";

type Props = {
  message?: string;
  style?: StyleProp<ViewStyle>;
  size?: "small" | "large";
};

export function LoadingState({
  message = "Loading...",
  style,
  size = "large",
}: Props) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <View style={[ComponentStyles.loadingContainer, style]}>
      <ActivityIndicator size={size} color={palette.primary} />
      <Text
        style={{
          color: palette.textSecondary,
          marginTop: Spacing.md,
          fontSize: Typography.sizes.bodySecondary,
        }}
      >
        {message}
      </Text>
    </View>
  );
}
