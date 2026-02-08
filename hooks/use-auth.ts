import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  name: string;
  email: string;
  germanLevel: string;
  location: string;
  nativeLanguage: string;
  joinDate: Date;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    autoSync: boolean;
    language: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    userData: RegisterData
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  germanLevel: string;
  location: string;
  nativeLanguage: string;
}

const defaultContext: AuthContextType = {
  user: null,
  isLoading: true,
  login: async () => ({ success: false, error: "Context not available" }),
  register: async () => ({ success: false, error: "Context not available" }),
  logout: async () => {},
  updateUser: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simplified loading to avoid potential AsyncStorage issues
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Force loading to complete after 1 second

    return () => clearTimeout(timer);
  }, []);

  const loadUserFromStorage = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("authToken");

      if (userData && token) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Error loading user from storage:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      // Mock API call - replace with actual API
      const response = await mockLoginAPI(email, password);

      if (response.success) {
        const userData = response.user;
        setUser(userData);

        // Store user data and token
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        await AsyncStorage.setItem("authToken", response.token);

        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "An unexpected error occurred" };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    userData: RegisterData
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      // Validate input
      if (userData.password !== userData.confirmPassword) {
        return { success: false, error: "Passwords do not match" };
      }

      if (userData.password.length < 6) {
        return {
          success: false,
          error: "Password must be at least 6 characters",
        };
      }

      // Mock API call - replace with actual API
      const response = await mockRegisterAPI(userData);

      if (response.success) {
        const newUser = response.user;
        setUser(newUser);

        // Store user data and token
        await AsyncStorage.setItem("user", JSON.stringify(newUser));
        await AsyncStorage.setItem("authToken", response.token);

        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: "An unexpected error occurred" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear storage
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("authToken");

      // Clear state
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user) return;

      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);

      // Update storage
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Update user error:", error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Mock API functions - replace with actual API calls
const mockLoginAPI = async (email: string, password: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock validation
  if (email === "sara@example.com" && password === "password123") {
    return {
      success: true,
      user: {
        id: "1",
        name: "Sara Ahmadi",
        email: "sara@example.com",
        germanLevel: "B1",
        location: "Berlin, Germany",
        nativeLanguage: "Farsi",
        joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        preferences: {
          notifications: true,
          darkMode: false,
          autoSync: true,
          language: "English",
        },
      },
      token: "mock-jwt-token-12345",
    };
  }

  return {
    success: false,
    error: "Invalid email or password",
  };
};

const mockRegisterAPI = async (userData: RegisterData) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock validation - check if email already exists
  if (userData.email === "sara@example.com") {
    return {
      success: false,
      error: "Email already exists",
    };
  }

  return {
    success: true,
    user: {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      germanLevel: userData.germanLevel,
      location: userData.location,
      nativeLanguage: userData.nativeLanguage,
      joinDate: new Date(),
      preferences: {
        notifications: true,
        darkMode: false,
        autoSync: true,
        language: "English",
      },
    },
    token: "mock-jwt-token-" + Date.now(),
  };
};
