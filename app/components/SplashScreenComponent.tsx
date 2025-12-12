import { AppDrawerLayout } from "@/components/AppDrawerLayout";
import { Slot } from "expo-router";
import React from "react";

export default function DrawerLayout() {
  return (
    <AppDrawerLayout>
      <Slot />
    </AppDrawerLayout>
  );
}
