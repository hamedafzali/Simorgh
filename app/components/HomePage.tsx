import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from "react-native";
import { Colors, Spacing, Typography, BorderRadius } from "../constants/theme";
import FeatureCard from "./FeatureCard";

export default function HomePage() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.headerText}>خوش آمدید</Text>
          <Text style={styles.subHeaderText}>Welcome to Simorgh Connect</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
  },
  headerText: {
    fontSize: Typography.sizes.headingXl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.sm,
  },
  subHeaderText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.fontWeight.normal,
    color: Colors.light.textSecondary,
  },
});
