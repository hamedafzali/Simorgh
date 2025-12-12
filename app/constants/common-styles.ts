import { StyleSheet } from "react-native";
import { BorderRadius, Spacing } from "./theme";

/**
 * Centralized common styles to reduce duplication across components
 * These are reusable style patterns used throughout the app
 */

// Base layout styles
export const Layout = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
});

// Header styles (used across multiple screens)
export const Header = StyleSheet.create({
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100, // Optimized height for narrow header
    zIndex: 5,
  },
  glassHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100, // Match gradient height
    paddingTop: 50, // Status bar
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    zIndex: 20,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 40, // Ensure proper height for content
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginHorizontal: Spacing.sm,
    marginTop: -35, // Move text up
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(20px)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -48, // Move button up more
  },
  headerSpacer: {
    width: 36,
    height: 36,
  },
});

// Card styles
export const Card = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  glass: {
    backgroundColor: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  elevated: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
});

// Button styles
export const Button = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  small: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  ghost: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
});

// Input styles
export const Input = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    minHeight: 44,
  },
  search: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: 16,
    marginBottom: Spacing.md,
  },
});

// List styles
export const List = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  itemWithBorderLeft: {
    borderLeftWidth: 3,
    borderLeftColor: "#3B82F6",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
});

// Animation styles
export const Animation = StyleSheet.create({
  fadeIn: {
    opacity: 0,
  },
  slideUp: {
    transform: [{ translateY: 20 }],
  },
});

// Utility styles
export const Utility = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowSpaceBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  textCenter: {
    textAlign: "center",
  },
  fullHeight: {
    height: "100%",
  },
  fullWidth: {
    width: "100%",
  },
});

// Spacing utilities
export const SpacingUtils = StyleSheet.create({
  xs: { margin: Spacing.xs },
  sm: { margin: Spacing.sm },
  md: { margin: Spacing.md },
  lg: { margin: Spacing.lg },
  xl: { margin: Spacing.xl },

  pXs: { padding: Spacing.xs },
  pSm: { padding: Spacing.sm },
  pMd: { padding: Spacing.md },
  pLg: { padding: Spacing.lg },
  pXl: { padding: Spacing.xl },

  mXs: { margin: Spacing.xs },
  mSm: { margin: Spacing.sm },
  mMd: { margin: Spacing.md },
  mLg: { margin: Spacing.lg },
  mXl: { margin: Spacing.xl },
});

// Style helpers for combining styles
export const createStyle = (base: any, overrides: any) => [base, overrides];

// Common responsive breakpoints
export const Breakpoints = {
  small: 320,
  medium: 768,
  large: 1024,
};

// Common z-index values
export const ZIndex = {
  background: 0,
  content: 1,
  header: 10,
  overlay: 20,
  modal: 100,
  toast: 200,
};
