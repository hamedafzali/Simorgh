import React, { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors, Spacing, Typography } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Screen } from "../components/ui/Screen";
import {
  getResidencyReminders,
  supportedCountries,
} from "../services/countries-data";

type ReminderState = Record<string, boolean>;

const storageKey = (code: string) => `reminders:${code}`;

export default function ResidencyRemindersScreen() {
  const params = useLocalSearchParams<{ country?: string }>();
  const code = (params.country || "DE").toUpperCase();
  const country = supportedCountries.find((c) => c.code === code);

  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const reminders = getResidencyReminders(code);

  const [enabled, setEnabled] = useState<ReminderState>({});

  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(storageKey(code));
      if (raw) {
        setEnabled(JSON.parse(raw));
      }
    } catch {
      setEnabled({});
    }
  }, [code]);

  const save = useCallback(
    async (next: ReminderState) => {
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

  function toggle(id: string) {
    setEnabled((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      save(next);
      return next;
    });
  }

  return (
    <Screen>
      <PageHeader
        title="Residency Reminders"
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
          Save reminders now. Notifications will be added later, using your
          selections.
        </Text>
      </Card>

      {reminders.map((item) => {
        const isOn = !!enabled[item.title];
        return (
          <Card key={item.title}>
            <Pressable onPress={() => toggle(item.title)}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: Typography.sizes.headingM,
                    fontWeight: Typography.fontWeight.bold,
                    color: isOn ? palette.primary : palette.textPrimary,
                  }}
                >
                  {item.title}
                </Text>
                <View
                  style={{
                    backgroundColor: isOn ? palette.primary : palette.borderLight,
                    borderRadius: 12,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: isOn ? palette.textOnPrimary : palette.textSecondary,
                    }}
                  >
                    {isOn ? "On" : "Off"}
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  fontSize: Typography.sizes.bodySecondary,
                  color: palette.textSecondary,
                  lineHeight: 22,
                  marginTop: Spacing.xs,
                }}
              >
                Due in {item.dueInDays} days. {item.notes}
              </Text>
            </Pressable>
          </Card>
        );
      })}
    </Screen>
  );
}
