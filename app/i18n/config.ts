import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import translation files
import en from "./locales/en.json";
import de from "./locales/de.json";
import fa from "./locales/fa.json";
import phrases from "./locales/phrases.json";
import events from "./locales/events.json";
import jobs from "./locales/jobs.json";

const resources = {
  en: {
    translation: { ...en, ...phrases, ...events, ...jobs },
  },
  de: {
    translation: { ...de, ...phrases, ...events, ...jobs },
  },
  fa: {
    translation: { ...fa, ...phrases, ...events, ...jobs },
  },
};

const LANGUAGE_KEY = "app_language";

export const initI18n = async () => {
  // Get saved language or use device language
  let savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
  
  if (!savedLanguage) {
 {
    // Fallback to English if no saved language
    savedLanguage = "en";
  }

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: savedLanguage,
      fallbackLng: "en",
      
      interpolation: {
        escapeValue: false,
      },

      react: {
        useSuspense: false,
      },

      debug: __DEV__,
    });

  return i18n;
};

export const changeLanguage = async (language: string) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
    await i18n.changeLanguage(language);
  } catch (error) {
    console.error("Error changing language:", error);
  }
};

export const getCurrentLanguage = () => i18n.language;

export default i18n;
