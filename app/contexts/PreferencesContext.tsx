import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getJson, setJson } from "../services/localStore";

export type AppLanguage = "fa" | "de" | "en";
export type AppDirection = "rtl" | "ltr";

export type AppLocation = {
  state: string;
  city: string;
  postalCode?: string;
  lat?: number;
  lon?: number;
  source: "manual" | "device";
};

type PreferencesState = {
  language: AppLanguage;
  direction: AppDirection;
  isRTL: boolean;
  location: AppLocation | null;
  useDeviceLocation: boolean;
  country: string;
  onboardingDone: boolean;
  prefsLoaded: boolean;
  setLanguage: (language: AppLanguage) => void;
  setDirection: (direction: AppDirection) => void;
  setLocation: (location: AppLocation | null) => void;
  setUseDeviceLocation: (value: boolean) => void;
  setCountry: (country: string) => void;
  setOnboardingDone: (done: boolean) => void;
};

const PreferencesContext = createContext<PreferencesState | null>(null);

export function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguageRaw] = useState<AppLanguage>("fa");
  const [direction, setDirectionRaw] = useState<AppDirection>("rtl");
  const [location, setLocationRaw] = useState<AppLocation | null>(null);
  const [useDeviceLocation, setUseDeviceLocationRaw] = useState(false);
  const [country, setCountryRaw] = useState<string>("DE");
  const [onboardingDone, setOnboardingDoneRaw] = useState(false);
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const [lang, dir, ctr, onboarded] = await Promise.all([
        getJson<AppLanguage>("pref:language", "fa"),
        getJson<AppDirection>("pref:direction", "rtl"),
        getJson<string>("pref:country", "DE"),
        getJson<boolean>("pref:onboardingDone", false),
      ]);
      setLanguageRaw(lang);
      setDirectionRaw(dir);
      setCountryRaw(ctr);
      setOnboardingDoneRaw(onboarded);
      setPrefsLoaded(true);
    })();
  }, []);

  const setLanguage = useCallback((lang: AppLanguage) => {
    setLanguageRaw(lang);
    void setJson("pref:language", lang);
  }, []);

  const setDirection = useCallback((dir: AppDirection) => {
    setDirectionRaw(dir);
    void setJson("pref:direction", dir);
  }, []);

  const setCountry = useCallback((ctr: string) => {
    setCountryRaw(ctr);
    void setJson("pref:country", ctr);
  }, []);

  const setOnboardingDone = useCallback((done: boolean) => {
    setOnboardingDoneRaw(done);
    void setJson("pref:onboardingDone", done);
  }, []);

  const setLocation = useCallback((loc: AppLocation | null) => {
    setLocationRaw(loc);
  }, []);

  const setUseDeviceLocation = useCallback((value: boolean) => {
    setUseDeviceLocationRaw(value);
  }, []);

  const value = useMemo<PreferencesState>(() => {
    const isRTL = direction === "rtl";
    return {
      language,
      direction,
      isRTL,
      location,
      useDeviceLocation,
      country,
      onboardingDone,
      prefsLoaded,
      setLanguage,
      setDirection,
      setLocation,
      setUseDeviceLocation,
      setCountry,
      setOnboardingDone,
    };
  }, [
    language,
    direction,
    location,
    useDeviceLocation,
    country,
    onboardingDone,
    prefsLoaded,
    setLanguage,
    setDirection,
    setLocation,
    setUseDeviceLocation,
    setCountry,
    setOnboardingDone,
  ]);

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }
  return ctx;
}
