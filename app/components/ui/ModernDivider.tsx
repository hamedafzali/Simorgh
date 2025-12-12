import React from "react";
import { StyleSheet, View } from "react-native";

import { Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type ModernDividerProps = {
  orientation?: "horizontal" | "vertical";
  variant?: "solid" | "dashed" | "dotted";
  thickness?: number;
  color?: string;
  style?: any;
};

export function ModernDivider({
  orientation = "horizontal",
  variant = "solid",
  thickness = 1,
  color,
  style,
}: ModernDividerProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const getDividerStyle = (): any[] => {
    const baseStyle: any[] = [styles.divider];

    if (orientation === "horizontal") {
      baseStyle.push({
        width: "100%",
        height: thickness,
        marginVertical: Spacing.sm,
      });
    } else {
      baseStyle.push({
        width: thickness,
        height: "100%",
        marginHorizontal: Spacing.sm,
      });
    }

    switch (variant) {
      case "dashed":
        baseStyle.push({
          borderStyle: "dashed",
          borderWidth: thickness,
          borderColor: color || colors.border,
          backgroundColor: "transparent",
        });
        break;
      case "dotted":
        baseStyle.push({
          borderStyle: "dotted",
          borderWidth: thickness,
          borderColor: color || colors.border,
          backgroundColor: "transparent",
        });
        break;
      default:
        baseStyle.push({
          backgroundColor: color || colors.border,
        });
    }

    return baseStyle;
  };

  return <View style={[getDividerStyle(), style]} />;
}

const styles = StyleSheet.create({
  divider: {
    alignSelf: "center",
  },
});
