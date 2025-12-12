import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

// Global state to share theme across components
let globalTheme: "light" | "dark" = "dark";
let themeListeners: ((theme: "light" | "dark") => void)[] = [];

export function useColorScheme() {
  const [colorScheme, setColorScheme] = useState<"light" | "dark">(globalTheme);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("Simorgh.darkMode");
        const newTheme = savedTheme === "true" ? "dark" : "light";
        globalTheme = newTheme;
        setColorScheme(newTheme);

        // Notify all listeners
        themeListeners.forEach((listener) => listener(newTheme));
      } catch (error) {
        console.warn("Error loading theme:", error);
      }
    };

    loadTheme();

    // Listen for theme changes
    const handleThemeChange = (theme: "light" | "dark") => {
      setColorScheme(theme);
    };

    themeListeners.push(handleThemeChange);

    // Poll for theme changes more frequently
    const interval = setInterval(loadTheme, 500);

    return () => {
      themeListeners = themeListeners.filter(
        (listener) => listener !== handleThemeChange
      );
      clearInterval(interval);
    };
  }, []);

  return colorScheme;
}

// Function to manually trigger theme update
export function updateTheme() {
  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("Simorgh.darkMode");
      const newTheme = savedTheme === "true" ? "dark" : "light";
      globalTheme = newTheme;

      // Notify all listeners
      themeListeners.forEach((listener) => listener(newTheme));
    } catch (error) {
      console.warn("Error updating theme:", error);
    }
  };

  loadTheme();
}
