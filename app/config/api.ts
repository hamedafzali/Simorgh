import { Platform } from "react-native";

const DEFAULT_DEV_API_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3001/api"
    : "http://localhost:3001/api";

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || DEFAULT_DEV_API_BASE_URL;

export const API_KEY = process.env.EXPO_PUBLIC_API_KEY ?? "";

export function apiHeaders(): HeadersInit {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (API_KEY) headers["x-api-key"] = API_KEY;
  return headers;
}
