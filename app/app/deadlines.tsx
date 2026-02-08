import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors, Spacing, Typography } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Screen } from "../components/ui/Screen";
import {
  getDeadlines,
  supportedCountries,
} from "../services/countries-data";

const arrivalKey = (code: string) => `arrival:${code}`;
const doneKey = (code: string) => `deadlines:${code}`;

type DoneMap = Record<string, boolean>;

function parseDate(value: string): Date | null {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const [_, year, month, day] = match;
  const date = new Date(`${year}-${month}-${day}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export default function DeadlinesScreen() {
  const params = useLocalSearchParams<{ country?: string }>();
  const code = (params.country || "DE").toUpperCase();
  const country = supportedCountries.find((c) => c.code === code);

  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  const deadlines = getDeadlines(code);
  const [arrivalDate, setArrivalDate] = useState("");
  const [done, setDone] = useState<DoneMap>({});

  const load = useCallback(async () => {
    try {
      const [arrivalRaw, doneRaw] = await Promise.all([
        AsyncStorage.getItem(arrivalKey(code)),
        AsyncStorage.getItem(doneKey(code)),
      ]);
      if (arrivalRaw) setArrivalDate(arrivalRaw);
      if (doneRaw) setDone(JSON.parse(doneRaw));
    } catch {
      setDone({});
    }
  }, [code]);

  const saveDone = useCallback(
    async (next: DoneMap) => {
      try {
        await AsyncStorage.setItem(doneKey(code), JSON.stringify(next));
      } catch {
        // ignore storage errors for now
      }
    },
    [code]
  );

  const saveArrival = useCallback(
    async (next: string) => {
      try {
        await AsyncStorage.setItem(arrivalKey(code), next);
      } catch {
        // ignore storage errors for now
      }
    },
    [code]
  );

  useEffect(() => {
    load();
  }, [load]);

  const arrivalParsed = useMemo(() => parseDate(arrivalDate), [arrivalDate]);

  function toggle(id: string) {
    setDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      saveDone(next);
      return next;
    });
  }

  return (
    <Screen>
      <PageHeader
        title="Deadlines"
        subtitle={country ? country.name : "Global"}
      />

      <Card>
        <Text
          style={{
            fontSize: Typography.sizes.bodySecondary,
            color: palette.textSecondary,
            lineHeight: 22,
          }}
        >
          Set your arrival date to calculate due dates. Format: YYYY-MM-DD.
        </Text>
        <TextInput
          value={arrivalDate}
          placeholder="2026-02-08"
          placeholderTextColor={palette.textMuted}
          onChangeText={(value) => {
            setArrivalDate(value);
            saveArrival(value);
          }}
          style={{
            marginTop: Spacing.sm,
            borderWidth: 1,
            borderColor: palette.borderLight,
            borderRadius: 12,
            paddingHorizontal: Spacing.sm,
            paddingVertical: 10,
            color: palette.textPrimary,
            fontSize: Typography.sizes.bodySecondary,
          }}
        />
      </Card>

      {deadlines.map((item) => {
        const isDone = !!done[item.title];
        const dueDate = arrivalParsed
          ? addDays(arrivalParsed, item.dueInDays)
          : null;
        const dueLabel = dueDate
          ? dueDate.toLocaleDateString()
          : `Due in ${item.dueInDays} days`;

        return (
          <Card key={item.title}>
            <Pressable onPress={() => toggle(item.title)}>
              <Text
                style={{
                  fontSize: Typography.sizes.headingM,
                  fontWeight: Typography.fontWeight.bold,
                  color: isDone ? palette.textMuted : palette.textPrimary,
                  textDecorationLine: isDone ? "line-through" : "none",
                }}
              >
                {isDone ? "✓ " : ""} {item.title}
              </Text>
              <Text
                style={{
                  fontSize: Typography.sizes.bodySecondary,
                  color: palette.textSecondary,
                  lineHeight: 22,
                  marginTop: Spacing.xs,
                }}
              >
                {item.notes}
              </Text>
              <View style={{ marginTop: Spacing.xs }}>
                <Text
                  style={{
                    fontSize: Typography.sizes.bodySecondary,
                    color: palette.primary,
                  }}
                >
                  {dueLabel}
                </Text>
              </View>
            </Pressable>
          </Card>
        );
      })}
    </Screen>
  );
}
