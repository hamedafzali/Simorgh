import { useColorScheme as useNativeColorScheme } from "react-native";

type ColorProps = {
  light?: string;
  dark?: string;
};

export function useThemeColor(props: ColorProps, colorName: string): string {
  const theme = useNativeColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // Default colors for common theme properties
    const defaultColors = {
      background: theme === "dark" ? "#000000" : "#ffffff",
      text: theme === "dark" ? "#ffffff" : "#000000",
      card: theme === "dark" ? "#0f172a" : "#f8fafc",
      border: theme === "dark" ? "#334155" : "#e2e8f0",
      primary: theme === "dark" ? "#60a5fa" : "#3b82f6",
      textMuted: theme === "dark" ? "#94a3b8" : "#64748b",
    };

    return defaultColors[colorName as keyof typeof defaultColors] || "#000000";
  }
}
