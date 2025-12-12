import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

import { getAllJobMeta, type JobMeta } from "@/services/jobs";
import {
  loadProgressSummary,
  type LearnProgressSummary,
} from "@/services/learnProgress";

export type AppStateContextValue = {
  regionState: string | null;
  regionCity: string | null;
  onboardingCompleted: boolean;
  loading: boolean;
  setRegion: (state: string | null, city: string | null) => Promise<void>;
  markOnboardingCompleted: () => Promise<void>;
  learnSummary: LearnProgressSummary | null;
  jobFavorites: number;
  jobInterested: number;
  refreshGlobalProgress: () => Promise<void>;
};

const AppStateContext = createContext<AppStateContextValue | undefined>(
  undefined
);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [regionState, setRegionState] = useState<string | null>(null);
  const [regionCity, setRegionCity] = useState<string | null>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [learnSummary, setLearnSummary] = useState<LearnProgressSummary | null>(
    null
  );
  const [jobFavorites, setJobFavorites] = useState(0);
  const [jobInterested, setJobInterested] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const [[, storedState], [, storedCity], [, onboarding]] =
          await AsyncStorage.multiGet([
            "Simorgh.regionState",
            "Simorgh.regionCity",
            "Simorgh.onboardingCompleted",
          ]);
        if (!isMounted) return;
        setRegionState(storedState ?? null);
        setRegionCity(storedCity ?? null);
        setOnboardingCompleted(onboarding === "true");
        await refreshGlobalProgress();
      } catch (error) {
        console.warn("AppStateProvider load error", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const setRegion = async (state: string | null, city: string | null) => {
    setRegionState(state);
    setRegionCity(city);
    try {
      const entries: [string, string][] = [];
      if (state != null) entries.push(["Simorgh.regionState", state]);
      if (city != null) entries.push(["Simorgh.regionCity", city]);
      if (entries.length > 0) {
        await AsyncStorage.multiSet(entries);
      }
    } catch (error) {
      console.warn("AppStateProvider setRegion error", error);
    }
  };

  const markOnboardingCompleted = async () => {
    setOnboardingCompleted(true);
    try {
      await AsyncStorage.setItem("Simorgh.onboardingCompleted", "true");
    } catch (error) {
      console.warn("AppStateProvider markOnboardingCompleted error", error);
    }
  };

  const refreshGlobalProgress = async () => {
    try {
      const [summary, meta] = await Promise.all([
        loadProgressSummary(),
        getAllJobMeta(),
      ]);
      setLearnSummary(summary);
      const favorites = meta.filter((m: JobMeta) => m.favorite).length;
      const interested = meta.filter((m: JobMeta) => m.interested).length;
      setJobFavorites(favorites);
      setJobInterested(interested);
    } catch (error) {
      console.warn("AppStateProvider refreshGlobalProgress error", error);
    }
  };

  return React.createElement(
    AppStateContext.Provider,
    {
      value: {
        regionState,
        regionCity,
        onboardingCompleted,
        loading,
        setRegion,
        markOnboardingCompleted,
        learnSummary,
        jobFavorites,
        jobInterested,
        refreshGlobalProgress,
      },
    },
    children
  );
}

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return ctx;
}
