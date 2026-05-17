import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AppState } from "react-native";
import { defaultFeatureFlags, getFeatureFlagsForCountry, syncFeatureFlags, type FeatureFlags } from "../services/features";
import { useDatabase } from "./DatabaseContext";
import { usePreferences } from "./PreferencesContext";

type FeatureFlagsContextType = {
  featureFlags: FeatureFlags;
  refreshFeatureFlags: () => Promise<void>;
};

const FeatureFlagsContext = createContext<FeatureFlagsContextType | null>(null);

export function FeatureFlagsProvider({ children }: { children: React.ReactNode }) {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>(defaultFeatureFlags);
  const { isInitialized, isOnline, syncDatabaseVersion } = useDatabase();
  const { country } = usePreferences();

  const refreshFeatureFlags = useCallback(async () => {
    const flags = await getFeatureFlagsForCountry(country || "DE");
    setFeatureFlags(flags);
  }, [country]);

  const syncAndRefresh = useCallback(async () => {
    // Fetch flags directly from the lightweight endpoint first (fast, always up to date)
    const flagsSynced = await syncFeatureFlags();
    if (flagsSynced) {
      await refreshFeatureFlags();
    }
    // Also run the full database version sync in the background
    void syncDatabaseVersion();
  }, [refreshFeatureFlags, syncDatabaseVersion]);

  // Load cached flags immediately once DB is ready
  useEffect(() => {
    if (!isInitialized) return;
    void refreshFeatureFlags();
  }, [isInitialized, refreshFeatureFlags]);

  // Sync from backend when online
  useEffect(() => {
    if (!isInitialized || !isOnline) return;
    void syncAndRefresh();

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        void syncAndRefresh();
      }
    });

    return () => sub.remove();
  }, [isInitialized, isOnline, syncAndRefresh]);

  const value = useMemo(
    () => ({ featureFlags, refreshFeatureFlags }),
    [featureFlags, refreshFeatureFlags]
  );

  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error("useFeatureFlags must be used within FeatureFlagsProvider");
  }
  return context;
}
