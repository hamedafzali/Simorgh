import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useTheme } from "@/contexts/theme-context";
import { Spacing, BorderRadius } from "@/constants/theme";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  variant?: "rectangular" | "circular" | "text";
  style?: any;
}

export function Skeleton({
  width = "100%",
  height = 20,
  variant = "rectangular",
  style,
}: SkeletonProps) {
  const { colors } = useTheme();
  const shimmerAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const shimmer = Animated.sequence([
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(shimmerAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]);

    const loop = Animated.loop(shimmer);
    loop.start();

    return () => loop.stop();
  }, [shimmerAnim]);

  const shimmerStyle = {
    opacity: shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    }),
  };

  const baseStyle = {
    backgroundColor: colors.border,
    overflow: "hidden" as const,
  };

  const variantStyles = {
    rectangular: {
      width,
      height,
      borderRadius: BorderRadius.md,
    },
    circular: {
      width: height,
      height,
      borderRadius: height / 2,
    },
    text: {
      width,
      height,
      borderRadius: BorderRadius.sm,
    },
  };

  return (
    <View style={[baseStyle, variantStyles[variant], style]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: colors.textMuted,
            ...shimmerStyle,
          },
        ]}
      />
    </View>
  );
}

interface SkeletonCardProps {
  showAvatar?: boolean;
  lines?: number;
  style?: any;
}

export function SkeletonCard({
  showAvatar = false,
  lines = 3,
  style,
}: SkeletonCardProps) {
  return (
    <View style={[styles.card, style]}>
      {showAvatar && (
        <Skeleton
          width={40}
          height={40}
          variant="circular"
          style={styles.avatar}
        />
      )}
      <View style={styles.content}>
        <Skeleton height={20} width="60%" style={styles.title} />
        <View style={styles.lines}>
          {Array.from({ length: lines }).map((_, index) => (
            <Skeleton
              key={index}
              height={16}
              width={index === lines - 1 ? "80%" : "100%"}
              style={styles.line}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

interface SkeletonListProps {
  count?: number;
  showAvatar?: boolean;
  lines?: number;
}

export function SkeletonList({
  count = 3,
  showAvatar = false,
  lines = 3,
}: SkeletonListProps) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard
          key={index}
          showAvatar={showAvatar}
          lines={lines}
          style={styles.listItem}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: Spacing.md,
    backgroundColor: "transparent",
  },
  avatar: {
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  lines: {
    gap: Spacing.xs,
  },
  line: {
    marginBottom: Spacing.xs,
  },
  list: {
    gap: Spacing.sm,
  },
  listItem: {
    marginBottom: Spacing.sm,
  },
});
