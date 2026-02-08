import React from "react";
import { AppRegistry, StyleSheet } from "react-native";
import Index from "./components/Index";

export default function App() {
  return <Index />;
}

AppRegistry.registerComponent("main", () => App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: "#1C1C1E",
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#1C1C1E",
    fontWeight: "500",
    marginBottom: 32,
    textAlign: "center",
    opacity: 0.7,
  },
  button: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    marginBottom: 24,
    minWidth: 200,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#1C1C1E",
    fontWeight: "600",
  },
  description: {
    fontSize: 16,
    color: "#1C1C1E",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 300,
  },
});
