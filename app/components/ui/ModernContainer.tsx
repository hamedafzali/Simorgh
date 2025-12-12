import React from "react";
import { StyleSheet } from "react-native";

import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";

export type ModernContainerProps = {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: boolean;
  centered?: boolean;
  style?: any;
};

export function ModernContainer({
  children,
  size = "md",
  padding = true,
  centered = false,
  style,
}: ModernContainerProps) {
  const getContainerStyle = (): any[] => {
    const baseStyle: any[] = [styles.container];

    switch (size) {
      case "sm":
        baseStyle.push({ maxWidth: 640 });
        break;
      case "lg":
        baseStyle.push({ maxWidth: 1024 });
        break;
      case "xl":
        baseStyle.push({ maxWidth: 1280 });
        break;
      case "full":
        baseStyle.push({ maxWidth: "100%" });
        break;
      default:
        baseStyle.push({ maxWidth: 768 });
    }

    if (padding) {
      baseStyle.push({ paddingHorizontal: Spacing.lg });
    }

    if (centered) {
      baseStyle.push({ alignSelf: "center", width: "100%" });
    }

    return baseStyle;
  };

  return (
    <ThemedView style={[getContainerStyle(), style]}>{children}</ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
