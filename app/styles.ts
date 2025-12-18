import { StyleSheet, ViewStyle } from "react-native";
import { Spacing, Typography } from "./constants/theme";

export type ColorSchemeName = "dark" | "light";

export const homeStyles = StyleSheet.create({
  topCard: {
    marginBottom: Spacing.md,
  },
  menuCard: {
    marginBottom: Spacing.md,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
  },
  topLeft: {
    flex: 1,
  },
  topRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  divider: {
    width: 1,
    height: 44,
    opacity: 0.7,
  },
  topKicker: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.fontWeight.semibold,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  topPrimary: {
    marginTop: Spacing.xs,
    fontSize: Typography.sizes.headingL,
    fontWeight: Typography.fontWeight.bold,
    lineHeight: 26,
  },
  persianDate: {
    marginTop: 2,
    fontSize: Typography.sizes.bodySecondary,
    lineHeight: 20,
  },
  weatherRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  temp: {
    fontSize: Typography.sizes.headingL,
    fontWeight: Typography.fontWeight.bold,
    lineHeight: 26,
  },
  weatherHint: {
    marginTop: 2,
    fontSize: Typography.sizes.bodySecondary,
    lineHeight: 20,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: Spacing.sm,
  },
  menuItemBase: {
    width: "33.3333%",
    padding: Spacing.sm,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 92,
    overflow: "hidden",
  },
  menuPressed: {
    transform: [{ translateY: 1 }, { scale: 0.992 }],
  },
  menuHighlight: {
    position: "absolute",
    top: 1,
    left: 1,
    right: 1,
    height: 2,
    borderRadius: 16,
    opacity: 0.55,
  },
  menuShade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 18,
    opacity: 0.18,
  },
  menuIconBase: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  menuLabel: {
    marginTop: Spacing.sm,
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.fontWeight.semibold,
    textAlign: "center",
  },
  widgetGrid: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  col: {
    flex: 1,
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.sizes.headingM,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
  },
  sectionHint: {
    fontSize: Typography.sizes.bodySecondary,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  quickRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  quickItem: {
    flex: 1,
  },
});

export function getHomeMenuItemStyle(options: {
  colorScheme: ColorSchemeName;
  pressed: boolean;
}): ViewStyle {
  const { colorScheme, pressed } = options;

  const borderColor =
    colorScheme === "dark"
      ? "rgba(255,255,255,0.14)"
      : "rgba(255,255,255,0.55)";

  const backgroundColor =
    colorScheme === "dark"
      ? "rgba(255,255,255,0.06)"
      : "rgba(255,255,255,0.26)";

  return {
    borderColor,
    backgroundColor,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: colorScheme === "dark" ? 0.24 : 0.12,
    shadowRadius: 22,
    elevation: 3,
    opacity: pressed ? 0.96 : 1,
  };
}

export function getHomeMenuHighlightColor(colorScheme: ColorSchemeName) {
  return colorScheme === "dark"
    ? "rgba(255,255,255,0.10)"
    : "rgba(255,255,255,0.55)";
}

export function getHomeMenuShadeColor(colorScheme: ColorSchemeName) {
  return colorScheme === "dark" ? "rgba(0,0,0,0.20)" : "rgba(31,58,95,0.10)";
}

export function getHomeMenuIconStyle(options: {
  colorScheme: ColorSchemeName;
}): ViewStyle {
  const { colorScheme } = options;

  return {
    backgroundColor:
      colorScheme === "dark"
        ? "rgba(255,255,255,0.08)"
        : "rgba(255,255,255,0.34)",
    borderColor:
      colorScheme === "dark"
        ? "rgba(255,255,255,0.16)"
        : "rgba(255,255,255,0.55)",
  };
}
