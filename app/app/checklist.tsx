import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors, Spacing, Typography } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Screen } from "../components/ui/Screen";
import {
  getStarterPack,
  getTimeline,
  supportedCountries,
} from "../services/countries-data";

type ChecklistItem = {
  id: string;
  label: string;
  section: string;
};

const storageKey = (code: string) => `checklist:${code}`;

export default function ChecklistScreen() {
  const params = useLocalSearchParams<{ country?: string }>();
  const code = (params.country || "DE").toUpperCase();
  const country = supportedCountries.find((c) => c.code === code);

  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  const starter = getStarterPack(code);
  const timeline = getTimeline(code);

  const items = useMemo<ChecklistItem[]>(() => {
    const list: ChecklistItem[] = [];
    starter.steps.forEach((step, index) => {
      list.push({
        id: `step-${index}`,
        label: step,
        section: "Starter Steps",
      });
    });
    starter.checklist.forEach((item, index) => {
      list.push({
        id: `doc-${index}`,
        label: item,
        section: "Documents",
      });
    });
    timeline.forEach((block, blockIndex) => {
      block.items.forEach((item, index) => {
        list.push({
          id: `timeline-${blockIndex}-${index}`,
          label: item,
          section: `Timeline · ${block.dayRange}`,
        });
      });
    });
    return list;
  }, [starter, timeline]);

  const [done, setDone] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(storageKey(code));
      if (raw) {
        setDone(JSON.parse(raw));
      }
    } catch {
      setDone({});
    }
  }, [code]);

  const save = useCallback(
    async (next: Record<string, boolean>) => {
      try {
        await AsyncStorage.setItem(storageKey(code), JSON.stringify(next));
      } catch {
        // ignore storage errors for now
      }
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
    <Screen>
      <PageHeader
        title="Checklist"
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
            {section}
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
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </Card>
      ))}
    </Screen>
  );
}
