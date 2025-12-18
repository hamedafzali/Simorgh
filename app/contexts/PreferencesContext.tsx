import React, { createContext, useContext, useMemo, useState } from "react";

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
  setLanguage: (language: AppLanguage) => void;
  setDirection: (direction: AppDirection) => void;
  setLocation: (location: AppLocation | null) => void;
  setUseDeviceLocation: (value: boolean) => void;
};

const PreferencesContext = createContext<PreferencesState | null>(null);

export function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<AppLanguage>("fa");
  const [direction, setDirection] = useState<AppDirection>("rtl");
  const [location, setLocation] = useState<AppLocation | null>(null);
  const [useDeviceLocation, setUseDeviceLocation] = useState(false);

  const value = useMemo<PreferencesState>(() => {
    const isRTL = direction === "rtl";
    return {
      language,
      direction,
      isRTL,
      location,
      useDeviceLocation,
      setLanguage,
      setDirection,
      setLocation,
      setUseDeviceLocation,
    };
  }, [language, direction, location, useDeviceLocation]);

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
