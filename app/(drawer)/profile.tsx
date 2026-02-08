import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  joinDate: Date;
  germanLevel: string;
  location: string;
  nativeLanguage: string;
  bio: string;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    autoSync: boolean;
    language: string;
  };
  stats: {
    wordsLearned: number;
    streakDays: number;
    examsCompleted: number;
    studyTime: number; // in minutes
  };
}

const mockProfile: UserProfile = {
  id: "1",
  name: "Sara Ahmadi",
  email: "sara.ahmadi@example.com",
  joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
  germanLevel: "B1",
  location: "Berlin, Germany",
  nativeLanguage: "Farsi",
  bio: "Learning German to integrate better in Germany and advance my career.",
  preferences: {
    notifications: true,
    darkMode: false,
    autoSync: true,
    language: "English",
  },
  stats: {
    wordsLearned: 342,
    streakDays: 15,
    examsCompleted: 8,
    studyTime: 1250,
  },
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [editingMode, setEditingMode] = useState(false);

  const updatePreference = (
    key: keyof UserProfile["preferences"],
    value: any
  ) => {
    setProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }));
  };

  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "A1":
      case "A2":
        return theme.success;
      case "B1":
      case "B2":
        return theme.warning;
      case "C1":
      case "C2":
        return theme.error;
      default:
        return theme.textSecondary;
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => console.log("Logout"),
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. Are you sure you want to delete your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => console.log("Delete account"),
        },
      ]
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background, paddingTop: insets.top },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Profile</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditingMode(!editingMode)}
          >
            <Ionicons
              name={editingMode ? "checkmark" : "create-outline"}
              size={20}
              color={theme.accent}
            />
            <Text style={[styles.editButtonText, { color: theme.accent }]}>
              {editingMode ? "Done" : "Edit"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Info Card */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.profileHeader}>
            <View style={[styles.avatar, { backgroundColor: theme.accent }]}>
              <Text style={styles.avatarText}>
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.text }]}>
                {profile.name}
              </Text>
              <Text
                style={[styles.profileEmail, { color: theme.textSecondary }]}
              >
                {profile.email}
              </Text>
              <View style={styles.levelContainer}>
                <Text
                  style={[styles.levelLabel, { color: theme.textSecondary }]}
                >
                  German Level:
                </Text>
                <View
                  style={[
                    styles.levelBadge,
                    { backgroundColor: getLevelColor(profile.germanLevel) },
                  ]}
                >
                  <Text style={styles.levelText}>{profile.germanLevel}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.profileDetails}>
            <View style={styles.detailItem}>
              <Ionicons
                name="location-outline"
                size={16}
                color={theme.textSecondary}
              />
              <Text style={[styles.detailText, { color: theme.text }]}>
                {profile.location}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons
                name="flag-outline"
                size={16}
                color={theme.textSecondary}
              />
              <Text style={[styles.detailText, { color: theme.text }]}>
                Native: {profile.nativeLanguage}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={theme.textSecondary}
              />
              <Text style={[styles.detailText, { color: theme.text }]}>
                Joined {formatDate(profile.joinDate)}
              </Text>
            </View>
          </View>

          {profile.bio && (
            <View style={styles.bioSection}>
              <Text style={[styles.bioLabel, { color: theme.textSecondary }]}>
                Bio
              </Text>
              <Text style={[styles.bioText, { color: theme.text }]}>
                {profile.bio}
              </Text>
            </View>
          )}
        </View>

        {/* Learning Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Learning Progress
          </Text>
          <View style={styles.statsGrid}>
            <View
              style={[
                styles.statCard,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                },
              ]}
            >
              <Ionicons
                name="book-outline"
                size={24}
                color={theme.accent}
                style={styles.statIcon}
              />
              <Text style={[styles.statNumber, { color: theme.text }]}>
                {profile.stats.wordsLearned}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Words Learned
              </Text>
            </View>
            <View
              style={[
                styles.statCard,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                },
              ]}
            >
              <Ionicons
                name="flame-outline"
                size={24}
                color={theme.success}
                style={styles.statIcon}
              />
              <Text style={[styles.statNumber, { color: theme.text }]}>
                {profile.stats.streakDays}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Day Streak
              </Text>
            </View>
            <View
              style={[
                styles.statCard,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                },
              ]}
            >
              <Ionicons
                name="document-text-outline"
                size={24}
                color={theme.warning}
                style={styles.statIcon}
              />
              <Text style={[styles.statNumber, { color: theme.text }]}>
                {profile.stats.examsCompleted}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Exams Completed
              </Text>
            </View>
            <View
              style={[
                styles.statCard,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                },
              ]}
            >
              <Ionicons
                name="time-outline"
                size={24}
                color={theme.error}
                style={styles.statIcon}
              />
              <Text style={[styles.statNumber, { color: theme.text }]}>
                {formatStudyTime(profile.stats.studyTime)}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Study Time
              </Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Settings
          </Text>
          <View
            style={[
              styles.settingsCard,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: theme.text }]}>
                  Push Notifications
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    { color: theme.textSecondary },
                  ]}
                >
                  Get notified about study reminders and updates
                </Text>
              </View>
              <Switch
                value={profile.preferences.notifications}
                onValueChange={(value) =>
                  updatePreference("notifications", value)
                }
                trackColor={{ false: theme.border, true: theme.accent }}
                thumbColor={theme.text}
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: theme.text }]}>
                  Dark Mode
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    { color: theme.textSecondary },
                  ]}
                >
                  Use dark theme across the app
                </Text>
              </View>
              <Switch
                value={profile.preferences.darkMode}
                onValueChange={(value) => updatePreference("darkMode", value)}
                trackColor={{ false: theme.border, true: theme.accent }}
                thumbColor={theme.text}
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: theme.text }]}>
                  Auto Sync
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    { color: theme.textSecondary },
                  ]}
                >
                  Automatically sync data when online
                </Text>
              </View>
              <Switch
                value={profile.preferences.autoSync}
                onValueChange={(value) => updatePreference("autoSync", value)}
                trackColor={{ false: theme.border, true: theme.accent }}
                thumbColor={theme.text}
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: theme.text }]}>
                  App Language
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    { color: theme.textSecondary },
                  ]}
                >
                  {profile.preferences.language}
                </Text>
              </View>
              <TouchableOpacity style={styles.settingButton}>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Account
          </Text>
          <View
            style={[
              styles.actionsCard,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
            ]}
          >
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons
                name="help-circle-outline"
                size={20}
                color={theme.accent}
              />
              <Text style={[styles.actionText, { color: theme.text }]}>
                Help & Support
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.textSecondary}
              />
            </TouchableOpacity>

            <View style={styles.actionDivider} />

            <TouchableOpacity style={styles.actionItem}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={theme.success}
              />
              <Text style={[styles.actionText, { color: theme.text }]}>
                Privacy Policy
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.textSecondary}
              />
            </TouchableOpacity>

            <View style={styles.actionDivider} />

            <TouchableOpacity style={styles.actionItem} onPress={handleLogout}>
              <Ionicons
                name="log-out-outline"
                size={20}
                color={theme.warning}
              />
              <Text style={[styles.actionText, { color: theme.text }]}>
                Logout
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.textSecondary}
              />
            </TouchableOpacity>

            <View style={styles.actionDivider} />

            <TouchableOpacity
              style={styles.actionItem}
              onPress={handleDeleteAccount}
            >
              <Ionicons name="trash-outline" size={20} color={theme.error} />
              <Text style={[styles.actionText, { color: theme.error }]}>
                Delete Account
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButtonText: {
    marginLeft: 4,
  },
  profileCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 8,
  },
  levelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  levelLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginRight: 8,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  levelText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  profileDetails: {
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    fontWeight: "400",
    marginLeft: 8,
  },
  bioSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  bioLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  statIcon: {
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
  },
  settingsCard: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    fontWeight: "400",
  },
  settingButton: {
    padding: 8,
  },
  settingDivider: {
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    marginHorizontal: 16,
  },
  actionsCard: {
    borderRadius: 12,
    borderWidth: 1,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
    flex: 1,
  },
  actionDivider: {
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    marginHorizontal: 16,
  },
});
