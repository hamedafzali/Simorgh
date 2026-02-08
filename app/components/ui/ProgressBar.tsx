import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { Colors, ComponentStyles, Spacing } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";

type Props = {
  progress: number; // 0-100
  style?: StyleProp<ViewStyle>;
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
};

export function ProgressBar({
  progress,
  style,
  height = 4,
  backgroundColor,
  progressColor,
}: Props) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <View
      style={[
        ComponentStyles.progress,
        {
          height,
          backgroundColor: backgroundColor || palette.borderLight,
        },
        style,
      ]}
    >
      <View
        style={{
          height: "100%",
          backgroundColor: progressColor || palette.primary,
          width: `${Math.min(100, Math.max(0, progress))}%`,
        }}
      />
    </View>
  );
}
