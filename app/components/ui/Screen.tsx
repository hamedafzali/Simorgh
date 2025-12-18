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
      ? (["#0B1220", "#0F172A", "#0B1220"] as const)
      : (["#F7F9FC", "#F3F7FF", "#F7F9FC"] as const);

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
          styles.blob,
          styles.blobTop,
          {
            backgroundColor:
              colorScheme === "dark"
                ? "rgba(47,93,138,0.25)"
                : "rgba(47,93,138,0.18)",
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.blob,
          styles.blobMid,
          {
            backgroundColor:
              colorScheme === "dark"
                ? "rgba(47,163,107,0.14)"
                : "rgba(47,163,107,0.12)",
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.blob,
          styles.blobBottom,
          {
            backgroundColor:
              colorScheme === "dark"
                ? "rgba(59,130,246,0.12)"
                : "rgba(59,130,246,0.10)",
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
  blob: {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: 9999,
  },
  blobTop: {
    top: -240,
    left: -220,
  },
  blobMid: {
    top: 140,
    right: -260,
  },
  blobBottom: {
    bottom: -260,
    left: -180,
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
