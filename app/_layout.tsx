import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "../hooks/use-auth";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Simorgh Connect",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(drawer)"
          options={{
            title: "Simorgh Connect",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="auth"
          options={{
            title: "Authentication",
            headerShown: false,
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
