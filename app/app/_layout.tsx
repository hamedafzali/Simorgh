import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import {
  Vazirmatn_400Regular,
  Vazirmatn_600SemiBold,
  Vazirmatn_700Bold,
} from "@expo-google-fonts/vazirmatn";
import { PreferencesProvider } from "../contexts/PreferencesContext";
import { DatabaseProvider } from "../contexts/DatabaseContext";
import { FeatureFlagsProvider } from "../contexts/FeatureFlagsContext";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Vazirmatn_400Regular,
    Vazirmatn_600SemiBold,
    Vazirmatn_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <PreferencesProvider>
      <DatabaseProvider>
        <FeatureFlagsProvider>
          <Slot />
        </FeatureFlagsProvider>
      </DatabaseProvider>
    </PreferencesProvider>
  );
}
