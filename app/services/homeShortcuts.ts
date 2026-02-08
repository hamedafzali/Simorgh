export type HomeShortcut = {
  key: string;
  title: string;
  subtitle: string;
  icon: "briefcase" | "calendar" | "file-text" | "globe" | "clock" | "help-circle" | "check-circle" | "message-square" | "bell" | "bookmark" | "heart" | "home" | "file" | "clipboard" | "alert-triangle" | "map" | "map-pin" | "message-circle" | "settings";
  route: string;
};

export const homeShortcuts: HomeShortcut[] = [
  {
    key: "jobs",
    title: "Jobs",
    subtitle: "Browse",
    icon: "briefcase",
    route: "/(tabs)/jobs",
  },
  {
    key: "events",
    title: "Events",
    subtitle: "Nearby",
    icon: "calendar",
    route: "/events",
  },
  {
    key: "documents",
    title: "Documents",
    subtitle: "Guides",
    icon: "file-text",
    route: "/documents",
  },
  {
    key: "countries",
    title: "Countries",
    subtitle: "Starter packs",
    icon: "globe",
    route: "/countries",
  },
  {
    key: "timeline",
    title: "Timeline",
    subtitle: "90 days",
    icon: "clock",
    route: "/timeline",
  },
  {
    key: "services",
    title: "Services",
    subtitle: "Trusted",
    icon: "help-circle",
    route: "/services",
  },
  {
    key: "checklist",
    title: "Checklist",
    subtitle: "Progress",
    icon: "check-circle",
    route: "/checklist",
  },
  {
    key: "deadlines",
    title: "Deadlines",
    subtitle: "Due dates",
    icon: "calendar",
    route: "/deadlines",
  },
  {
    key: "documents-tracker",
    title: "Doc Tracker",
    subtitle: "Expiry",
    icon: "file-text",
    route: "/documents-tracker",
  },
  {
    key: "phrasebook",
    title: "Phrasebook",
    subtitle: "Phrases",
    icon: "message-square",
    route: "/phrasebook",
  },
  {
    key: "residency-reminders",
    title: "Reminders",
    subtitle: "Residency",
    icon: "bell",
    route: "/residency-reminders",
  },
  {
    key: "school",
    title: "School",
    subtitle: "Enrollment",
    icon: "bookmark",
    route: "/school",
  },
  {
    key: "support",
    title: "Support",
    subtitle: "Wellbeing",
    icon: "heart",
    route: "/support",
  },
  {
    key: "housing",
    title: "Housing",
    subtitle: "Safety",
    icon: "home",
    route: "/housing-safety",
  },
  {
    key: "tax",
    title: "Tax Basics",
    subtitle: "Deadlines",
    icon: "file",
    route: "/tax",
  },
  {
    key: "forms",
    title: "Form Helper",
    subtitle: "Guided",
    icon: "clipboard",
    route: "/forms",
  },
  {
    key: "emergency",
    title: "Emergency",
    subtitle: "Numbers",
    icon: "alert-triangle",
    route: "/emergency",
  },
  {
    key: "guides",
    title: "Guides",
    subtitle: "Essentials",
    icon: "map",
    route: "/guides",
  },
  {
    key: "locations",
    title: "Locations",
    subtitle: "Nearby",
    icon: "map-pin",
    route: "/locations",
  },
  {
    key: "chat",
    title: "Chat",
    subtitle: "Community",
    icon: "message-circle",
    route: "/chat",
  },
  {
    key: "settings",
    title: "Settings",
    subtitle: "Preferences",
    icon: "settings",
    route: "/settings",
  },
];
