import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, BorderRadius, Spacing, Typography } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { usePreferences, type AppLanguage } from "../contexts/PreferencesContext";
import { useCountries } from "../contexts/CountriesContext";
import { setJson } from "../services/localStore";
import { requestNotificationPermission } from "../services/notifications";
import { track } from "../services/analytics";

// ── Priority areas, ordered by Iranian community urgency ──────────────────
const PRIORITIES = [
  { id: "anmeldung", icon: "🏛️", fa: "ثبت آدرس", en: "Anmeldung", de: "Anmeldung" },
  { id: "emergency", icon: "🚨", fa: "اورژانس", en: "Emergency", de: "Notfall" },
  { id: "health",    icon: "🏥", fa: "بیمه درمانی", en: "Krankenkasse", de: "Krankenkasse" },
  { id: "bank",      icon: "🏦", fa: "حساب بانکی", en: "Bank Account", de: "Bankkonto" },
  { id: "housing",   icon: "🏠", fa: "مسکن", en: "Housing", de: "Wohnung" },
  { id: "language",  icon: "📖", fa: "زبان آلمانی", en: "German Language", de: "Deutsch lernen" },
  { id: "school",    icon: "🎒", fa: "مدرسه / فرزندان", en: "School & Children", de: "Schule" },
  { id: "residence", icon: "🛂", fa: "اقامت", en: "Residence Permit", de: "Aufenthaltstitel" },
];

type Priority = typeof PRIORITIES[number];

const COUNTRY_FLAGS: Record<string, string> = {
  DE: "🇩🇪", CA: "🇨🇦", US: "🇺🇸", UK: "🇬🇧",
  AU: "🇦🇺", TR: "🇹🇷", SE: "🇸🇪",
};

const LANG_LABELS: Record<AppLanguage, string> = {
  fa: "فارسی",
  en: "English",
  de: "Deutsch",
};

function label(item: { fa: string; en: string; de: string }, lang: AppLanguage) {
  return lang === "fa" ? item.fa : lang === "de" ? item.de : item.en;
}

// ── Step 0: Language & Welcome ─────────────────────────────────────────────
function StepLanguage({
  language,
  onSelect,
}: {
  language: AppLanguage;
  onSelect: (lang: AppLanguage) => void;
}) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <View style={styles.stepContent}>
      <Image
        source={require("../assets/images/splash-icon.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={[styles.appName, { color: palette.primary }]}>سیمرغ</Text>
      <Text style={[styles.appNameEn, { color: palette.textSecondary }]}>Simorgh</Text>
      <Text style={[styles.tagline, { color: palette.textSecondary }]}>
        همراه شما
      </Text>

      <View style={styles.langRow}>
        {(["fa", "en", "de"] as AppLanguage[]).map((lang) => (
          <Pressable
            key={lang}
            onPress={() => onSelect(lang)}
            style={[
              styles.langBtn,
              {
                backgroundColor:
                  language === lang ? palette.primary : palette.surface,
                borderColor:
                  language === lang ? palette.primary : palette.borderLight,
              },
            ]}
          >
            <Text
              style={[
                styles.langBtnText,
                {
                  color:
                    language === lang
                      ? palette.textOnPrimary
                      : palette.textPrimary,
                  fontWeight:
                    language === lang
                      ? Typography.fontWeight.bold
                      : Typography.fontWeight.normal,
                },
              ]}
            >
              {LANG_LABELS[lang]}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// ── Step 1: Country selection ──────────────────────────────────────────────
function StepCountry({
  language,
  selected,
  onSelect,
}: {
  language: AppLanguage;
  selected: string;
  onSelect: (code: string) => void;
}) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { countries } = useCountries();

  const TITLES: Record<AppLanguage, string> = {
    fa: "کجا هستید؟",
    en: "Where are you?",
    de: "Wo sind Sie?",
  };
  const SUBS: Record<AppLanguage, string> = {
    fa: "کشوری که در آن زندگی می‌کنید یا قصد دارید بروید را انتخاب کنید",
    en: "Select the country you are living in or moving to",
    de: "Wählen Sie das Land, in dem Sie leben oder hinziehen möchten",
  };

  return (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: palette.textPrimary }]}>
        {TITLES[language]}
      </Text>
      <Text
        style={[
          styles.stepSub,
          { color: palette.textSecondary },
          language === "fa" && styles.rtlText,
        ]}
      >
        {SUBS[language]}
      </Text>

      <View style={styles.countryGrid}>
        {countries.map((c) => {
          const isOn = selected === c.code;
          const flag = COUNTRY_FLAGS[c.code] ?? "🌍";
          return (
            <Pressable
              key={c.code}
              onPress={() => onSelect(c.code)}
              style={[
                styles.countryCard,
                {
                  backgroundColor: isOn ? palette.accentGreenSoft : palette.surface,
                  borderColor: isOn ? palette.primary : palette.borderLight,
                },
              ]}
            >
              <Text style={styles.countryFlag}>{flag}</Text>
              <Text
                style={[
                  styles.countryName,
                  { color: isOn ? palette.primary : palette.textPrimary },
                ]}
                numberOfLines={1}
              >
                {c.name}
              </Text>
              {c.localName && c.localName !== c.name && (
                <Text style={[styles.countryLocal, { color: palette.textSecondary }]} numberOfLines={1}>
                  {c.localName}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ── Step 2: Priorities ─────────────────────────────────────────────────────
function StepPriorities({
  language,
  selected,
  onToggle,
}: {
  language: AppLanguage;
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  const TITLES: Record<AppLanguage, string> = {
    fa: "بیشتر به چه کمکی نیاز دارید؟",
    en: "What do you need help with most?",
    de: "Wobei brauchen Sie am meisten Hilfe?",
  };
  const SUBS: Record<AppLanguage, string> = {
    fa: "همه مواردی که مرتبط است را انتخاب کنید",
    en: "Select all that apply",
    de: "Alles Zutreffende auswählen",
  };

  return (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: palette.textPrimary }]}>
        {TITLES[language]}
      </Text>
      <Text
        style={[
          styles.stepSub,
          { color: palette.textSecondary },
          language === "fa" && styles.rtlText,
        ]}
      >
        {SUBS[language]}
      </Text>

      <View style={styles.priorityGrid}>
        {PRIORITIES.map((item) => {
          const isOn = selected.has(item.id);
          return (
            <Pressable
              key={item.id}
              onPress={() => onToggle(item.id)}
              style={[
                styles.priorityCard,
                {
                  backgroundColor: isOn ? palette.accentGreenSoft : palette.surface,
                  borderColor: isOn ? palette.primary : palette.borderLight,
                },
              ]}
            >
              <Text style={styles.priorityIcon}>{item.icon}</Text>
              <Text
                style={[
                  styles.priorityLabel,
                  { color: isOn ? palette.primary : palette.textPrimary },
                  language === "fa" && styles.rtlText,
                ]}
                numberOfLines={2}
              >
                {label(item, language)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ── Root onboarding component ──────────────────────────────────────────────
export default function OnboardingScreen() {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  const {
    language,
    country,
    setLanguage,
    setDirection,
    setCountry,
    setOnboardingDone,
  } = usePreferences();

  const [step, setStep] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState(country || "DE");
  const [priorities, setPriorities] = useState<Set<string>>(new Set());

  const TOTAL_STEPS = 3;

  function handleSelectLanguage(lang: AppLanguage) {
    setLanguage(lang);
    setDirection(lang === "fa" ? "rtl" : "ltr");
  }

  function togglePriority(id: string) {
    setPriorities((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleNext() {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
      return;
    }
    await finish();
  }

  async function finish() {
    setCountry(selectedCountry);
    if (priorities.size > 0) {
      await setJson("pref:priorities", Array.from(priorities));
    }
    await requestNotificationPermission().catch(() => {});
    void track("onboarding_completed", {
      country: selectedCountry,
      priorities: Array.from(priorities),
    });
    setOnboardingDone(true);
  }

  const NEXT_LABELS: Record<AppLanguage, string[]> = {
    fa: ["ادامه", "ادامه", "شروع کن"],
    en: ["Continue", "Continue", "Get Started"],
    de: ["Weiter", "Weiter", "Los geht's"],
  };
  const SKIP_LABELS: Record<AppLanguage, string> = {
    fa: "رد کردن",
    en: "Skip",
    de: "Überspringen",
  };

  const gradientColors =
    colorScheme === "dark"
      ? (["#111827", "#152033", "#111827"] as const)
      : (["#F7F7F3", "#F2FAE8", "#F7F7F3"] as const);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: palette.background }]}>
      <LinearGradient
        pointerEvents="none"
        colors={gradientColors}
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
      />

      {/* Step dots */}
      <View style={styles.dots}>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i === step ? palette.primary : palette.borderLight,
                width: i === step ? 20 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* Step content */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {step === 0 && (
          <StepLanguage language={language} onSelect={handleSelectLanguage} />
        )}
        {step === 1 && (
          <StepCountry
            language={language}
            selected={selectedCountry}
            onSelect={setSelectedCountry}
          />
        )}
        {step === 2 && (
          <StepPriorities
            language={language}
            selected={priorities}
            onToggle={togglePriority}
          />
        )}
      </ScrollView>

      {/* Bottom actions */}
      <View style={styles.actions}>
        {step > 0 && (
          <Pressable onPress={finish} style={styles.skipBtn}>
            <Text style={[styles.skipText, { color: palette.textSecondary }]}>
              {SKIP_LABELS[language]}
            </Text>
          </Pressable>
        )}
        <Pressable
          onPress={handleNext}
          style={[styles.nextBtn, { backgroundColor: palette.primary }]}
        >
          <Text style={[styles.nextText, { color: palette.textOnPrimary }]}>
            {NEXT_LABELS[language][step]}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  body: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  bodyContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: Spacing.lg,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  // ── Step shared
  stepContent: {
    alignItems: "center",
  },
  stepTitle: {
    fontSize: Typography.sizes.headingL,
    fontWeight: Typography.fontWeight.bold,
    textAlign: "center",
    marginBottom: Spacing.sm,
    lineHeight: 32,
  },
  stepSub: {
    fontSize: Typography.sizes.bodySecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  // ── Step 0: Welcome
  logo: {
    width: 96,
    height: 96,
    marginBottom: Spacing.md,
  },
  appName: {
    fontSize: 36,
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: 1,
  },
  appNameEn: {
    fontSize: Typography.sizes.bodySecondary,
    letterSpacing: 3,
    marginBottom: Spacing.sm,
  },
  tagline: {
    fontSize: Typography.sizes.body,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  langRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  langBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    minWidth: 90,
    alignItems: "center",
  },
  langBtnText: {
    fontSize: Typography.sizes.body,
  },
  // ── Step 1: Priorities
  priorityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    justifyContent: "center",
    width: "100%",
  },
  priorityCard: {
    width: "46%",
    borderWidth: 1.5,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: "center",
    gap: Spacing.xs,
  },
  priorityIcon: {
    fontSize: 28,
  },
  priorityLabel: {
    fontSize: Typography.sizes.bodySecondary,
    textAlign: "center",
    lineHeight: 18,
    fontWeight: Typography.fontWeight.semibold,
  },
  // ── Step 1: Country
  countryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    justifyContent: "center",
    width: "100%",
  },
  countryCard: {
    width: "46%",
    borderWidth: 1.5,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: "center",
    gap: 4,
  },
  countryFlag: {
    fontSize: 32,
  },
  countryName: {
    fontSize: Typography.sizes.bodySecondary,
    fontWeight: Typography.fontWeight.semibold,
    textAlign: "center",
  },
  countryLocal: {
    fontSize: Typography.sizes.caption,
    textAlign: "center",
  },
  // ── Actions
  skipBtn: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  skipText: {
    fontSize: Typography.sizes.bodySecondary,
  },
  nextBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  nextText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
});
