import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/use-theme";
import { useAuth } from "../../hooks/use-auth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export function DrawerContent(props: any) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      title: "Home",
      icon: "home-outline" as const,
      onPress: () => props.navigation.navigate("index"),
    },
    {
      title: "Learning",
      icon: "book-outline" as const,
      onPress: () => props.navigation.navigate("learning"),
    },
    {
      title: "Flashcards",
      icon: "card-outline" as const,
      onPress: () => props.navigation.navigate("flashcards"),
    },
    {
      title: "Exams",
      icon: "document-text-outline" as const,
      onPress: () => props.navigation.navigate("exams"),
    },
    {
      title: "Community",
      icon: "people-outline" as const,
      onPress: () => props.navigation.navigate("community"),
    },
    {
      title: "Jobs",
      icon: "briefcase-outline" as const,
      onPress: () => props.navigation.navigate("jobs"),
    },
    {
      title: "Events",
      icon: "calendar-outline" as const,
      onPress: () => props.navigation.navigate("events"),
    },
    {
      title: "Documents",
      icon: "folder-outline" as const,
      onPress: () => props.navigation.navigate("documents"),
    },
    {
      title: "Chat",
      icon: "chatbubble-outline" as const,
      onPress: () => props.navigation.navigate("chat"),
    },
    {
      title: "Profile",
      icon: "person-outline" as const,
      onPress: () => props.navigation.navigate("profile"),
    },
  ];

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/auth/login");
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Image
          source={require("../../assets/images/simorgh-logo.png")}
          style={styles.logo}
          defaultSource={require("../../assets/images/simorgh-logo.png")}
        />
        <Text style={[styles.appName, { color: theme.text }]}>
          Simorgh Connect
        </Text>
        <Text style={[styles.tagline, { color: theme.textSecondary }]}>
          German Learning for Iranian Community
        </Text>
      </View>

      <ScrollView style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, { borderBottomColor: theme.border }]}
            onPress={item.onPress}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color={theme.textSecondary}
              style={styles.menuIcon}
            />
            <Text style={[styles.menuText, { color: theme.text }]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={[styles.userInfo, { borderTopColor: theme.border }]}>
          <View style={[styles.avatar, { backgroundColor: theme.accent }]}>
            <Text style={styles.avatarText}>
              {user?.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "U"}
            </Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={[styles.userName, { color: theme.text }]}>
              {user?.name || "Guest User"}
            </Text>
            <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
              {user?.email || "Not logged in"}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons
            name="log-out-outline"
            size={24}
            color={theme.error}
            style={styles.logoutIcon}
          />
          <Text style={[styles.logoutText, { color: theme.error }]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 12,
  },
  appName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  tagline: {
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
  },
  footer: {
    paddingBottom: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    fontWeight: "400",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
  },
  logoutIcon: {
    marginRight: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
