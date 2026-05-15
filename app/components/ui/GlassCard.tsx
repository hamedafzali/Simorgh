import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
} from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  intensity?: number;
  showAccentBar?: boolean;
};

export function GlassCard({
  children,
  onPress,
  style,
  contentStyle,
  showAccentBar = true,
}: Props) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  const Container: any = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      style={({ pressed }: { pressed?: boolean }) => [
        styles.outer,
        {
          backgroundColor:
            colorScheme === "dark"
              ? "rgba(24,33,47,0.94)"
              : "rgba(255,255,255,0.96)",
          borderColor:
            colorScheme === "dark"
              ? "rgba(76,201,255,0.14)"
              : "rgba(88,204,2,0.16)",
          shadowOpacity: colorScheme === "dark" ? 0.22 : 0.08,
        },
        onPress && pressed ? styles.pressed : null,
        style,
      ]}
    >
      <View style={[styles.inner, contentStyle]}>{children}</View>
      {showAccentBar ? (
        <View
          pointerEvents="none"
          style={[
            styles.accentBar,
            {
              backgroundColor:
                colorScheme === "dark"
                  ? "rgba(76,201,255,0.55)"
                  : "rgba(88,204,2,0.92)",
            },
          ]}
        />
      ) : null}
    </Container>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    overflow: "hidden",
    ...Shadows.card,
  },
  inner: {
    padding: Spacing.lg,
  },
  accentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  pressed: {
    transform: [{ scale: 0.992 }],
  },
});
