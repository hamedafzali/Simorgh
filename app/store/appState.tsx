import React, { createContext, useContext, useReducer, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface LearnSummary {
  totalReviews: number;
  streakDays: number;
  accuracy: number;
  timeSpent: number;
}

export interface AppState {
  learnSummary?: LearnSummary;
  jobFavorites: number;
  jobInterested: number;
  notifications: boolean;
  theme: string;
  language: string;
  isLoading: boolean;
}

type AppAction =
  | { type: "SET_LEARN_SUMMARY"; payload: LearnSummary }
  | { type: "SET_JOB_FAVORITES"; payload: number }
  | { type: "SET_JOB_INTERESTED"; payload: number }
  | { type: "SET_NOTIFICATIONS"; payload: boolean }
  | { type: "SET_THEME"; payload: string }
  | { type: "SET_LANGUAGE"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "LOAD_STATE"; payload: AppState };

const initialState: AppState = {
  jobFavorites: 0,
  jobInterested: 0,
  notifications: true,
  theme: "light",
  language: "en",
  isLoading: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_LEARN_SUMMARY":
      return { ...state, learnSummary: action.payload };
    case "SET_JOB_FAVORITES":
      return { ...state, jobFavorites: action.payload };
    case "SET_JOB_INTERESTED":
      return { ...state, jobInterested: action.payload };
    case "SET_NOTIFICATIONS":
      return { ...state, notifications: action.payload };
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "SET_LANGUAGE":
      return { ...state, language: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "LOAD_STATE":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  updateLearnSummary: (summary: LearnSummary) => void;
  updateJobFavorites: (count: number) => void;
  updateJobInterested: (count: number) => void;
  toggleNotifications: () => void;
  setTheme: (theme: string) => void;
  setLanguage: (language: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load initial state from AsyncStorage
  React.useEffect(() => {
    const loadState = async () => {
      try {
        const storedState = await AsyncStorage.getItem("app_state");
        if (storedState) {
          const parsedState = JSON.parse(storedState);
          dispatch({ type: "LOAD_STATE", payload: parsedState });
        }
      } catch (error) {
        console.error("Error loading app state:", error);
      }
    };

    loadState();
  }, []);

  // Save state to AsyncStorage whenever it changes
  React.useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem("app_state", JSON.stringify(state));
      } catch (error) {
        console.error("Error saving app state:", error);
      }
    };

    saveState();
  }, [state]);

  const updateLearnSummary = (summary: LearnSummary) => {
    dispatch({ type: "SET_LEARN_SUMMARY", payload: summary });
  };

  const updateJobFavorites = (count: number) => {
    dispatch({ type: "SET_JOB_FAVORITES", payload: count });
  };

  const updateJobInterested = (count: number) => {
    dispatch({ type: "SET_JOB_INTERESTED", payload: count });
  };

  const toggleNotifications = () => {
    dispatch({ type: "SET_NOTIFICATIONS", payload: !state.notifications });
  };

  const setTheme = (theme: string) => {
    dispatch({ type: "SET_THEME", payload: theme });
  };

  const setLanguage = (language: string) => {
    dispatch({ type: "SET_LANGUAGE", payload: language });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        updateLearnSummary,
        updateJobFavorites,
        updateJobInterested,
        toggleNotifications,
        setTheme,
        setLanguage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState(): AppStateContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}
