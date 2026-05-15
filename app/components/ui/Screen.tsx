import React from "react";
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, Spacing } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  safeAreaStyle?: StyleProp<ViewStyle>;
};

export function Screen({
  children,
  scroll = true,
  contentStyle,
  safeAreaStyle,
}: Props) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  const gradientColors =
    colorScheme === "dark"
      ? (["#111827", "#152033", "#111827"] as const)
      : (["#F7F7F3", "#F2FAE8", "#F7F7F3"] as const);

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: palette.background },
        safeAreaStyle,
      ]}
    >
      <LinearGradient
        pointerEvents="none"
        colors={gradientColors}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={styles.wallpaper}
      />
      <View
        pointerEvents="none"
        style={[
          styles.plane,
          styles.planeTop,
          {
            backgroundColor:
              colorScheme === "dark"
                ? "rgba(76,201,255,0.06)"
                : "rgba(88,204,2,0.08)",
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.plane,
          styles.planeBottom,
          {
            backgroundColor:
              colorScheme === "dark"
                ? "rgba(125,219,57,0.05)"
                : "rgba(28,176,246,0.06)",
          },
        ]}
      />
      {scroll ? (
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { backgroundColor: "transparent" },
            contentStyle,
          ]}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
        >
          {children}
        </ScrollView>
      ) : (
        <View
          style={[
            styles.content,
            { backgroundColor: "transparent" },
            contentStyle,
          ]}
        >
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  wallpaper: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  plane: {
    position: "absolute",
    borderRadius: 48,
  },
  planeTop: {
    top: 18,
    left: -24,
    right: 80,
    height: 180,
  },
  planeBottom: {
    bottom: 80,
    left: 120,
    right: -18,
    height: 220,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },
});
