import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { Card } from "../../components/ui/Card";
import { Header } from "../../components/ui/Header";
import { Screen } from "../../components/ui/Screen";
import { Button } from "../../components/ui/Button";
import { germanyGuides } from "../../services/germany-data";
import { usePreferences } from "../../contexts/PreferencesContext";
import { fa, faArr } from "../../services/l10n";
import { t } from "../../services/i18n";

export default function GuideDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = params.id;
  const { language } = usePreferences();

  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  const guide = useMemo(
    () => germanyGuides.find((g) => g.id === id),
    [id]
  );

  return (
    <Screen>
      <Header
        title="Guide"
        subtitle={guide ? fa(guide.titleFa, guide.title, language) : "Not found"}
        showBack
      />

      {!guide ? (
        <Card>
          <Text
            style={{
              fontSize: Typography.sizes.bodySecondary,
              color: palette.textSecondary,
              lineHeight: 22,
            }}
          >
            Guide not found.
          </Text>
          <View style={{ height: Spacing.md }} />
          <Button
            title="Back"
            variant="secondary"
            onPress={() => router.back()}
          />
        </Card>
      ) : (
        <>
          <Card>
            <Text
              style={{
                fontSize: Typography.sizes.headingM,
                fontWeight: Typography.fontWeight.bold,
                color: palette.textPrimary,
                marginBottom: Spacing.xs,
              }}
            >
              {fa(guide.titleFa, guide.title, language)}
            </Text>
            <Text
              style={{
                fontSize: Typography.sizes.bodySecondary,
                color: palette.textSecondary,
                lineHeight: 22,
              }}
            >
              {fa(guide.summaryFa, guide.summary, language)}
            </Text>
          </Card>

          <Card>
            <Text
              style={{
                fontSize: Typography.sizes.headingM,
                fontWeight: Typography.fontWeight.bold,
                color: palette.textPrimary,
                marginBottom: Spacing.sm,
              }}
            >
              {t(language, "settlement.steps")}
            </Text>
            {faArr(guide.stepsFa, guide.steps, language).map((step) => (
              <Text
                key={step}
                style={{
                  fontSize: Typography.sizes.bodySecondary,
                  color: palette.textSecondary,
                  lineHeight: 22,
                }}
              >
                • {step}
              </Text>
            ))}
          </Card>

          <Card>
            <Text
              style={{
                fontSize: Typography.sizes.headingM,
                fontWeight: Typography.fontWeight.bold,
                color: palette.textPrimary,
                marginBottom: Spacing.sm,
              }}
            >
              {t(language, "settlement.checklist")}
            </Text>
            {faArr(guide.checklistFa, guide.checklist, language).map((item) => (
              <Text
                key={item}
                style={{
                  fontSize: Typography.sizes.bodySecondary,
                  color: palette.textSecondary,
                  lineHeight: 22,
                }}
              >
                • {item}
              </Text>
            ))}
          </Card>

          {guide.sections?.map((section) => (
            <Card key={section.title}>
              <Text
                style={{
                  fontSize: Typography.sizes.headingM,
                  fontWeight: Typography.fontWeight.bold,
                  color: palette.textPrimary,
                  marginBottom: Spacing.sm,
                }}
              >
                {fa(section.titleFa, section.title, language)}
              </Text>
              {faArr(section.bulletsFa, section.bullets, language).map((bullet) => (
                <Text
                  key={bullet}
                  style={{
                    fontSize: Typography.sizes.bodySecondary,
                    color: palette.textSecondary,
                    lineHeight: 22,
                  }}
                >
                  • {bullet}
                </Text>
              ))}
            </Card>
          ))}

          {guide.resources && guide.resources.length > 0 ? (
            <Card>
              <Text
                style={{
                  fontSize: Typography.sizes.headingM,
                  fontWeight: Typography.fontWeight.bold,
                  color: palette.textPrimary,
                  marginBottom: Spacing.sm,
                }}
              >
                {language === "fa" ? "منابع" : "Resources"}
              </Text>
              {guide.resources.map((resource) => (
                <Text
                  key={resource.url}
                  style={{
                    fontSize: Typography.sizes.bodySecondary,
                    color: palette.textSecondary,
                    lineHeight: 22,
                  }}
                >
                  • {resource.title}
                </Text>
              ))}
            </Card>
          ) : null}
        </>
      )}
    </Screen>
  );
}
