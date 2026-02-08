import { useColorScheme } from "react-native";
import { useMemo } from "react";

export type Theme = {
  background: string;
  cardBackground: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  glass: string;
  glassBorder: string;
};

const lightTheme: Theme = {
  background: "#FFFFFF",
  cardBackground: "#F8F9FA",
  text: "#1A1A2E",
  textSecondary: "#6C757D",
  border: "#E9ECEF",
  primary: "#1A1A2E",
  secondary: "#6C757D",
  accent: "#007BFF",
  success: "#28A745",
  warning: "#FFC107",
  error: "#DC3545",
  glass: "rgba(255, 255, 255, 0.8)",
  glassBorder: "rgba(255, 255, 255, 0.4)",
};

const darkTheme: Theme = {
  background: "#1A1A2E",
  cardBackground: "#16213E",
  text: "#FFFFFF",
  textSecondary: "#B8BCC8",
  border: "rgba(255, 255, 255, 0.1)",
  primary: "#FFFFFF",
  secondary: "#B8BCC8",
  accent: "#0F4C75",
  success: "#28A745",
  warning: "#FFC107",
  error: "#DC3545",
  glass: "rgba(255, 255, 255, 0.08)",
  glassBorder: "rgba(255, 255, 255, 0.4)",
};

export function useTheme() {
  const colorScheme = useColorScheme();

  const theme = useMemo(() => {
    return colorScheme === "dark" ? darkTheme : lightTheme;
  }, [colorScheme]);

  return {
    theme,
    isDark: colorScheme === "dark",
  };
}
