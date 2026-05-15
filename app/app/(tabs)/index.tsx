import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Card } from "../../components/ui/Card";
import { Screen } from "../../components/ui/Screen";
import { SyncButton } from "../../components/ui/SyncButton";
import { Colors, Spacing, Typography, getTextFontFamily } from "../../constants/theme";
import { usePreferences } from "../../contexts/PreferencesContext";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { homeStyles } from "../../styles";
import { t } from "../../services/i18n";
import { describeWeatherCode, getCurrentWeather } from "../../services/weather";

const localizedWeatherLabel = {
  fa: {
    Clear: "صاف",
    Cloudy: "ابری",
    Fog: "مه",
    Rain: "بارانی",
    Snow: "برفی",
    Showers: "رگبار",
    "Snow showers": "رگبار برف",
    Thunder: "طوفانی",
  },
  de: {
    Clear: "Klar",
    Cloudy: "Bewoelkt",
    Fog: "Nebel",
    Rain: "Regen",
    Snow: "Schnee",
    Showers: "Schauer",
    "Snow showers": "Schneeschauer",
    Thunder: "Gewitter",
  },
  en: {
    Clear: "Clear",
    Cloudy: "Cloudy",
    Fog: "Fog",
    Rain: "Rain",
    Snow: "Snow",
    Showers: "Showers",
    "Snow showers": "Snow showers",
    Thunder: "Thunder",
  },
} as const;

const toShamsi = (date: Date) => {
  const gregorianYear = date.getFullYear();
  const gregorianMonth = date.getMonth() + 1;
  const gregorianDay = date.getDate();

  const gregorianDayOfYear =
    [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334][
      gregorianMonth - 1
    ] +
    gregorianDay +
    (gregorianMonth > 2 &&
    gregorianYear % 4 === 0 &&
    (gregorianYear % 100 !== 0 || gregorianYear % 400 === 0)
      ? 1
      : 0);

  let shamsiYear: number;
  let shamsiMonth: number;
  let shamsiDay: number;

  if (gregorianDayOfYear > 79) {
    shamsiYear = gregorianYear - 621;
    const shamsiDayOfYear = gregorianDayOfYear - 79;

    if (shamsiDayOfYear <= 186) {
      shamsiMonth = Math.ceil(shamsiDayOfYear / 31);
      shamsiDay =
        shamsiDayOfYear <= 31 ? shamsiDayOfYear : shamsiDayOfYear % 31;
    } else {
      shamsiMonth = Math.ceil((shamsiDayOfYear - 186) / 30);
      shamsiDay = (shamsiDayOfYear - 186) % 30;
      if (shamsiDay === 0) shamsiDay = 30;
    }
  } else {
    shamsiYear = gregorianYear - 622;
    const shamsiDayOfYear = gregorianDayOfYear + 286;
    shamsiMonth = Math.ceil(shamsiDayOfYear / 30);
    shamsiDay = shamsiDayOfYear % 30;
    if (shamsiDay === 0) shamsiDay = 30;
  }

  const shamsiMonths = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

  const toPersianDigits = (num: number) =>
    num
      .toString()
      .split("")
      .map((digit) => persianDigits[parseInt(digit, 10)])
      .join("");

  return `${toPersianDigits(shamsiDay)} ${shamsiMonths[shamsiMonth - 1]} ${toPersianDigits(shamsiYear)}`;
};

export default function HomeTab() {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { language, location } = usePreferences();
  const boldFont = getTextFontFamily(language, "bold");
  const regularFont = getTextFontFamily(language, "normal");
  const [weatherLabel, setWeatherLabel] = useState(t(language, "home.weatherUnavailable"));
  const [weatherTemp, setWeatherTemp] = useState<string | null>(null);

  const locale =
    language === "fa"
      ? "fa-IR-u-ca-gregory"
      : language === "de"
        ? "de-DE"
        : "en-US";

  const todayLabel = useMemo(() => {
    const now = new Date();
    const weekday = now.toLocaleDateString(locale, { weekday: "long" });
    const dateLabel =
      language === "fa"
        ? toShamsi(now)
        : now.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
    return `${weekday} · ${dateLabel}`;
  }, [language, locale]);

  useEffect(() => {
    let mounted = true;

    const loadWeather = async () => {
      if (location?.lat === undefined || location?.lon === undefined) {
        setWeatherLabel(t(language, "home.weatherSetup"));
        setWeatherTemp(null);
        return;
      }

      try {
        const snapshot = await getCurrentWeather(location.lat, location.lon);
        if (!mounted) return;
        setWeatherTemp(`${snapshot.temperatureC}°C`);
        const key = describeWeatherCode(snapshot.weatherCode) as keyof (typeof localizedWeatherLabel)[typeof language];
        setWeatherLabel(localizedWeatherLabel[language][key] || key);
      } catch {
        if (!mounted) return;
        setWeatherLabel(t(language, "home.weatherUnavailable"));
        setWeatherTemp(null);
      }
    };

    void loadWeather();
    return () => {
      mounted = false;
    };
  }, [language, location?.lat, location?.lon]);

  return (
    <Screen>
      <View style={homeStyles.topBar}>
        <View style={homeStyles.brandBlock}>
          <Text
            style={[
              homeStyles.brandTitle,
              {
                color: palette.textPrimary,
                fontFamily: boldFont,
                paddingHorizontal: 8,
                paddingVertical: 4,
              },
            ]}
          >
            {t(language, "common.simorgh")}
          </Text>
        </View>

        <View style={homeStyles.topBarActions}>
          <SyncButton size="small" />
          <Pressable
            onPress={() => router.push("/settings" as any)}
            style={({ pressed }) => [
              homeStyles.iconButton,
              {
                opacity: pressed ? 0.78 : 1,
                borderColor: palette.borderLight,
                backgroundColor: colorScheme === "dark" ? "rgba(24,33,47,0.96)" : "#FFFFFF",
              },
            ]}
          >
            <Feather name="settings" size={17} color={palette.textPrimary} />
          </Pressable>
        </View>
      </View>

      <Card style={{ padding: Spacing.lg, borderRadius: 18 }}>
        <View style={{ gap: Spacing.md }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Feather name="map-pin" size={16} color={palette.textSecondary} style={{ marginRight: 8 }} />
            <Text
              style={{
                color: palette.textPrimary,
                fontSize: Typography.sizes.headingM,
                fontFamily: boldFont,
              }}
            >
              {location?.city || t(language, "home.weatherSetup")}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Feather name="cloud" size={16} color={palette.textSecondary} style={{ marginRight: 8 }} />
            <Text
              style={{
                color: palette.textPrimary,
                fontSize: Typography.sizes.body,
                fontFamily: regularFont,
              }}
            >
              {weatherTemp ? `${weatherTemp} · ${weatherLabel}` : weatherLabel}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Feather name="calendar" size={16} color={palette.textSecondary} style={{ marginRight: 8 }} />
            <Text
              style={{
                color: palette.textSecondary,
                fontSize: Typography.sizes.bodySecondary,
                fontFamily: regularFont,
              }}
            >
              {todayLabel}
            </Text>
          </View>
        </View>
      </Card>
    </Screen>
  );
}
