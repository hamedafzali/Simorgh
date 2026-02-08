import { Platform } from "react-native";

import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    // Newer Expo SDKs expect these fields on NotificationBehavior
    // to control how notifications appear on iOS.
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === "web") {
    return true;
  }

  const existing = await Notifications.getPermissionsAsync();
  if (
    existing.granted ||
    existing.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  ) {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync();
  return (
    requested.granted ||
    requested.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

export async function scheduleReminder(
  title: string,
  body: string,
  secondsFromNow: number
): Promise<string | null> {
  if (Platform.OS === "web") {
    const delayMs = Math.max(1, Math.floor(secondsFromNow)) * 1000;
    setTimeout(() => {
      // simple console-based fallback for web
      console.log("Simorgh reminder:", title, body);
    }, delayMs);
    return "web-fallback";
  }

  const allowed = await requestNotificationPermissions();
  if (!allowed) {
    console.warn("Notification permissions not granted");
    return null;
  }

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: {
      seconds: Math.max(1, Math.floor(secondsFromNow)),
      // Cast to any to satisfy NotificationTriggerInput typing across Expo versions
    } as any,
  });

  return identifier;
}
