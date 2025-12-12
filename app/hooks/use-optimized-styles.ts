import { useTheme } from "@/contexts/theme-context";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

/**
 * Hook for optimizing style performance and ensuring theme consistency
 * Reduces style recalculations and provides memoized style objects
 */

export const useOptimizedStyles = <T extends Record<string, any>>(
  styleFactory: (theme: any) => T,
  deps: any[] = []
): T => {
  const { colors } = useTheme();

  return useMemo(() => {
    return styleFactory(colors);
  }, [colors, ...deps]);
};

/**
 * Helper for creating theme-aware styles with performance optimization
 */
export const createThemedStyles = <T extends Record<string, any>>(
  styleDefinition: (colors: any) => T
) => {
  return (colors: any): T => {
    return StyleSheet.create(styleDefinition(colors));
  };
};

/**
 * Common style patterns with theme integration
 */
export const useCommonStyles = () => {
  const { colors } = useTheme();

  return useMemo(
    () => ({
      // Themed containers
      themedContainer: {
        backgroundColor: colors.background,
        flex: 1,
      },

      // Themed cards
      themedCard: {
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
      },

      // Themed text
      themedText: {
        color: colors.text,
      },

      // Themed muted text
      themedMutedText: {
        color: colors.textMuted,
      },

      // Themed primary button
      themedPrimaryButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: "center",
        justifyContent: "center",
      },

      // Themed secondary button
      themedSecondaryButton: {
        backgroundColor: "transparent",
        borderColor: colors.primary,
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: "center",
        justifyContent: "center",
      },

      // Themed input
      themedInput: {
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        color: colors.text,
      },

      // Glass effect with theme
      themedGlass: {
        backgroundColor: colors.card + "0D", // Add transparency
        backdropFilter: "blur(20px)",
        borderWidth: 1,
        borderColor: colors.border + "40", // Add transparency
      },
    }),
    [colors]
  );
};

/**
 * Performance-optimized style merging utility
 */
export const mergeStyles = <T extends any[]>(...styles: T): T[number] => {
  return Object.assign({}, ...styles) as T[number];
};

/**
 * Conditional style utility for dynamic styling
 */
export const conditionalStyles = <T extends Record<string, any>>(
  baseStyle: T,
  conditions: Record<string, boolean>
): Partial<T> => {
  const result: Partial<T> = {};

  Object.entries(conditions).forEach(([key, condition]) => {
    if (condition && key in baseStyle) {
      result[key as keyof T] = baseStyle[key as keyof T];
    }
  });

  return result;
};

/**
 * Responsive style utility for different screen sizes
 */
export const useResponsiveStyles = <T extends Record<string, any>>(
  styles: {
    small?: Partial<T>;
    medium?: Partial<T>;
    large?: Partial<T>;
    base: T;
  },
  screenWidth: number
): T => {
  return useMemo(() => {
    let result = { ...styles.base };

    if (screenWidth < 768 && styles.small) {
      result = { ...result, ...styles.small };
    } else if (screenWidth >= 768 && screenWidth < 1024 && styles.medium) {
      result = { ...result, ...styles.medium };
    } else if (screenWidth >= 1024 && styles.large) {
      result = { ...result, ...styles.large };
    }

    return result;
  }, [styles, screenWidth]);
};

/**
 * Animation style utilities
 */
export const useAnimationStyles = () => {
  return useMemo(
    () => ({
      fadeIn: {
        opacity: 0,
      },
      fadeOut: {
        opacity: 1,
      },
      slideUp: {
        transform: [{ translateY: 20 }],
      },
      slideDown: {
        transform: [{ translateY: -20 }],
      },
      scaleUp: {
        transform: [{ scale: 0.95 }],
      },
      scaleDown: {
        transform: [{ scale: 1.05 }],
      },
    }),
    []
  );
};
