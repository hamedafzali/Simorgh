import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors, Spacing, Typography, BorderRadius } from "../constants/theme";

interface FeatureCardProps {
  title: string;
  subtitle: string;
  icon: string;
  onPress: () => void;
  color?: string;
}

export default function FeatureCard({
  title,
  subtitle,
  icon,
  onPress,
  color = Colors.light.primary,
}: FeatureCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  icon: {
    fontSize: 24,
    color: Colors.light.white,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs / 2,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: Typography.fontWeight.normal,
    color: Colors.light.textSecondary,
  },
});
