import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors, Spacing, Typography } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import FeatureGate from "../components/FeatureGate";
import { Screen } from "../components/ui/Screen";
import { getJson, setJson } from "../services/localStore";
import {
  getStarterPack,
  getTimeline,
  supportedCountries,
} from "../services/countries-data";
import { usePreferences } from "../contexts/PreferencesContext";
import { fa } from "../services/l10n";
import { t } from "../services/i18n";

type ChecklistItem = {
  id: string;
  label: string;
  labelFa?: string;
  section: string;
  sectionFa?: string;
};

const storageKey = (code: string) => `checklist:${code}`;

export default function ChecklistScreen() {
  const params = useLocalSearchParams<{ country?: string }>();
  const code = (params.country || "DE").toUpperCase();
  const country = supportedCountries.find((c) => c.code === code);
  const { language } = usePreferences();

  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  const starter = getStarterPack(code);
  const timeline = getTimeline(code);

  const items = useMemo<ChecklistItem[]>(() => {
    const list: ChecklistItem[] = [];
    const starterStepsFa = starter.stepsFa ?? [];
    const starterChecklistFa = starter.checklistFa ?? [];

    starter.steps.forEach((step, index) => {
      list.push({
        id: `step-${index}`,
        label: step,
        labelFa: starterStepsFa[index],
        section: "Starter Steps",
        sectionFa: "مراحل اولیه",
      });
    });
    starter.checklist.forEach((item, index) => {
      list.push({
        id: `doc-${index}`,
        label: item,
        labelFa: starterChecklistFa[index],
        section: "Documents",
        sectionFa: "مدارک",
      });
    });
    timeline.forEach((block, blockIndex) => {
      const blockItemsFa = block.itemsFa ?? [];
      block.items.forEach((item, index) => {
        list.push({
          id: `timeline-${blockIndex}-${index}`,
          label: item,
          labelFa: blockItemsFa[index],
          section: `Timeline · ${block.dayRange}`,
          sectionFa: `روزشمار · ${block.dayRange}`,
        });
      });
    });
    return list;
  }, [starter, timeline]);

  const [done, setDone] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    const next = await getJson<Record<string, boolean>>(storageKey(code), {});
    setDone(next);
  }, [code]);

  const save = useCallback(
    async (next: Record<string, boolean>) => {
      await setJson(storageKey(code), next);
    },
    [code]
  );

  useEffect(() => {
    load();
  }, [load]);

  function toggle(itemId: string) {
    setDone((prev) => {
      const next = { ...prev, [itemId]: !prev[itemId] };
      save(next);
      return next;
    });
  }

  const grouped = useMemo(() => {
    return items.reduce<Record<string, ChecklistItem[]>>((acc, item) => {
      if (!acc[item.section]) acc[item.section] = [];
      acc[item.section].push(item);
      return acc;
    }, {});
  }, [items]);

  return (
    <FeatureGate feature="checklist">
      <Screen>
      <PageHeader
        title={t(language, "checklist.title")}
        subtitle={country ? country.name : "Global"}
      />

      {Object.entries(grouped).map(([section, sectionItems]) => (
        <Card key={section}>
          <Text
            style={{
              fontSize: Typography.sizes.headingM,
              fontWeight: Typography.fontWeight.bold,
              color: palette.textPrimary,
              marginBottom: Spacing.sm,
            }}
          >
            {fa(sectionItems[0]?.sectionFa, section, language)}
          </Text>
          {sectionItems.map((item) => {
            const isDone = !!done[item.id];
            return (
              <Pressable
                key={item.id}
                onPress={() => toggle(item.id)}
                style={{
                  paddingVertical: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: Typography.sizes.bodySecondary,
                    color: isDone ? palette.textMuted : palette.textSecondary,
                    textDecorationLine: isDone ? "line-through" : "none",
                    lineHeight: 22,
                  }}
                >
                  {isDone ? "✓ " : "• "}
                  {fa(item.labelFa, item.label, language)}
                </Text>
              </Pressable>
            );
          })}
        </Card>
      ))}
      </Screen>
    </FeatureGate>
  );
}
