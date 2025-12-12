import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  subtitle?: string;
  height?: string;
}

export default function PageHeader({
  title,
  showBackButton = false,
  onBackPress,
  rightComponent,
  subtitle,
  height,
}: PageHeaderProps) {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "border");

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor, borderBottomColor: borderColor },
      ]}
    >
      <View style={styles.leftSection}>
        {showBackButton && (
          <TouchableOpacity
            style={[styles.backButton, { borderColor }]}
            onPress={handleBackPress}
          >
            <IconSymbol name="chevron.left" size={20} color={textColor} />
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <ThemedText style={[styles.title, { color: textColor }]}>
            {title}
          </ThemedText>
          {subtitle && (
            <ThemedText style={[styles.subtitle, { color: textColor }]}>
              {subtitle}
            </ThemedText>
          )}
        </View>
      </View>
      {rightComponent && (
        <View style={styles.rightSection}>{rightComponent}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    minHeight: 60,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    marginTop: 2,
    opacity: 0.7,
  },
  rightSection: {
    alignItems: "center",
  },
});
