// Basic theme for splash screen
export const Colors = {
  light: {
    primary: "#1F3A5F",
    background: "#F7F9FC",
    textPrimary: "#1E293B",
    textSecondary: "#64748B",
    white: "#FFFFFF",
  },
  dark: {
    primary: "#2F5D8A",
    background: "#0F172A",
    textPrimary: "#F8FAFC",
    textSecondary: "#CBD5E1",
    white: "#FFFFFF",
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
    body: 16,
    caption: 12,
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
  md: 12,
  sm: 8,
};
