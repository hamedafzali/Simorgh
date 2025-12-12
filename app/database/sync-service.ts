import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View } from "react-native";
import "react-native-reanimated";

import SplashScreen from "@/components/SplashScreen";
import { ThemeProvider as AppThemeProvider } from "@/contexts/theme-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import "@/i18n/config";
import { AppStateProvider } from "@/store/appState";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Simple timer: show custom splash for ~2 seconds
    const timeout = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  if (showSplash) {
    return <SplashScreenComponent />;
  }

  return (
    <View style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AppThemeProvider>
          <AppStateProvider>
            <Stack
              screenOptions={{
                headerBackTitle: "",
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="onboarding"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="events" options={{ title: "Events" }} />
              <Stack.Screen
                name="local-info"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="jobs" options={{ headerShown: false }} />
              <Stack.Screen name="job/[id]" options={{ headerShown: false }} />
              <Stack.Screen
                name="learn-practice"
                options={{ title: "Daily Practice" }}
              />
              <Stack.Screen name="learn-quiz" options={{ title: "Quiz" }} />
              <Stack.Screen
                name="learn-tutor"
                options={{ title: "AI Tutor" }}
              />
              <Stack.Screen name="chat" options={{ headerShown: false }} />
              <Stack.Screen name="radio" options={{ headerShown: false }} />
              <Stack.Screen name="tools" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{ presentation: "modal", title: "Modal" }}
              />
            </Stack>
          </AppStateProvider>
        </AppThemeProvider>
      </ThemeProvider>
    </View>
  );
}
