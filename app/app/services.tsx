import React, { useMemo } from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors, Spacing, Typography } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import FeatureGate from "../components/FeatureGate";
import { Screen } from "../components/ui/Screen";
import { getServices, supportedCountries } from "../services/countries-data";
import { usePreferences } from "../contexts/PreferencesContext";
import { fa } from "../services/l10n";

export default function ServicesScreen() {
  const params = useLocalSearchParams<{ country?: string }>();
  const code = (params.country || "DE").toUpperCase();
  const country = supportedCountries.find((c) => c.code === code);
  const { language } = usePreferences();

  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const services = getServices(code);

  const grouped = useMemo(() => {
    return services.reduce<Record<string, typeof services>>((acc, s) => {
      const cat = fa(s.categoryFa, s.category, language);
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(s);
      return acc;
    }, {});
  }, [services, language]);

  return (
    <FeatureGate feature="services">
      <Screen>
        <PageHeader
          title={fa("خدمات تأیید شده", "Trusted Services", language)}
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

            {items.map((service) => (
              <Card key={`${service.category}-${service.name}`} style={{ marginBottom: Spacing.sm }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                  <Text
                    style={{
                      fontSize: Typography.sizes.body,
                      fontWeight: Typography.fontWeight.semibold,
                      color: palette.textPrimary,
                      flex: 1,
                    }}
                  >
                    {fa(service.nameFa, service.name, language)}
                  </Text>
                  {service.verified ? (
                    <View
                      style={{
                        backgroundColor: palette.primary,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 10,
                        marginLeft: Spacing.xs,
                      }}
                    >
                      <Text
                        style={{
                          color: palette.textOnPrimary,
                          fontSize: 11,
                          fontWeight: Typography.fontWeight.semibold,
                        }}
                      >
                        {fa("تأیید شده", "Verified", language)}
                      </Text>
                    </View>
                  ) : null}
                </View>

                {service.city ? (
                  <Text
                    style={{
                      fontSize: Typography.sizes.caption,
                      color: palette.textSecondary,
                      marginBottom: 4,
                    }}
                  >
                    {service.city}
                  </Text>
                ) : null}

                <Text
                  style={{
                    fontSize: Typography.sizes.bodySecondary,
                    color: palette.textSecondary,
                    lineHeight: 22,
                    marginBottom: service.contact || service.website ? Spacing.sm : 0,
                  }}
                >
                  {fa(service.summaryFa, service.summary, language)}
                </Text>

                {service.contact ? (
                  <TouchableOpacity onPress={() => Linking.openURL(`tel:${service.contact}`)}>
                    <Text
                      style={{
                        fontSize: Typography.sizes.bodySecondary,
                        color: palette.primary,
                        marginBottom: service.website ? 4 : 0,
                      }}
                    >
                      {service.contact}
                    </Text>
                  </TouchableOpacity>
                ) : null}

                {service.website ? (
                  <TouchableOpacity onPress={() => Linking.openURL(service.website!)}>
                    <Text
                      style={{
                        fontSize: Typography.sizes.bodySecondary,
                        color: palette.primary,
                        textDecorationLine: "underline",
                      }}
                    >
                      {service.website.replace(/^https?:\/\//, "")}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </Card>
            ))}
          </View>
        ))}
      </Screen>
    </FeatureGate>
  );
}
