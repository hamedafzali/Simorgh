import React from "react";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DrawerContent } from "../../components/navigation/DrawerContent";

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer drawerContent={(props) => <DrawerContent {...props} />}>
        <Drawer.Screen
          name="index"
          options={{ title: "Home", drawerLabel: "Home" }}
        />
        <Drawer.Screen
          name="learning"
          options={{ title: "Learning", drawerLabel: "Learning" }}
        />
        <Drawer.Screen
          name="flashcards"
          options={{ title: "Flashcards", drawerLabel: "Flashcards" }}
        />
        <Drawer.Screen
          name="exams"
          options={{ title: "Exams", drawerLabel: "Exams" }}
        />
        <Drawer.Screen
          name="community"
          options={{ title: "Community", drawerLabel: "Community" }}
        />
        <Drawer.Screen
          name="jobs"
          options={{ title: "Jobs", drawerLabel: "Jobs" }}
        />
        <Drawer.Screen
          name="events"
          options={{ title: "Events", drawerLabel: "Events" }}
        />
        <Drawer.Screen
          name="documents"
          options={{ title: "Documents", drawerLabel: "Documents" }}
        />
        <Drawer.Screen
          name="chat"
          options={{ title: "Chat", drawerLabel: "Chat" }}
        />
        <Drawer.Screen
          name="profile"
          options={{ title: "Profile", drawerLabel: "Profile" }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
