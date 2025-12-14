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
} from "react-native";

export default function Index() {
  const [logoOpacity] = useState(new Animated.Value(0));
  const [logoPosition] = useState(new Animated.ValueXY({ x: 0, y: 0 }));
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnimation] = useState(new Animated.Value(0));
  const [currentTime, setCurrentTime] = useState(new Date());

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

  // Format Christian date/time
  const formatChristianDateTime = () => {
    return currentTime.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
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
    Animated.timing(menuAnimation, {
      toValue: menuOpen ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const menuItems = ["Home", "Profile", "Settings", "About"];
  const radius = 150;

  return (
    <View style={styles.container}>
      <View style={styles.gradientBackground}>
        {/* Glass Box at top */}
        <View style={styles.glassBox}>
          <Text style={styles.christianDateTime}>
            {formatChristianDateTime()}
          </Text>
          <Text style={styles.persianDate}>{formatPersianDate()}</Text>
        </View>

        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [
                { translateX: logoPosition.x },
                { translateY: logoPosition.y },
              ],
            },
          ]}
        >
          <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
            <Image
              source={require("../assets/images/splash-icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Animated.View>

        {menuItems.map((item, index) => {
          // Use angles from 180° to 270° for 90-degree range (bottom-left quadrant)
          const angles = [
            Math.PI, // 180° - left
            (Math.PI * 7) / 6, // 210° - bottom-left
            (Math.PI * 4) / 3, // 240° - bottom-left
            (Math.PI * 3) / 2, // 270° - bottom
          ];
          const angle = angles[index];
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <Animated.View
              key={index}
              style={[
                styles.circularMenuItem,
                {
                  opacity: menuAnimation,
                  transform: [
                    {
                      translateX: Animated.add(
                        logoPosition.x,
                        menuAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, x],
                        })
                      ),
                    },
                    {
                      translateY: Animated.add(
                        logoPosition.y,
                        menuAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, y],
                        })
                      ),
                    },
                    {
                      scale: menuAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity style={styles.menuCircle}>
                <Text style={styles.menuItemText}>{item}</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#F5E6D3",
  },
  glassBox: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "30%", // 30% of screen height
    backgroundColor: "rgba(255, 255, 255, 0.3)", // Semi-transparent white
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    margin: 20,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  christianDateTime: {
    fontSize: 16,
    color: "#1F3A5F",
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  persianDate: {
    fontSize: 18,
    color: "#1F3A5F",
    fontWeight: "700",
    textAlign: "center",
  },
  logoContainer: {
    position: "absolute",
  },
  menuButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  logo: {
    width: 60,
    height: 60,
  },
  circularMenuItem: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  menuCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#1F3A5F",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 12,
    borderWidth: 3,
    borderColor: "#2E5090",
  },
  menuItemText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "700",
    textShadowColor: "#000000",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
});
