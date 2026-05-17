import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors, Spacing, Typography } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import FeatureGate from "../components/FeatureGate";
import { Screen } from "../components/ui/Screen";
import { getPhrasebook, supportedCountries } from "../services/countries-data";
import { usePreferences } from "../contexts/PreferencesContext";
import { fa } from "../services/l10n";

export default function PhrasebookScreen() {
  const params = useLocalSearchParams<{ country?: string }>();
  const code = (params.country || "DE").toUpperCase();
  const country = supportedCountries.find((c) => c.code === code);
  const { language } = usePreferences();

  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  const phrases = getPhrasebook(code);
  const grouped = useMemo(() => {
    return phrases.reduce<Record<string, typeof phrases>>((acc, phrase) => {
      const cat = fa(phrase.categoryFa, phrase.category, language);
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(phrase);
      return acc;
    }, {});
  }, [phrases, language]);

  return (
    <FeatureGate feature="phrasebook">
      <Screen>
        <PageHeader
          title={fa("کتاب عبارات", "Phrasebook", language)}
          subtitle={country ? country.name : "Germany"}
        />

        {Object.entries(grouped).map(([category, items]) => (
          <View key={category}>
            <Text
              style={{
                fontSize: Typography.sizes.bodySecondary,
                fontWeight: Typography.fontWeight.semibold,
                color: palette.textSecondary,
                marginTop: Spacing.md,
                marginBottom: Spacing.xs,
                textTransform: "uppercase",
                letterSpacing: 0.8,
              }}
            >
              {category}
            </Text>

            <Card>
              {items.map((item, idx) => (
                <View
                  key={`${item.category}-${item.phrase}`}
                  style={{
                    paddingVertical: Spacing.sm,
                    borderBottomWidth: idx < items.length - 1 ? 1 : 0,
                    borderBottomColor: palette.borderLight,
                  }}
                >
                  {item.german ? (
                    <Text
                      style={{
                        fontSize: Typography.sizes.bodySecondary,
                        fontWeight: Typography.fontWeight.semibold,
                        color: palette.textPrimary,
                        marginBottom: 2,
                      }}
                    >
                      {item.german}
                    </Text>
                  ) : null}
                  <Text
                    style={{
                      fontSize: Typography.sizes.bodySecondary,
                      color: palette.textSecondary,
                      lineHeight: 20,
                    }}
                  >
                    {item.persian}
                  </Text>
                  {item.romanized ? (
                    <Text
                      style={{
                        fontSize: Typography.sizes.caption,
                        color: palette.textSecondary,
                        opacity: 0.7,
                        marginTop: 2,
                      }}
                    >
                      {item.romanized}
                    </Text>
                  ) : null}
                </View>
              ))}
            </Card>
          </View>
        ))}
      </Screen>
    </FeatureGate>
  );
}
