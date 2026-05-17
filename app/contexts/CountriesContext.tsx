import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AppState } from "react-native";
import { getJson, setJson } from "../services/localStore";
import { API_BASE_URL, apiHeaders } from "../config/api";
import { supportedCountries as seedCountries } from "../services/countries-data";
import { useDatabase } from "./DatabaseContext";

export type AppCountry = {
  code: string;
  name: string;
  localName?: string;
  summary: string;
  enabled?: boolean;
};

type CountriesContextType = {
  countries: AppCountry[];
  refreshCountries: () => Promise<void>;
};

const STORAGE_KEY = "countries_list";

const CountriesContext = createContext<CountriesContextType | null>(null);

async function fetchAndCacheCountries(): Promise<AppCountry[] | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(`${API_BASE_URL}/countries`, { signal: controller.signal, headers: apiHeaders() });
    clearTimeout(timeout);
    if (!response.ok) return null;
    const data = await response.json();
    if (Array.isArray(data.countries)) {
      await setJson(STORAGE_KEY, data.countries);
      return data.countries;
    }
    return null;
  } catch {
    return null;
  }
}

export function CountriesProvider({ children }: { children: React.ReactNode }) {
  const [countries, setCountries] = useState<AppCountry[]>(seedCountries);
  const { isInitialized, isOnline } = useDatabase();

  const refreshCountries = useCallback(async () => {
    const cached = await getJson<AppCountry[]>(STORAGE_KEY, []);
    if (cached.length > 0) setCountries(cached);
  }, []);

  const syncCountries = useCallback(async () => {
    const fresh = await fetchAndCacheCountries();
    if (fresh && fresh.length > 0) setCountries(fresh);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    void refreshCountries();
  }, [isInitialized, refreshCountries]);

  useEffect(() => {
    if (!isInitialized || !isOnline) return;
    void syncCountries();

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") void syncCountries();
    });
    return () => sub.remove();
  }, [isInitialized, isOnline, syncCountries]);

  const value = useMemo(() => ({ countries, refreshCountries }), [countries, refreshCountries]);

  return (
    <CountriesContext.Provider value={value}>
      {children}
    </CountriesContext.Provider>
  );
}

export function useCountries() {
  const context = useContext(CountriesContext);
  if (!context) throw new Error("useCountries must be used within CountriesProvider");
  return context;
}
