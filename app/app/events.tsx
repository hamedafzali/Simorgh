import React, { useCallback, useEffect, useRef, useState } from "react";
import { AppState, Linking, Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Card } from "../components/ui/Card";
import { Screen } from "../components/ui/Screen";
import { PageHeader } from "../components/ui/PageHeader";
import FeatureGate from "../components/FeatureGate";
import { Colors, Spacing, Typography, getTextFontFamily } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { usePreferences } from "../contexts/PreferencesContext";
import { t } from "../services/i18n";
import { AppEvent, syncEvents, getEventsFromCache } from "../services/events";

const CATEGORY_COLORS: Record<string, string> = {
  Tax: "#b7791f",
  Integration: "#2b6cb0",
  Community: "#276749",
  Language: "#6b46c1",
  Employment: "#c05621",
  Legal: "#c53030",
  Health: "#0987a0",
  Housing: "#2c5282",
  Education: "#276749",
  Culture: "#97266d",
  Other: "#718096",
};

function groupByDate(events: AppEvent[]): { date: string; items: AppEvent[] }[] {
  const map = new Map<string, AppEvent[]>();
  for (const e of events) {
    const group = map.get(e.date) ?? [];
    group.push(e);
    map.set(e.date, group);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, items]) => ({ date, items }));
}

function formatDate(dateStr: string, language: string): string {
  try {
    const d = new Date(dateStr + "T00:00:00");
    if (language === "fa") return d.toLocaleDateString("fa-IR", { day: "numeric", month: "long", year: "numeric" });
    if (language === "de") return d.toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function EventsScreen() {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { language, country } = usePreferences();
  const boldFont = getTextFontFamily(language, "bold");
  const regularFont = getTextFontFamily(language, "normal");

  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const appStateRef = useRef(AppState.currentState);

  const load = useCallback(async () => {
    setLoading(true);
    const cached = await getEventsFromCache();
    if (cached.length) setEvents(cached);
    const fresh = await syncEvents({ country: country || "DE" });
    setEvents(fresh);
    setLoading(false);
  }, [country]);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      if (appStateRef.current.match(/inactive|background/) && next === "active") {
        void load();
      }
      appStateRef.current = next;
    });
    return () => sub.remove();
  }, [load]);

  const groups = groupByDate(events);

  return (
    <FeatureGate feature="events" title={t(language, "events.title")} subtitle={t(language, "events.subtitle")}>
      <Screen>
        <PageHeader
          title={t(language, "events.title")}
          subtitle={t(language, "events.subtitle")}
        />

        {loading && events.length === 0 && (
          <Card>
            <Text style={{ color: palette.textSecondary, fontFamily: regularFont }}>
              {t(language, "events.loading")}
            </Text>
          </Card>
        )}

        {!loading && events.length === 0 && (
          <Card>
            <Text style={{ color: palette.textSecondary, fontFamily: regularFont }}>
              {t(language, "events.empty")}
            </Text>
          </Card>
        )}

        {groups.map(({ date, items }) => (
          <View key={date}>
            <Text
              style={{
                fontSize: Typography.sizes.bodySecondary,
                fontFamily: boldFont,
                color: palette.textSecondary,
                marginTop: Spacing.md,
                marginBottom: Spacing.xs,
                paddingHorizontal: 4,
              }}
            >
              {formatDate(date, language)}
            </Text>
            {items.map((event) => (
              <Pressable
                key={event.id}
                onPress={() => router.push(`/event/${event.id}` as any)}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.75 : 1,
                  marginBottom: Spacing.sm,
                  backgroundColor: colorScheme === "dark" ? "rgba(24,33,47,0.96)" : "#FFFFFF",
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: palette.borderLight,
                  padding: Spacing.md,
                })}
              >
                <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
                  <View
                    style={{
                      backgroundColor: CATEGORY_COLORS[event.category] ?? "#718096",
                      borderRadius: 6,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      alignSelf: "flex-start",
                      marginTop: 2,
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 11, fontFamily: regularFont }}>
                      {language === "fa" ? event.categoryFa : event.category}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: Typography.sizes.body,
                        fontFamily: boldFont,
                        color: palette.textPrimary,
                      }}
                      numberOfLines={2}
                    >
                      {language === "fa" ? event.titleFa || event.title : event.title}
                    </Text>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                      {event.time && (
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                          <Feather name="clock" size={12} color={palette.textSecondary} />
                          <Text style={{ fontSize: 12, color: palette.textSecondary, fontFamily: regularFont }}>
                            {event.time}
                          </Text>
                        </View>
                      )}
                      {(event.city || event.state) && (
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                          <Feather name="map-pin" size={12} color={palette.textSecondary} />
                          <Text style={{ fontSize: 12, color: palette.textSecondary, fontFamily: regularFont }}>
                            {[event.city, event.state].filter(Boolean).join(", ")}
                          </Text>
                        </View>
                      )}
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                        <Feather name="tag" size={12} color={palette.textSecondary} />
                        <Text style={{ fontSize: 12, color: palette.textSecondary, fontFamily: regularFont }}>
                          {event.price}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Feather name="chevron-right" size={16} color={palette.textSecondary} style={{ marginTop: 2 }} />
                </View>
              </Pressable>
            ))}
          </View>
        ))}
      </Screen>
    </FeatureGate>
  );
}
