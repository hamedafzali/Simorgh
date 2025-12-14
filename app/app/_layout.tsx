import { Slot } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function RootLayout() {
  return <Slot />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
