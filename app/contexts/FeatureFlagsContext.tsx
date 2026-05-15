import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AppState } from "react-native";
import { defaultFeatureFlags, getFeatureFlags, type FeatureFlags } from "../services/features";
import { useDatabase } from "./DatabaseContext";

type FeatureFlagsContextType = {
  featureFlags: FeatureFlags;
  refreshFeatureFlags: () => Promise<void>;
};

const FeatureFlagsContext = createContext<FeatureFlagsContextType | null>(null);

export function FeatureFlagsProvider({ children }: { children: React.ReactNode }) {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>(defaultFeatureFlags);
  const { isInitialized, isOnline, syncDatabaseVersion } = useDatabase();

  const refreshFeatureFlags = async () => {
    const flags = await getFeatureFlags();
    setFeatureFlags(flags);
  };

  useEffect(() => {
    if (!isInitialized) return;
    void refreshFeatureFlags();
  }, [isInitialized]);

  useEffect(() => {
    if (!isInitialized || !isOnline) return;
    void syncDatabaseVersion().then(refreshFeatureFlags);

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        void syncDatabaseVersion().then(refreshFeatureFlags);
      }
    });

    return () => sub.remove();
  }, [isInitialized, isOnline, syncDatabaseVersion]);

  const value = useMemo(
    () => ({ featureFlags, refreshFeatureFlags }),
    [featureFlags]
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
