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

export default function GuideDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = params.id;

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
        subtitle={guide ? guide.title : "Not found"}
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
              {guide.title}
            </Text>
            <Text
              style={{
                fontSize: Typography.sizes.bodySecondary,
                color: palette.textSecondary,
                lineHeight: 22,
              }}
            >
              {guide.summary}
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
              Steps
            </Text>
            {guide.steps.map((step) => (
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
              Checklist
            </Text>
            {guide.checklist.map((item) => (
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
                {section.title}
              </Text>
              {section.bullets.map((bullet) => (
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
                Resources
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
