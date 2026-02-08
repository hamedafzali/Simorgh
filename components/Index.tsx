// @ts-nocheck
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Image,
  Dimensions,
  TouchableOpacity,
  Text,
  StatusBar,
} from "react-native";

export default function Index() {
  // Hide status bar to remove time, battery, and system icons
  StatusBar.setHidden(true);

  const [logoOpacity] = useState(new Animated.Value(0));
  const [logoPosition] = useState(new Animated.ValueXY({ x: 0, y: 0 }));
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnimation] = useState(new Animated.Value(0));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({
    temperature: 22,
    condition: "Partly Cloudy",
    location: "Tehran",
    humidity: 45,
    windSpeed: 12,
  });

  useEffect(() => {
    logoOpacity.setValue(1);
    const { width, height } = Dimensions.get("window");

    // Calculate actual center of screen
    const centerX = width / 2;
    const centerY = height / 2;

    // Calculate bottom right position
    const targetX = width - 100;
    const targetY = height - 100;

    // Start from center (0, 0 in centered container)
    logoPosition.setValue({ x: centerX, y: centerY });

    // Animate to bottom right
    Animated.timing(logoPosition, {
      toValue: { x: targetX, y: targetY },
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Christian date/time with modern style
  const formatChristianDateTime = () => {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const date = now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    return { time, date };
  };

  // Format Persian date (simplified version)
  const formatPersianDate = () => {
    const persianMonths = [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ];
    // This is a simplified conversion - you may want to use a proper Persian calendar library
    const now = new Date();
    const year = now.getFullYear() - 621; // Rough conversion
    const month = persianMonths[now.getMonth()];
    const day = now.getDate();
    return `${day} ${month} ${year}`;
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <View style={styles.container}>
      <View style={styles.glassBox}>
        <Text style={styles.timeText}>{formatChristianDateTime().time}</Text>
        <Text style={styles.dateText}>{formatChristianDateTime().date}</Text>
        <Text style={styles.persianDate}>{formatPersianDate()}</Text>
        <Text style={styles.weatherText}>{weather.temperature}°C</Text>
        <Text style={styles.weatherCondition}>{weather.condition}</Text>
        <Text style={styles.weatherLocation}>{weather.location}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A2E",
  },
  glassBox: {
    position: "absolute",
    top: 30,
    left: 0,
    right: 0,
    height: "22%",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 40,
    margin: 20,
    padding: 35,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 32,
    elevation: 15,
  },
  timeText: {
    fontSize: 42,
    fontWeight: "300",
    color: "#FFFFFF",
    letterSpacing: 2,
    textShadowColor: "#000000",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
    letterSpacing: 1.2,
    textShadowColor: "#000000",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  persianDate: {
    fontSize: 12,
    fontWeight: "400",
    color: "#FFFFFF",
    letterSpacing: 0.8,
    textShadowColor: "#000000",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  weatherText: {
    fontSize: 48,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1.5,
    textShadowColor: "#000000",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  weatherCondition: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    letterSpacing: 1,
    marginBottom: 3,
    textShadowColor: "#000000",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  weatherLocation: {
    fontSize: 14,
    fontWeight: "400",
    color: "#FFFFFF",
    letterSpacing: 0.8,
    textShadowColor: "#000000",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
