import { ReactElement, createElement } from "react";
import { Image, ImageSourcePropType } from "react-native";

// Define a key per top-level screen that uses ParallaxScrollView
export type HeaderImageKey =
  | "home"
  | "learn"
  | "community"
  | "localInfo"
  | "jobs"
  | "tools"
  | "wellbeing"
  | "profile";

export type HeaderImageConfig = {
  key: HeaderImageKey;
  source?: ImageSourcePropType; // if undefined, screen will just use header color
};

// Central registry of header images. Add or change entries here.
export const headerImages: Record<HeaderImageKey, HeaderImageConfig> = {
  home: {
    key: "home",
    // Example: replace with a real require once you add an asset
    source: require("../assets/images/home-header.jpg"),
  },
  learn: {
    key: "learn",
    source: require("../assets/images/learn-header.jpg"),
  },
  community: {
    key: "community",
    source: require("../assets/images/community-header.jpg"),
  },
  localInfo: {
    key: "localInfo",
  },
  jobs: {
    key: "jobs",
    source: require("../assets/images/job-header.jpg"),
  },
  tools: {
    key: "tools",
    source: require("../assets/images/tools-header.jpg"),
  },
  wellbeing: {
    key: "wellbeing",
    // source: require('../assets/images/wellbeing-header.jpg'),
  },
  profile: {
    key: "profile",
    source: require("../assets/images/profile-header.jpg"),
  },
};

export function getHeaderImageElement(
  key: HeaderImageKey
): ReactElement | null {
  const cfg = headerImages[key];
  if (!cfg || !cfg.source) return null;

  // Image element is created without JSX so this file can stay .ts
  return createElement(Image, {
    source: cfg.source,
    style: { width: "100%", height: "100%", resizeMode: "cover" },
  });
}
