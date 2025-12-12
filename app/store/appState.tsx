import React, { createContext, ReactNode, useContext, useState } from "react";

interface AppStateContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(
  undefined
);

interface AppStateProviderProps {
  children: ReactNode;
}

export function AppStateProvider({ children }: AppStateProviderProps) {
  const [isLoading, setIsLoading] = useState(false);

  const value: AppStateContextType = {
    isLoading,
    setIsLoading,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}
