import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
} from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";

type Props = {
  front: string;
  back: string;
  hint?: string;
  showBack: boolean;
  onFlip?: () => void;
};

export function FlipCard({ front, back, hint, showBack, onFlip }: Props) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const [flipAnimation] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.spring(flipAnimation, {
      toValue: showBack ? 1 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  }, [showBack, flipAnimation]);

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  const frontOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  const backOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
    opacity: frontOpacity,
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
    opacity: backOpacity,
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onFlip}
      activeOpacity={0.9}
    >
      {/* Front of card */}
      <Animated.View
        style={[
          styles.card,
          styles.cardFront,
          frontAnimatedStyle,
          {
            backgroundColor: palette.surface,
            borderColor: palette.borderLight,
          },
        ]}
      >
        <Text
          style={[
            styles.cardText,
            {
              color: palette.textPrimary,
            },
          ]}
        >
          {front}
        </Text>
        <Text
          style={[
            styles.cardHint,
            {
              color: palette.textSecondary,
            },
          ]}
        >
          Tap to reveal
        </Text>
      </Animated.View>

      {/* Back of card */}
      <Animated.View
        style={[
          styles.card,
          styles.cardBack,
          backAnimatedStyle,
          {
            backgroundColor: palette.surface,
            borderColor: palette.borderLight,
          },
        ]}
      >
        <Text
          style={[
            styles.cardText,
            {
              color: palette.textPrimary,
            },
          ]}
        >
          {back}
        </Text>
        {hint && (
          <Text
            style={[
              styles.cardHint,
              {
                color: palette.textSecondary,
              },
            ]}
          >
            Hint: {hint}
          </Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    position: "relative",
  },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    justifyContent: "center",
    alignItems: "center",
    backfaceVisibility: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardFront: {
    zIndex: 1,
  },
  cardBack: {
    zIndex: 1,
  },
  cardText: {
    fontSize: Typography.sizes.headingM,
    fontWeight: Typography.fontWeight.bold,
    textAlign: "center",
    lineHeight: 28,
  },
  cardHint: {
    fontSize: Typography.sizes.bodySecondary,
    textAlign: "center",
    marginTop: Spacing.sm,
    fontStyle: "italic",
  },
});
