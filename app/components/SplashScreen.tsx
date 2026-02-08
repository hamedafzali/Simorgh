// @ts-nocheck
import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <Image
          source={require("../assets/images/splash-icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Simorgh</Text>
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
  background: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5E6D3",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F3A5F",
    textAlign: "center",
  },
});
