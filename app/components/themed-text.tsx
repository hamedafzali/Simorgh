import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "body" | "heading" | "caption";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  const getTextStyles = () => {
    switch (type) {
      case "title":
        return styles.title;
      case "defaultSemiBold":
        return styles.defaultSemiBold;
      case "subtitle":
        return styles.subtitle;
      case "body":
        return styles.body;
      case "heading":
        return styles.heading;
      case "caption":
        return styles.caption;
      default:
        return styles.default;
    }
  };

  return (
    <Text
      style={[
        { color },
        getTextStyles(),
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 28,
  },
  defaultSemiBold: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 26,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 32,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
});

export default ThemedText;
