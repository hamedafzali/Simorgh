// Basic theme for splash screen
export const Colors = {
  light: {
    primary: "#1F3A5F",
    primaryLight: "#2F5D8A",
    accentGreen: "#2FA36B",
    accentGreenSoft: "#E6F4EE",
    background: "#F7F9FC",
    surface: "#FFFFFF",
    borderLight: "#E3E8EF",
    textPrimary: "#1E293B",
    textSecondary: "#64748B",
    textMuted: "#94A3B8",
    white: "#FFFFFF",
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
  },
  dark: {
    primary: "#2F5D8A",
    primaryLight: "#1F3A5F",
    accentGreen: "#2FA36B",
    accentGreenSoft: "#163427",
    background: "#0F172A",
    surface: "#111B2E",
    borderLight: "#22304A",
    textPrimary: "#F8FAFC",
    textSecondary: "#CBD5E1",
    textMuted: "#94A3B8",
    white: "#FFFFFF",
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
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
  },
};

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
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
    elevation: 2,
  },
  button: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 2,
  },
};
