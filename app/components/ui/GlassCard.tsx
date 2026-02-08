import React from "react";
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { BorderRadius, Colors, Spacing } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  intensity?: number;
};

export function GlassCard({
  children,
  onPress,
  style,
  contentStyle,
  intensity,
}: Props) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  const Container: any = onPress ? Pressable : View;

  const defaultIntensity = intensity ?? (colorScheme === "dark" ? 70 : 85);

  const tintOverlay =
    Platform.OS === "android"
      ? colorScheme === "dark"
        ? "rgba(17,27,46,0.85)"
        : "rgba(255,255,255,0.78)"
      : colorScheme === "dark"
      ? "rgba(17,27,46,0.10)"
      : "rgba(255,255,255,0.12)";

  return (
    <Container
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      style={({ pressed }: { pressed?: boolean }) => [
        styles.outer,
        {
          borderColor:
            colorScheme === "dark"
              ? "rgba(255,255,255,0.10)"
              : "rgba(255,255,255,0.55)",
        },
        onPress && pressed ? styles.pressed : null,
        style,
      ]}
    >
      <BlurView
        intensity={defaultIntensity}
        tint={colorScheme === "dark" ? "dark" : "light"}
        style={styles.blur}
      >
        <View
          style={[styles.inner, { backgroundColor: tintOverlay }, contentStyle]}
        >
          {children}
        </View>

        <LinearGradient
          pointerEvents="none"
          colors={
            colorScheme === "dark"
              ? ([
                  "rgba(255,255,255,0.10)",
                  "rgba(255,255,255,0.03)",
                  "rgba(255,255,255,0.00)",
                ] as const)
              : ([
                  "rgba(255,255,255,0.55)",
                  "rgba(255,255,255,0.18)",
                  "rgba(255,255,255,0.00)",
                ] as const)
          }
          start={{ x: 0.05, y: 0.0 }}
          end={{ x: 0.75, y: 0.65 }}
          style={styles.specular}
        />
        <LinearGradient
          pointerEvents="none"
          colors={
            colorScheme === "dark"
              ? (["rgba(0,0,0,0.00)", "rgba(0,0,0,0.20)"] as const)
              : (["rgba(0,0,0,0.00)", "rgba(31,58,95,0.08)"] as const)
          }
          start={{ x: 0.35, y: 0.35 }}
          end={{ x: 1.0, y: 1.0 }}
          style={styles.vignette}
        />
      </BlurView>
      <View
        pointerEvents="none"
        style={[
          styles.highlight,
          {
            backgroundColor:
              colorScheme === "dark"
                ? "rgba(255,255,255,0.06)"
                : "rgba(255,255,255,0.30)",
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.stroke,
          {
            borderColor:
              colorScheme === "dark"
                ? "rgba(255,255,255,0.16)"
                : "rgba(255,255,255,0.55)",
          },
        ]}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  blur: {
    borderRadius: BorderRadius.lg,
  },
  inner: {
    padding: Spacing.md,
  },
  specular: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  vignette: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  pressed: {
    transform: [{ scale: 0.995 }],
  },
  highlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  stroke: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
});
