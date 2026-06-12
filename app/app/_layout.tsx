import { useEffect } from "react";
import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  Vazirmatn_400Regular,
  Vazirmatn_600SemiBold,
  Vazirmatn_700Bold,
} from "@expo-google-fonts/vazirmatn";
import { PreferencesProvider, usePreferences } from "../contexts/PreferencesContext";
import { DatabaseProvider } from "../contexts/DatabaseContext";
import { FeatureFlagsProvider } from "../contexts/FeatureFlagsContext";
import { CountriesProvider } from "../contexts/CountriesContext";
import { ErrorBoundary } from "../components/ErrorBoundary";
import OnboardingScreen from "./onboarding";
import { addNotificationResponseListener } from "../services/notifications";
import { track, flushAnalytics } from "../services/analytics";

SplashScreen.preventAutoHideAsync();

function AppNavigator() {
  const { onboardingDone, prefsLoaded } = usePreferences();

  useEffect(() => {
    if (prefsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [prefsLoaded]);

  useEffect(() => {
    void track("app_open").then(() => flushAnalytics());
  }, []);

  useEffect(() => {
    const sub = addNotificationResponseListener((response) => {
      const url = response.notification.request.content.data?.url as string | undefined;
      if (url) {
        const { router } = require("expo-router");
        router.push(url);
      }
    });
    return () => sub.remove();
  }, []);

  if (!prefsLoaded) return null;
  if (!onboardingDone) return <OnboardingScreen />;
  return <Slot />;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Vazirmatn_400Regular,
    Vazirmatn_600SemiBold,
    Vazirmatn_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Splash will be hidden by AppNavigator once prefs also load
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ErrorBoundary>
      <PreferencesProvider>
        <DatabaseProvider>
          <CountriesProvider>
            <FeatureFlagsProvider>
              <AppNavigator />
            </FeatureFlagsProvider>
          </CountriesProvider>
        </DatabaseProvider>
      </PreferencesProvider>
    </ErrorBoundary>
  );
}
