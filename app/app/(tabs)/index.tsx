import React, { useEffect, useMemo, useState } from "react";
import { Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { Feather } from "@expo/vector-icons";
import { GlassCard } from "../../components/ui/GlassCard";
import { GlassWidget } from "../../components/ui/GlassWidget";
import { PageHeader } from "../../components/ui/PageHeader";
import { SyncButton } from "../../components/ui/SyncButton";
import { Screen } from "../../components/ui/Screen";
import {
  getHomeMenuHighlightColor,
  getHomeMenuIconStyle,
  getHomeMenuItemStyle,
  getHomeMenuShadeColor,
  homeStyles,
} from "../../styles";
import { homeShortcuts } from "../../services/homeShortcuts";
import { getJson } from "../../services/localStore";

export default function HomeTab() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  const now = new Date();
  const weekday = now.toLocaleDateString(undefined, { weekday: "long" });
  const dayMonth = now.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
  });

  const persianDate = (() => {
    try {
      return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(now);
    } catch {
      return now.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  })();

  const menuItems = [
    {
      key: "learn",
      label: "Learn",
      icon: "book-open" as const,
      onPress: () => router.push("/(tabs)/learn" as any),
    },
    {
      key: "vocab",
      label: "Vocabulary",
      icon: "type" as const,
      onPress: () => router.push("/learn/vocabulary" as any),
    },
    {
      key: "flashcards",
      label: "Flashcards",
      icon: "layers" as const,
      onPress: () => router.push("/learn/flashcards" as any),
    },
    {
      key: "practice",
      label: "Practice",
      icon: "check-square" as const,
      onPress: () => router.push("/learn/practice" as any),
    },
    {
      key: "exams",
      label: "Exams",
      icon: "edit-3" as const,
      onPress: () => router.push("/learn/exams" as any),
    },
  ];

  const [shortcutState, setShortcutState] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const defaultState = homeShortcuts.reduce<Record<string, boolean>>(
        (acc, item) => {
          acc[item.key] = true;
          return acc;
        },
        {}
      );
      const stored = await getJson<Record<string, boolean>>(
        "home_shortcuts",
        defaultState
      );
      if (mounted) setShortcutState(stored);
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const enabledShortcuts = useMemo(() => {
    return homeShortcuts.filter((item) => shortcutState[item.key] !== false);
  }, [shortcutState]);

  const rows = useMemo(() => {
    const result: typeof enabledShortcuts[] = [];
    for (let i = 0; i < enabledShortcuts.length; i += 2) {
      result.push(enabledShortcuts.slice(i, i + 2));
    }
    return result;
  }, [enabledShortcuts]);

  return (
    <Screen>
      <GlassCard
        onPress={() => router.push("/events" as any)}
        style={homeStyles.topCard}
      >
        <View style={homeStyles.topRow}>
          <View style={homeStyles.topLeft}>
            <Text style={[homeStyles.topKicker, { color: palette.textMuted }]}>
              {weekday}
            </Text>
            <Text
              style={[homeStyles.topPrimary, { color: palette.textPrimary }]}
            >
              {dayMonth}
            </Text>
            <Text
              style={[homeStyles.persianDate, { color: palette.textSecondary }]}
            >
              {persianDate}
            </Text>
          </View>

          <View
            style={[
              homeStyles.divider,
              { backgroundColor: palette.borderLight },
            ]}
          />

          <View style={homeStyles.topRight}>
            <View style={homeStyles.weatherRow}>
              <Feather name="cloud" size={18} color={palette.primary} />
              <Text style={[homeStyles.temp, { color: palette.textPrimary }]}>
                12°
              </Text>
            </View>
            <Text
              style={[homeStyles.weatherHint, { color: palette.textSecondary }]}
            >
              Mostly cloudy
            </Text>

            <View style={homeStyles.homeActions}>
              <Pressable
                onPress={() => router.push("/settings" as any)}
                accessibilityRole="button"
                accessibilityLabel="Settings"
                style={({ pressed }) => [
                  homeStyles.iconButton,
                  {
                    opacity: pressed ? 0.7 : 1,
                    borderColor: palette.borderLight,
                    backgroundColor:
                      colorScheme === "dark"
                        ? "rgba(255,255,255,0.10)"
                        : "rgba(255,255,255,0.20)",
                  },
                ]}
              >
                <Feather name="settings" size={16} color={palette.textPrimary} />
              </Pressable>
              <SyncButton size="small" />
            </View>
          </View>
        </View>
      </GlassCard>

      <GlassCard style={homeStyles.menuCard}>
        <Text style={[homeStyles.sectionTitle, { color: palette.textPrimary }]}>
          Core learning
        </Text>
        <View style={homeStyles.menuGrid}>
          {menuItems.map((item) => (
            <Pressable
              key={item.key}
              onPress={item.onPress}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              style={({ pressed }) => [
                homeStyles.menuItemBase,
                getHomeMenuItemStyle({
                  colorScheme,
                  pressed,
                }),
                pressed ? homeStyles.menuPressed : null,
              ]}
            >
              <View
                pointerEvents="none"
                style={[
                  homeStyles.menuHighlight,
                  { backgroundColor: getHomeMenuHighlightColor(colorScheme) },
                ]}
              />
              <View
                pointerEvents="none"
                style={[
                  homeStyles.menuShade,
                  { backgroundColor: getHomeMenuShadeColor(colorScheme) },
                ]}
              />
              <View
                style={[
                  homeStyles.menuIconBase,
                  getHomeMenuIconStyle({ colorScheme }),
                ]}
              >
                <Feather name={item.icon} size={18} color={palette.primary} />
              </View>
              <Text
                style={[homeStyles.menuLabel, { color: palette.textPrimary }]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </GlassCard>

      <View style={homeStyles.widgetGrid}>
        <View style={homeStyles.col}>
          <GlassWidget
            title="Continue"
            value="Vocabulary"
            subtitle="Start a 2‑min session"
            icon="play"
            onPress={() => router.push("/(tabs)/learn" as any)}
          />
          <GlassWidget
            title="Level"
            value="A1"
            subtitle="Up next: basics"
            icon="award"
            onPress={() => router.push("/(tabs)/learn" as any)}
          />
        </View>
        <View style={homeStyles.col}>
          <GlassWidget
            title="Streak"
            value="0"
            subtitle="Build consistency"
            icon="zap"
            onPress={() => router.push("/(tabs)/learn" as any)}
          />
          <GlassWidget
            title="Reviews"
            value="0"
            subtitle="Due today"
            icon="repeat"
            onPress={() => router.push("/(tabs)/learn" as any)}
          />
        </View>
      </View>

      <GlassCard>
        <Text style={[homeStyles.sectionTitle, { color: palette.textPrimary }]}>
          Home shortcuts
        </Text>
        <Text
          style={[homeStyles.sectionHint, { color: palette.textSecondary }]}
        >
          Customize this list in Settings.
        </Text>

        {rows.map((row, index) => (
          <View key={`row-${index}`} style={homeStyles.quickRow}>
            {row.map((item) => (
              <GlassWidget
                key={item.key}
                title={item.title}
                subtitle={item.subtitle}
                icon={item.icon}
                onPress={() => router.push(item.route as any)}
                style={homeStyles.quickItem}
              />
            ))}
            {row.length === 1 ? <View style={homeStyles.quickItem} /> : null}
          </View>
        ))}
      </GlassCard>
    </Screen>
  );
}
