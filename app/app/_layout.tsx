import { Slot } from "expo-router";
import { PreferencesProvider } from "../contexts/PreferencesContext";
import { DatabaseProvider } from "../contexts/DatabaseContext";

export default function RootLayout() {
  return (
    <PreferencesProvider>
      <DatabaseProvider>
        <Slot />
      </DatabaseProvider>
    </PreferencesProvider>
  );
}
