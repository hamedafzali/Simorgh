import React, { useEffect, useState } from "react";
import { Linking, Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors, Spacing, Typography, getTextFontFamily } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { usePreferences } from "../../contexts/PreferencesContext";
import { Card } from "../../components/ui/Card";
import { Header } from "../../components/ui/Header";
import { Screen } from "../../components/ui/Screen";
import { t } from "../../services/i18n";
import { AppEvent, getEventsFromCache } from "../../services/events";

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

function InfoRow({ icon, label }: { icon: any; label: string }) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
      <Feather name={icon} size={14} color={palette.textSecondary} />
      <Text style={{ fontSize: Typography.sizes.bodySecondary, color: palette.textSecondary }}>{label}</Text>
    </View>
  );
}

export default function EventDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { language } = usePreferences();
  const boldFont = getTextFontFamily(language, "bold");
  const regularFont = getTextFontFamily(language, "normal");

  const [event, setEvent] = useState<AppEvent | null>(null);

  useEffect(() => {
    getEventsFromCache().then((events) => {
      setEvent(events.find((e) => e.id === params.id) ?? null);
    });
  }, [params.id]);

  const title = language === "fa" ? event?.titleFa || event?.title : event?.title;
  const description = language === "fa" ? event?.descriptionFa || event?.description : event?.description;

  return (
    <Screen>
      <Header
        title={t(language, "events.detailTitle")}
        subtitle={title ?? ""}
        showBack
      />

      {!event ? (
        <Card>
          <Text style={{ color: palette.textSecondary, fontFamily: regularFont }}>
            {t(language, "events.notFound")}
          </Text>
        </Card>
      ) : (
        <>
          <Card>
            <Text
              style={{
                fontSize: Typography.sizes.headingM,
                fontFamily: boldFont,
                color: palette.textPrimary,
                marginBottom: Spacing.xs,
              }}
            >
              {title}
            </Text>
            <Text
              style={{
                fontSize: Typography.sizes.bodySecondary,
                fontFamily: regularFont,
                color: palette.textSecondary,
                marginBottom: Spacing.sm,
              }}
            >
              {language === "fa" ? event.categoryFa : event.category}
            </Text>

            <InfoRow icon="calendar" label={
              event.endDate
                ? `${formatDate(event.date, language)} → ${formatDate(event.endDate, language)}`
                : formatDate(event.date, language)
            } />
            {event.time && <InfoRow icon="clock" label={event.time} />}
            {event.venue && <InfoRow icon="map-pin" label={event.venue} />}
            {(event.city || event.state) && (
              <InfoRow icon="navigation" label={[event.city, event.state, event.country].filter(Boolean).join(", ")} />
            )}
            <InfoRow icon="tag" label={event.price} />
            {event.source && <InfoRow icon="info" label={`${t(language, "events.source")}: ${event.source}`} />}
          </Card>

          {description ? (
            <Card>
              <Text
                style={{
                  fontSize: Typography.sizes.body,
                  fontFamily: boldFont,
                  color: palette.textPrimary,
                  marginBottom: Spacing.sm,
                }}
              >
                {t(language, "events.details")}
              </Text>
              <Text
                style={{
                  fontSize: Typography.sizes.bodySecondary,
                  fontFamily: regularFont,
                  color: palette.textSecondary,
                  lineHeight: 22,
                  textAlign: language === "fa" ? "right" : "left",
                }}
              >
                {description}
              </Text>
            </Card>
          ) : null}

          {event.link ? (
            <Pressable
              onPress={() => Linking.openURL(event.link!)}
              style={({ pressed }) => ({
                opacity: pressed ? 0.75 : 1,
                backgroundColor: palette.primary,
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: "center",
                marginTop: Spacing.sm,
              })}
            >
              <Text style={{ color: "#fff", fontFamily: boldFont, fontSize: Typography.sizes.body }}>
                {t(language, "events.visitWebsite")}
              </Text>
            </Pressable>
          ) : null}

          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              opacity: pressed ? 0.75 : 1,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: palette.borderLight,
              paddingVertical: 14,
              alignItems: "center",
              marginTop: Spacing.sm,
            })}
          >
            <Text style={{ color: palette.textPrimary, fontFamily: regularFont, fontSize: Typography.sizes.body }}>
              {t(language, "common.back")}
            </Text>
          </Pressable>
        </>
      )}
    </Screen>
  );
}
