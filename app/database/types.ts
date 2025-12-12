import { useTheme } from "@/contexts/theme-context";
import { useThemeColor } from "@/hooks/use-theme-color";

export function useAppTheme() {
  const themeContext = useTheme();

  // Get individual colors using the existing hook for fallback
  const getThemeColor = useThemeColor;

  return {
    ...themeContext,
    // Convenience method to get any theme color
    getColor: getThemeColor,
    // Quick access to commonly used colors
    colors: themeContext.colors,
    isDark: themeContext.isDarkMode,
    isLight: !themeContext.isDarkMode,
  };
}
