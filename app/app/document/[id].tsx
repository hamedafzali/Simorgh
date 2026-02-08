import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Header } from "../../components/ui/Header";
import { Screen } from "../../components/ui/Screen";
import { documentGuides } from "../../services/germany-data";

export default function DocumentDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = params.id;

  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  const doc = useMemo(() => documentGuides.find((d) => d.id === id), [id]);

  return (
    <Screen>
      <Header
        title="Document"
        subtitle={doc ? doc.title : "Not found"}
        showBack
      />

      {!doc ? (
        <Card>
          <Text
            style={{
              fontSize: Typography.sizes.bodySecondary,
              color: palette.textSecondary,
              lineHeight: 22,
            }}
          >
            Document not found.
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
              {doc.title}
            </Text>
            <Text
              style={{
                fontSize: Typography.sizes.bodySecondary,
                color: palette.textSecondary,
                lineHeight: 22,
              }}
            >
              Category: {doc.category}
            </Text>
            <View style={{ height: Spacing.sm }} />
            <Text
              style={{
                fontSize: Typography.sizes.bodySecondary,
                color: palette.textSecondary,
                lineHeight: 22,
              }}
            >
              {doc.summary}
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
            {doc.steps.map((step) => (
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
            {doc.checklist.map((item) => (
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

          {doc.resources && doc.resources.length > 0 ? (
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
              {doc.resources.map((resource) => (
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

          <Button title="Save checklist (mock)" onPress={() => {}} />
          <View style={{ height: Spacing.sm }} />
          <Button
            title="Back"
            variant="secondary"
            onPress={() => router.back()}
          />
        </>
      )}
    </Screen>
  );
}
