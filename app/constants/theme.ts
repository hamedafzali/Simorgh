import type { AppLanguage } from "../contexts/PreferencesContext";

// Basic theme for splash screen
export const Colors = {
  light: {
    primary: "#58CC02",
    primaryLight: "#7DDB39",
    accentGreen: "#58CC02",
    accentGreenSoft: "#EAF8D8",
    background: "#F7F7F3",
    surface: "#FFFFFF",
    borderLight: "#E5E7EB",
    textPrimary: "#1F2937",
    textSecondary: "#6B7280",
    textMuted: "#9CA3AF",
    white: "#FFFFFF",
    textOnPrimary: "#FFFFFF",
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#1CB0F6",
  },
  dark: {
    primary: "#7DDB39",
    primaryLight: "#9EEA66",
    accentGreen: "#7DDB39",
    accentGreenSoft: "#22351A",
    background: "#111827",
    surface: "#18212F",
    borderLight: "#2C3748",
    textPrimary: "#F9FAFB",
    textSecondary: "#CBD5E1",
    textMuted: "#94A3B8",
    white: "#FFFFFF",
    textOnPrimary: "#0F172A",
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#4CC9FF",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const Typography = {
  sizes: {
    headingXl: 24,
    headingL: 20,
    headingM: 18,
    body: 16,
    bodySecondary: 14,
    bodySmall: 12,
    caption: 11,
  },
  fontWeight: {
    normal: "400" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
  fontFamily: {
    primary: "Inter",
    system: "system-ui",
    faRegular: "Vazirmatn_400Regular",
    faSemiBold: "Vazirmatn_600SemiBold",
    faBold: "Vazirmatn_700Bold",
  },
};

export function getTextFontFamily(
  language: AppLanguage,
  weight: "normal" | "semibold" | "bold" = "normal"
) {
  if (language !== "fa") {
    return undefined;
  }

  if (weight === "bold") {
    return Typography.fontFamily.faBold;
  }

  if (weight === "semibold") {
    return Typography.fontFamily.faSemiBold;
  }

  return Typography.fontFamily.faRegular;
}

export const BorderRadius = {
  full: 9999,
  lg: 16,
  button: 14,
  md: 12,
  sm: 8,
};

export const Shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  button: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 2,
  },
};
