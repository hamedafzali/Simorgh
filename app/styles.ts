import { StyleSheet } from "react-native";
import { Spacing, Typography } from "./constants/theme";

export const homeStyles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  brandBlock: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: Typography.fontWeight.bold,
    lineHeight: 40,
    letterSpacing: -0.4,
  },
  brandSubtitle: {
    marginTop: 4,
    fontSize: Typography.sizes.bodySecondary,
    lineHeight: 20,
  },
  brandMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginTop: 6,
  },
  brandMetaText: {
    fontSize: Typography.sizes.bodySecondary,
    lineHeight: 20,
  },
  topBarActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryCard: {
    marginBottom: Spacing.md,
    shadowColor: "#58CC02",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 3,
  },
  primaryEyebrow: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.fontWeight.semibold,
    letterSpacing: 0.3,
  },
  primaryTitle: {
    marginTop: Spacing.sm,
    fontSize: 30,
    fontWeight: Typography.fontWeight.bold,
    lineHeight: 36,
  },
  primarySubtitle: {
    marginTop: Spacing.xs,
    fontSize: Typography.sizes.bodySecondary,
    lineHeight: 22,
  },
  primaryButton: {
    marginTop: Spacing.lg,
    minHeight: 52,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  primaryButtonText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.fontWeight.semibold,
  },
  sectionCard: {
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    marginBottom: Spacing.md,
  },
  sectionHeaderCompact: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.headingM,
    fontWeight: Typography.fontWeight.bold,
  },
  sectionHint: {
    marginTop: 4,
    fontSize: Typography.sizes.bodySmall,
    lineHeight: 18,
    maxWidth: 280,
  },
  sectionLink: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.fontWeight.semibold,
  },
  pathStack: {
    gap: Spacing.sm,
  },
  pathItemPrimary: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  pathItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  pathIconPrimary: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  pathIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  pathCopy: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  pathTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.fontWeight.semibold,
  },
  pathSubtitle: {
    marginTop: 4,
    fontSize: Typography.sizes.bodySmall,
    lineHeight: 18,
  },
  pathBadge: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  pathBadgeText: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.fontWeight.semibold,
  },
  pinnedGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  pinnedItem: {
    minWidth: "48%",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  pinnedText: {
    flex: 1,
    fontSize: Typography.sizes.bodySecondary,
    fontWeight: Typography.fontWeight.semibold,
  },
});
