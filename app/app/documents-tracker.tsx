import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors, Spacing, Typography } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Screen } from "../components/ui/Screen";
import { getJson, setJson } from "../services/localStore";
import {
  getStarterPack,
  supportedCountries,
} from "../services/countries-data";

type DocItem = {
  id: string;
  name: string;
  expiresOn: string;
  notes?: string;
};

const storageKey = (code: string) => `documents:${code}`;

export default function DocumentsTrackerScreen() {
  const params = useLocalSearchParams<{ country?: string }>();
  const code = (params.country || "DE").toUpperCase();
  const country = supportedCountries.find((c) => c.code === code);

  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  const starter = getStarterPack(code);
  const baseDocs = useMemo<DocItem[]>(
    () =>
      starter.checklist.map((item) => ({
        id: `base-${item}`,
        name: item,
        expiresOn: "",
      })),
    [starter]
  );

  const [docs, setDocs] = useState<DocItem[]>(baseDocs);
  const [newName, setNewName] = useState("");
  const [newExpiry, setNewExpiry] = useState("");

  const load = useCallback(async () => {
    const next = await getJson<DocItem[]>(storageKey(code), baseDocs);
    setDocs(next);
  }, [baseDocs, code]);

  const save = useCallback(
    async (next: DocItem[]) => {
      await setJson(storageKey(code), next);
    },
    [code]
  );

  useEffect(() => {
    load();
  }, [load]);

  function updateDoc(id: string, field: "expiresOn" | "notes", value: string) {
    setDocs((prev) => {
      const next = prev.map((doc) =>
        doc.id === id ? { ...doc, [field]: value } : doc
      );
      save(next);
      return next;
    });
  }

  function addDoc() {
    if (!newName.trim()) return;
    const next: DocItem = {
      id: `custom-${Date.now()}`,
      name: newName.trim(),
      expiresOn: newExpiry.trim(),
    };
    setDocs((prev) => {
      const updated = [...prev, next];
      save(updated);
      return updated;
    });
    setNewName("");
    setNewExpiry("");
  }

  function removeDoc(id: string) {
    setDocs((prev) => {
      const updated = prev.filter((doc) => doc.id !== id);
      save(updated);
      return updated;
    });
  }

  return (
    <Screen>
      <PageHeader
        title="Document Tracker"
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
          Track expiry dates for your key documents. Format: YYYY-MM-DD.
        </Text>
      </Card>

      {docs.map((doc) => (
        <Card key={doc.id}>
          <Text
            style={{
              fontSize: Typography.sizes.headingM,
              fontWeight: Typography.fontWeight.bold,
              color: palette.textPrimary,
            }}
          >
            {doc.name}
          </Text>
          <TextInput
            value={doc.expiresOn}
            placeholder="Expiry date (YYYY-MM-DD)"
            placeholderTextColor={palette.textMuted}
            onChangeText={(value) => updateDoc(doc.id, "expiresOn", value)}
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
          <TextInput
            value={doc.notes || ""}
            placeholder="Notes (optional)"
            placeholderTextColor={palette.textMuted}
            onChangeText={(value) => updateDoc(doc.id, "notes", value)}
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
          {doc.id.startsWith("custom-") ? (
            <Pressable onPress={() => removeDoc(doc.id)}>
              <Text
                style={{
                  marginTop: Spacing.sm,
                  fontSize: Typography.sizes.bodySecondary,
                  color: palette.error,
                }}
              >
                Remove
              </Text>
            </Pressable>
          ) : null}
        </Card>
      ))}

      <Card>
        <Text
          style={{
            fontSize: Typography.sizes.headingM,
            fontWeight: Typography.fontWeight.bold,
            color: palette.textPrimary,
            marginBottom: Spacing.sm,
          }}
        >
          Add document
        </Text>
        <TextInput
          value={newName}
          placeholder="Document name"
          placeholderTextColor={palette.textMuted}
          onChangeText={setNewName}
          style={{
            borderWidth: 1,
            borderColor: palette.borderLight,
            borderRadius: 12,
            paddingHorizontal: Spacing.sm,
            paddingVertical: 10,
            color: palette.textPrimary,
            fontSize: Typography.sizes.bodySecondary,
          }}
        />
        <TextInput
          value={newExpiry}
          placeholder="Expiry date (YYYY-MM-DD)"
          placeholderTextColor={palette.textMuted}
          onChangeText={setNewExpiry}
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
        <Pressable onPress={addDoc}>
          <View
            style={{
              marginTop: Spacing.sm,
              backgroundColor: palette.primary,
              borderRadius: 12,
              paddingVertical: 12,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: palette.textOnPrimary,
                fontSize: Typography.sizes.bodySecondary,
                fontWeight: Typography.fontWeight.semibold,
              }}
            >
              Add
            </Text>
          </View>
        </Pressable>
      </Card>
    </Screen>
  );
}
