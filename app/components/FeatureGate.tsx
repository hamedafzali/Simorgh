import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { track } from "../services/analytics";
import { Card } from "./ui/Card";
import { EmptyState } from "./ui/EmptyState";
import { PageHeader } from "./ui/PageHeader";
import { Screen } from "./ui/Screen";
import { useFeatureFlags } from "../contexts/FeatureFlagsContext";
import { usePreferences } from "../contexts/PreferencesContext";
import { t } from "../services/i18n";
import type { FeatureFlags } from "../services/features";

type Props = {
  feature: keyof FeatureFlags;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function FeatureGate({ feature, title, subtitle, children }: Props) {
  const router = useRouter();
  const { featureFlags } = useFeatureFlags();
  const { language } = usePreferences();
  const enabled = featureFlags[feature];

  useEffect(() => {
    if (enabled) {
      void track("feature_opened", { feature });
    }
  }, [feature, enabled]);

  if (enabled) {
    return <>{children}</>;
  }

  return (
    <Screen>
      {title ? <PageHeader title={title} subtitle={subtitle} /> : null}
      <Card>
        <EmptyState
          message={t(language, "common.featureUnavailable")}
          action={{
            title: t(language, "common.goHome"),
            onPress: () => router.replace("/(tabs)" as any),
          }}
        />
      </Card>
    </Screen>
  );
}
