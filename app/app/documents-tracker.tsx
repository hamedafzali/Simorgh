import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors, Spacing, Typography, getTextFontFamily } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import FeatureGate from "../components/FeatureGate";
import { Screen } from "../components/ui/Screen";
import { getJson, setJson } from "../services/localStore";
import { getStarterPack, supportedCountries } from "../services/countries-data";
import { usePreferences } from "../contexts/PreferencesContext";
import { t } from "../services/i18n";

type DocItem = {
  id: string;
  name: string;
  expiresOn: string;
  notes?: string;
};

const storageKey = (code: string) => `documents:${code}`;

function expiryStatus(expiresOn: string): { daysLeft: number | null; color: string } {
  if (!expiresOn) return { daysLeft: null, color: "transparent" };
  const exp = new Date(expiresOn);
  if (isNaN(exp.getTime())) return { daysLeft: null, color: "transparent" };
  const daysLeft = Math.ceil((exp.getTime() - Date.now()) / 86400000);
  if (daysLeft < 0) return { daysLeft, color: "#e53e3e" };
  if (daysLeft <= 30) return { daysLeft, color: "#d97706" };
  return { daysLeft, color: "#38a169" };
}

export default function DocumentsTrackerScreen() {
  const params = useLocalSearchParams<{ country?: string }>();
  const code = (params.country || "DE").toUpperCase();
  const country = supportedCountries.find((c) => c.code === code);
  const { language } = usePreferences();

  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const boldFont = getTextFontFamily(language, "bold");
  const regularFont = getTextFontFamily(language, "normal");

  const starter = getStarterPack(code);
  const baseDocs = useMemo<DocItem[]>(
    () => starter.checklist.map((item) => ({ id: `base-${item}`, name: item, expiresOn: "" })),
    [starter]
  );

  const [docs, setDocs] = useState<DocItem[]>(baseDocs);
  const [newName, setNewName] = useState("");
  const [newExpiry, setNewExpiry] = useState("");

  const load = useCallback(async () => {
    const next = await getJson<DocItem[]>(storageKey(code), baseDocs);
    setDocs(next);
  }, [baseDocs, code]);

  const save = useCallback(async (next: DocItem[]) => {
    await setJson(storageKey(code), next);
  }, [code]);

  useEffect(() => { load(); }, [load]);

  function updateDoc(id: string, field: "expiresOn" | "notes", value: string) {
    setDocs((prev) => {
      const next = prev.map((doc) => doc.id === id ? { ...doc, [field]: value } : doc);
      save(next);
      return next;
    });
  }

  function addDoc() {
    if (!newName.trim()) return;
    const next: DocItem = { id: `custom-${Date.now()}`, name: newName.trim(), expiresOn: newExpiry.trim() };
    setDocs((prev) => { const updated = [...prev, next]; save(updated); return updated; });
    setNewName("");
    setNewExpiry("");
  }

  function removeDoc(id: string) {
    setDocs((prev) => { const updated = prev.filter((doc) => doc.id !== id); save(updated); return updated; });
  }

  const inputStyle = {
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: palette.borderLight,
    borderRadius: 12,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 10,
    color: palette.textPrimary,
    fontSize: Typography.sizes.bodySecondary,
    fontFamily: regularFont,
    textAlign: language === "fa" ? "right" as const : "left" as const,
  };

  return (
    <FeatureGate feature="documents">
      <Screen>
        <PageHeader
          title={t(language, "docTracker.title")}
          subtitle={country ? country.name : "Global"}
        />

        <Card>
          <Text style={{ fontSize: Typography.sizes.bodySecondary, color: palette.textSecondary, lineHeight: 22, fontFamily: regularFont }}>
            {t(language, "docTracker.hint")}
          </Text>
        </Card>

        {docs.map((doc) => {
          const { daysLeft, color } = expiryStatus(doc.expiresOn);
          return (
            <Card key={doc.id}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ fontSize: Typography.sizes.headingM, fontFamily: boldFont, color: palette.textPrimary, flex: 1 }}>
                  {doc.name}
                </Text>
                {daysLeft !== null && (
                  <View style={{ backgroundColor: color, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginLeft: 8 }}>
                    <Text style={{ color: "#fff", fontSize: 11, fontFamily: boldFont }}>
                      {daysLeft < 0
                        ? t(language, "docTracker.expiredLabel")
                        : t(language, "docTracker.expiresSoon", { count: daysLeft })}
                    </Text>
                  </View>
                )}
              </View>
              <TextInput
                value={doc.expiresOn}
                placeholder={t(language, "docTracker.expiryPlaceholder")}
                placeholderTextColor={palette.textMuted}
                onChangeText={(value) => updateDoc(doc.id, "expiresOn", value)}
                style={inputStyle}
              />
              <TextInput
                value={doc.notes || ""}
                placeholder={t(language, "docTracker.notesPlaceholder")}
                placeholderTextColor={palette.textMuted}
                onChangeText={(value) => updateDoc(doc.id, "notes", value)}
                style={inputStyle}
              />
              {doc.id.startsWith("custom-") && (
                <Pressable onPress={() => removeDoc(doc.id)}>
                  <Text style={{ marginTop: Spacing.sm, fontSize: Typography.sizes.bodySecondary, color: palette.error, fontFamily: regularFont }}>
                    {t(language, "docTracker.remove")}
                  </Text>
                </Pressable>
              )}
            </Card>
          );
        })}

        <Card>
          <Text style={{ fontSize: Typography.sizes.headingM, fontFamily: boldFont, color: palette.textPrimary, marginBottom: Spacing.sm }}>
            {t(language, "docTracker.addTitle")}
          </Text>
          <TextInput
            value={newName}
            placeholder={t(language, "docTracker.namePlaceholder")}
            placeholderTextColor={palette.textMuted}
            onChangeText={setNewName}
            style={{ ...inputStyle, marginTop: 0 }}
          />
          <TextInput
            value={newExpiry}
            placeholder={t(language, "docTracker.expiryPlaceholder")}
            placeholderTextColor={palette.textMuted}
            onChangeText={setNewExpiry}
            style={inputStyle}
          />
          <Pressable onPress={addDoc}>
            <View style={{ marginTop: Spacing.sm, backgroundColor: palette.primary, borderRadius: 12, paddingVertical: 12, alignItems: "center" }}>
              <Text style={{ color: palette.textOnPrimary, fontSize: Typography.sizes.bodySecondary, fontFamily: boldFont }}>
                {t(language, "docTracker.add")}
              </Text>
            </View>
          </Pressable>
        </Card>
      </Screen>
    </FeatureGate>
  );
}
