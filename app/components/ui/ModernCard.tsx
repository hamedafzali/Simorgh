import React, { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";

interface ModernCardProps {
  children: ReactNode;
  title?: string;
  variant?: "default" | "glass" | "elevated" | "outlined";
  size?: "sm" | "md" | "lg";
  style?: ViewStyle;
  onPress?: () => void;
}

export function ModernCard({
  children,
  title,
  variant = "default",
  size = "md",
  style,
  onPress,
}: ModernCardProps) {
  const backgroundColor = useThemeColor({}, "card");
  const borderColor = useThemeColor({}, "border");
  const shadowColor = useThemeColor({}, "shadow");

  const getCardStyles = (): ViewStyle[] => {
    const baseStyles: ViewStyle[] = [styles.card];

    // Size styles
    switch (size) {
      case "sm":
        baseStyles.push(styles.cardSmall);
        break;
      case "lg":
        baseStyles.push(styles.cardLarge);
        break;
      default:
        baseStyles.push(styles.cardMedium);
    }

    // Variant styles
    switch (variant) {
      case "glass":
        baseStyles.push(styles.glass);
        break;
      case "elevated":
        baseStyles.push(styles.elevated);
        break;
      case "outlined":
        baseStyles.push(styles.outlined);
        break;
      default:
        baseStyles.push(styles.default);
    }

    return baseStyles;
  };

  const cardStyles = [
    ...getCardStyles(),
    {
      backgroundColor: variant === "glass" ? "rgba(255, 255, 255, 0.1)" : backgroundColor,
      borderColor,
      shadowColor,
    },
    style,
  ];

  const CardComponent = onPress ? View : View;

  return (
    <CardComponent style={cardStyles}>
      {title && <ModernCardTitle>{title}</ModernCardTitle>}
      {children}
    </CardComponent>
  );
}

function ModernCardTitle({ children }: { children: ReactNode }) {
  const textColor = useThemeColor({}, "text");
  
  return (
    <View style={styles.titleContainer}>
      <ModernCardTitleText style={{ color: textColor }}>
        {children}
      </ModernCardTitleText>
    </View>
  );
}

function ModernCardTitleText({ 
  children, 
  style 
}: { 
  children: ReactNode; 
  style?: any;
}) {
  const textColor = useThemeColor({}, "text");
  
  return (
    <View style={[styles.titleText, { color: textColor }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  cardSmall: {
    padding: 12,
    borderRadius: 8,
  },
  cardMedium: {
    padding: 16,
    borderRadius: 12,
  },
  cardLarge: {
    padding: 20,
    borderRadius: 16,
  },
  default: {
    borderWidth: 1,
  },
  glass: {
    borderWidth: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  elevated: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  outlined: {
    borderWidth: 2,
  },
  titleContainer: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
  },
});

export default ModernCard;
