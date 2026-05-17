import React from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors, Spacing, Typography } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import FeatureGate from "../components/FeatureGate";
import { Screen } from "../components/ui/Screen";
import {
  getEmergencyContacts,
  supportedCountries,
} from "../services/countries-data";
import { usePreferences } from "../contexts/PreferencesContext";
import { fa } from "../services/l10n";

export default function EmergencyScreen() {
  const params = useLocalSearchParams<{ country?: string }>();
  const code = (params.country || "DE").toUpperCase();
  const country = supportedCountries.find((c) => c.code === code);
  const { language } = usePreferences();

  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const contacts = getEmergencyContacts(code);

  return (
    <FeatureGate feature="emergency">
      <Screen>
        <PageHeader
          title={fa("اورژانس", "Emergency", language)}
          subtitle={country ? country.name : "Germany"}
        />

        {contacts.map((contact) => (
          <TouchableOpacity
            key={`${contact.category}-${contact.number}`}
            onPress={() => Linking.openURL(`tel:${contact.number}`)}
            activeOpacity={0.7}
          >
            <Card>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: Typography.sizes.headingM,
                    fontWeight: Typography.fontWeight.bold,
                    color: palette.textPrimary,
                  }}
                >
                  {fa(contact.categoryFa, contact.category, language)}
                </Text>
                <Text
                  style={{
                    fontSize: Typography.sizes.headingL ?? Typography.sizes.headingM,
                    fontWeight: Typography.fontWeight.bold,
                    color: palette.primary,
                    letterSpacing: 1,
                  }}
                >
                  {contact.number}
                </Text>
              </View>
              {contact.notes ? (
                <Text
                  style={{
                    fontSize: Typography.sizes.bodySecondary,
                    color: palette.textSecondary,
                    lineHeight: 22,
                    marginTop: Spacing.xs,
                  }}
                >
                  {fa(contact.notesFa, contact.notes, language)}
                </Text>
              ) : null}
            </Card>
          </TouchableOpacity>
        ))}

        <Card>
          <Text
            style={{
              fontSize: Typography.sizes.bodySecondary,
              color: palette.textSecondary,
              lineHeight: 22,
            }}
          >
            {fa(
              "این شماره‌ها را آفلاین ذخیره کنید. روی هر کارت ضربه بزنید تا مستقیم زنگ بزنید.",
              "Tap any card to call directly. Save these numbers offline in case of no internet.",
              language
            )}
          </Text>
        </Card>
      </Screen>
    </FeatureGate>
  );
}
