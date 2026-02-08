import React from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { Card } from "../../components/ui/Card";
import { Header } from "../../components/ui/Header";
import { ListItem } from "../../components/ui/ListItem";
import { Screen } from "../../components/ui/Screen";
import { Chevron } from "../../components/ui/Chevron";

export default function CommunityTab() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <Screen>
      <Header
        title="Community"
        subtitle="Guides, events, documents, and local help"
      />

      <Card>
        <Text
          style={{
            fontSize: Typography.sizes.bodySecondary,
            color: palette.textSecondary,
            lineHeight: 22,
          }}
        >
          Germany-first help hub for Iranian newcomers. More countries can be
          added later.
        </Text>
      </Card>

      <ListItem
        title="Guides"
        subtitle="Residency, registration, banking, health"
        onPress={() => router.push("/guides" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="Countries"
        subtitle="Starter packs for each country"
        onPress={() => router.push("/countries" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="Checklist"
        subtitle="Track your progress"
        onPress={() => router.push("/checklist" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="Deadlines"
        subtitle="Know what is due and when"
        onPress={() => router.push("/deadlines" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="Document Tracker"
        subtitle="Track expiry dates"
        onPress={() => router.push("/documents-tracker" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="Residency Reminders"
        subtitle="Important deadlines"
        onPress={() => router.push("/residency-reminders" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="School Enrollment"
        subtitle="Guide for children"
        onPress={() => router.push("/school" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="Phrasebook"
        subtitle="Emergency and daily phrases"
        onPress={() => router.push("/phrasebook" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="Form Helper"
        subtitle="Fill forms with Persian hints"
        onPress={() => router.push("/forms" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="Emergency Kit"
        subtitle="Local emergency numbers"
        onPress={() => router.push("/emergency" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="Locations"
        subtitle="Find local services and offices"
        onPress={() => router.push("/locations" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="Timeline"
        subtitle="30/60/90-day plan"
        onPress={() => router.push("/timeline" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="Trusted Services"
        subtitle="Lawyers, translators, advisors"
        onPress={() => router.push("/services" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="FAQ"
        subtitle="Quick answers to common questions"
        onPress={() => router.push("/faq" as any)}
        right={<Chevron />}
      />

      <ListItem
        title="Chat"
        subtitle="Ask questions and get help"
        onPress={() => router.push("/chat" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="Events"
        subtitle="Workshops, meetups, and community gatherings"
        onPress={() => router.push("/events" as any)}
        right={<Chevron />}
      />
      <ListItem
        title="Documents"
        subtitle="Immigration forms and guidance"
        onPress={() => router.push("/documents" as any)}
        right={<Chevron />}
      />
      <View style={{ height: Spacing.lg }} />
    </Screen>
  );
}
