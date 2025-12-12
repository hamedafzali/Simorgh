import { Colors } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type ThemeName = "light" | "dark" | "auto";

interface ThemeContextType {
  themeName: ThemeName;
  setTheme: (theme: ThemeName) => void;
  isDarkMode: boolean;
  colors: {
    background: string;
    text: string;
    card: string;
    border: string;
    primary: string;
    textMuted: string;
  };
  availableThemes: { name: ThemeName; label: string; description: string }[];
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeName, setThemeName] = useState<ThemeName>("auto");

  // Get theme colors dynamically
  const background = useThemeColor({}, "background") as string;
  const text = useThemeColor({}, "text") as string;
  const card = useThemeColor({}, "card") as string;
  const border = useThemeColor({}, "border") as string;
  const primary = useThemeColor(
    { light: Colors.light.primary[500], dark: Colors.dark.primary[500] },
    "primary"
  ) as string;
  const textMuted = useThemeColor({}, "textMuted") as string;

  const colors = {
    background,
    text,
    card,
    border,
    primary,
    textMuted,
  };

  const availableThemes = [
    {
      name: "light" as ThemeName,
      label: "Light",
      description: "Clean and bright interface",
    },
    {
      name: "dark" as ThemeName,
      label: "Dark",
      description: "Easy on the eyes in low light",
    },
    {
      name: "auto" as ThemeName,
      label: "Auto",
      description: "Follows system settings",
    },
  ];

  // Load theme preference from storage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        // First try to load from new theme system
        const savedTheme = await AsyncStorage.getItem("Simorgh.theme");
        if (savedTheme && ["light", "dark", "auto"].includes(savedTheme)) {
          setThemeName(savedTheme as ThemeName);
        } else {
          // Fallback to old system for migration
          const oldTheme = await AsyncStorage.getItem("Simorgh.darkMode");
          if (oldTheme !== null) {
            setThemeName(oldTheme === "true" ? "dark" : "light");
            // Migrate to new system
            await AsyncStorage.setItem(
              "Simorgh.theme",
              oldTheme === "true" ? "dark" : "light"
            );
          }
        }
      } catch (error) {
        console.log("Error loading theme:", error);
      }
    };
    loadTheme();
  }, []);

  const setTheme = async (newTheme: ThemeName) => {
    try {
      console.log("Setting theme to:", newTheme);
      setThemeName(newTheme);
      await AsyncStorage.setItem("Simorgh.theme", newTheme);

      // Update the underlying theme system for auto/light/dark
      let systemTheme: "light" | "dark" = "light";
      if (newTheme === "dark") {
        systemTheme = "dark";
      } else if (newTheme === "auto") {
        // Could add system detection here
        systemTheme = "light"; // Default to light for now
      }

      console.log("Setting system theme to:", systemTheme);

      // Update the old theme system for compatibility
      await AsyncStorage.setItem(
        "Simorgh.darkMode",
        systemTheme === "dark" ? "true" : "false"
      );

      // Trigger theme update
      const { updateTheme } = await import("@/hooks/use-color-scheme");
      console.log("Calling updateTheme()");
      updateTheme();
    } catch (error) {
      console.log("Error saving theme:", error);
    }
  };

  const isDarkMode = themeName === "dark" || (themeName === "auto" && false); // Add system detection later

  const value: ThemeContextType = {
    themeName,
    setTheme,
    isDarkMode,
    colors,
    availableThemes,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
