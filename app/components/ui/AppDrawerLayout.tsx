import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { BorderRadius, Colors, Spacing, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

const SCREEN_WIDTH = Dimensions.get("window").width;
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.85, 320);

interface AppDrawerLayoutProps {
  children: React.ReactNode;
}

export function AppDrawerLayout({ children }: AppDrawerLayoutProps) {
  const [open, setOpen] = useState(false);
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: open ? 0 : -DRAWER_WIDTH,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [open, translateX]);

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChanged = () => {
      forceUpdate();
    };

    i18n.on("languageChanged", handleLanguageChanged);

    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, [i18n]);

  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };

  const navigateTo = (href: any) => {
    setOpen(false);
    router.push(href as any);
  };

  const menuItems = [
    {
      section: t("home.localInfoTitle"),
      items: [
        { label: t("nav.home"), icon: "house.fill", href: "/(tabs)" },
        { label: t("nav.learn"), icon: "book.fill", href: "/(tabs)/learn" },
        { label: "Exams", icon: "doc.text.fill", href: "/(tabs)/exams" },
        {
          label: "Flashcards",
          icon: "rectangle.stack.fill",
          href: "/(tabs)/flashcards",
        },
        {
          label: t("nav.community"),
          icon: "person.3.fill",
          href: "/(tabs)/community",
        },
        {
          label: t("nav.communityMap") || "Community Map",
          icon: "map",
          href: "/(tabs)/community-map",
        },
      ],
    },
    {
      section: t("home.toolsTitle"),
      items: [
        { label: t("home.jobsTitle"), icon: "briefcase.fill", href: "/jobs" },
        {
          label: t("home.localInfoTitle"),
          icon: "info.circle.fill",
          href: "/local-info",
        },
        {
          label: t("nav.tools"),
          icon: "wrench.and.screwdriver.fill",
          href: "/(tabs)/tools",
        },
        { label: t("nav.events"), icon: "calendar", href: "/events" },
      ],
    },
    {
      section: t("nav.account"),
      items: [
        {
          label: t("nav.chat"),
          icon: "bubble.left.and.bubble.right.fill",
          href: "/chat",
        },
        {
          label: t("nav.profile"),
          icon: "person.crop.circle",
          href: "/(tabs)/profile",
        },
      ],
    },
  ];

  return (
    <View style={{ flex: 1 }} key={i18n.language}>
      {children}

      {open && (
        <Pressable
          style={[styles.backdrop, { backgroundColor: "rgba(0,0,0,0.5)" }]}
          onPress={toggleDrawer}
        />
      )}

      <Animated.View
        style={[
          styles.drawer,
          {
            width: DRAWER_WIDTH,
            paddingTop: insets.top || Spacing.xl,
            transform: [{ translateX }],
            backgroundColor: colors.card,
          },
        ]}
      >
        <LinearGradient
          colors={["#6366F1", "#8B5CF6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileSection}
        >
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigateTo("/(tabs)/profile")}
          >
            <View
              style={[
                styles.avatarCircle,
                { backgroundColor: "rgba(255,255,255,0.2)" },
              ]}
            >
              <IconSymbol name="person.crop.circle" size={48} color="#FFFFFF" />
            </View>
            <View style={styles.profileTextColumn}>
              <Text style={[styles.profileName, { color: "#FFFFFF" }]}>
                {t("nav.profile")}
              </Text>
              <Text
                style={[styles.profileLink, { color: "rgba(255,255,255,0.8)" }]}
              >
                {t("profile.languageHint")}
              </Text>
            </View>
            <IconSymbol
              name="chevron.right"
              size={20}
              color="rgba(255,255,255,0.8)"
            />
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.menuContainer}>
          {menuItems.map((section, sectionIndex) => (
            <View key={section.section} style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
                {section.section}
              </Text>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.label}
                  style={styles.menuItem}
                  onPress={() => navigateTo(item.href)}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: colors.backgroundSecondary },
                    ]}
                  >
                    <IconSymbol
                      name={item.icon as any}
                      size={20}
                      color={colors.primary[500]}
                    />
                  </View>
                  <Text style={[styles.menuItemLabel, { color: colors.text }]}>
                    {item.label}
                  </Text>
                  <IconSymbol
                    name="chevron.right"
                    size={16}
                    color={colors.textLight}
                  />
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    zIndex: 20,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    paddingTop: Spacing.xl,
    backgroundColor: "transparent",
  },
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 30,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  profileSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  profileTextColumn: {
    flex: 1,
  },
  profileName: {
    fontSize: Typography.sizes.lg,
    fontWeight: "600" as const,
    marginBottom: 4,
  },
  profileLink: {
    fontSize: Typography.sizes.sm,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: "600" as const,
    marginBottom: Spacing.md,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  menuItemLabel: {
    flex: 1,
    fontSize: Typography.sizes.base,
    fontWeight: "500" as const,
  },
});
