import communityLocationsData from "@/assets/content/community-locations-v1.json";
import type { Region } from "react-native-maps";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

export type CommunityLocation = {
  id: string;
  name: string;
  type: string;
  region: string;
  address?: string;
  lat: number;
  lon: number;
  tags: string[];
  hours?: Record<string, string>;
};

// --------------------------
// 🇮🇷 Iranian / Persian keyword list
// --------------------------
export const IRANIAN_KEYWORDS = [
  "iran",
  "persian",
  "persisch",
  "persien",
  "farsi",
  "halal",
  "middle eastern",
  "orient",
  "sedaqat", // ✅ add known stores
  "salam", // ✅ add known stores
];

// --------------------------
const CACHE_TTL_MS = 10 * 60 * 1000;
const cache: Record<string, { ts: number; data: CommunityLocation[] }> = {};

function cacheKey(
  lat: number,
  lon: number,
  radiusKm: number,
  keyword?: string
) {
  return `${lat}:${lon}:${radiusKm}:${keyword || ""}`;
}

// -------------------------- Utils --------------------------
function toRadians(d: number) {
  return (d * Math.PI) / 180;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function guessRegionFromCoords(_lat: number, _lon: number) {
  return "germany";
}

function safeGet(tags: Record<string, any>, keys: string[]) {
  for (const k of keys) {
    if (typeof tags[k] === "string") return tags[k];
  }
  return "";
}

// --------------------------
// 🌟 Iranian keyword matcher
// --------------------------
function matchesIranianKeywords(tags: any, name: string): boolean {
  const haystack =
    JSON.stringify(tags).toLowerCase() + " " + name.toLowerCase();

  return IRANIAN_KEYWORDS.some((kw) => haystack.includes(kw.toLowerCase()));
}

// --------------------------
// Overpass Query
// --------------------------
function buildOverpassQuery(lat: number, lon: number, radiusM: number) {
  const q = `
[out:json][timeout:25];
(
  node["shop"](around:${radiusM},${lat},${lon});
  node["amenity"](around:${radiusM},${lat},${lon});
  way["shop"](around:${radiusM},${lat},${lon});
  way["amenity"](around:${radiusM},${lat},${lon});
);
out center;
`;

  // console.log("🟦 Overpass Query:\n", q);
  return q;
}

// --------------------------
// Parse Overpass → CommunityLocation[]
// --------------------------
function parseOverpassElements(
  elements: any[],
  userLat: number,
  userLon: number,
  radiusKm: number
): CommunityLocation[] {
  // console.log("🟨 Raw elements count:", elements.length);

  const results: CommunityLocation[] = [];
  const seenIds = new Set<string>();

  for (const el of elements) {
    const tags = el.tags || {};
    const name = safeGet(tags, ["name", "alt_name"]);
    if (!name) continue;

    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (!lat || !lon) continue;

    const distKm = haversineKm(userLat, userLon, lat, lon);
    if (distKm > radiusKm) continue;

    const address = [
      tags["addr:street"],
      tags["addr:housenumber"],
      tags["addr:postcode"],
      tags["addr:city"],
    ]
      .filter(Boolean)
      .join(", ");

    const id = `osm-${el.type}-${el.id}`;
    if (seenIds.has(id)) continue;
    seenIds.add(id);

    results.push({
      id,
      name,
      type: tags["shop"] || tags["amenity"] || "other",
      region: guessRegionFromCoords(lat, lon),
      address,
      lat,
      lon,
      tags: Object.values(tags).map(String),
      hours: tags["opening_hours"]
        ? { general: tags["opening_hours"] }
        : undefined,
    });
  }

  console.log("🟩 Parsed result count:", results.length);
  return results;
}

// --------------------------
// Fallback Static JSON
// --------------------------
function fallbackFromStatic(
  lat: number,
  lon: number,
  radiusKm: number,
  keyword?: string
) {
  // console.log("🟪 Using fallback data…");

  const loweredKeyword = (keyword || "").toLowerCase();
  const results: CommunityLocation[] = [];

  for (const raw of communityLocationsData as any[]) {
    const plat = Number(raw.lat);
    const plon = Number(raw.lon);

    const distKm = haversineKm(lat, lon, plat, plon);
    if (distKm > radiusKm) continue;

    const haystack = [
      raw.name?.toLowerCase() || "",
      raw.type?.toLowerCase() || "",
      raw.address?.toLowerCase() || "",
      ...(raw.tags || []).map((t: string) => t.toLowerCase()),
    ].join(" ");

    if (loweredKeyword && !haystack.includes(loweredKeyword)) continue;

    results.push(raw);
  }

  // console.log("🟪 Fallback result count:", results.length);
  return results;
}

// -------------------------------------------------------
// ⬇️ MAIN FETCH: Iranian community locations only
// -------------------------------------------------------
export async function fetchIranianCommunityLocations(
  lat: number,
  lon: number,
  radiusKm: number = 1, // ⚡ small radius avoids timeout
  keyword?: string,
  useCache: boolean = true
): Promise<CommunityLocation[]> {
  const key = cacheKey(lat, lon, radiusKm, keyword);
  const now = Date.now();

  if (useCache && cache[key] && now - cache[key].ts < CACHE_TTL_MS) {
    // console.log("🟢 Cache hit");
    return cache[key].data;
  }

  const radiusM = Math.max(100, Math.round(radiusKm * 1000));
  const query = buildOverpassQuery(lat, lon, radiusM);

  let parsed: CommunityLocation[] = [];

  try {
    // console.log("⬆️ Sending POST to Overpass…");

    const response = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: "data=" + encodeURIComponent(query),
    });

    // // console.log("⬇️ Overpass HTTP status:", response.status);

    const raw = await response.text();
    // console.log("⬇️ Overpass RAW TEXT:\n", raw.slice(0, 500));

    let json: any = {};
    try {
      json = JSON.parse(raw);
    } catch (err) {
      console.log("❌ JSON parse error:", err);
    }

    parsed = parseOverpassElements(json.elements || [], lat, lon, radiusKm);
  } catch (err) {
    console.log("❌ Overpass fetch failed:", err);
  }

  // --------------------------
  // Apply Iranian keyword filter to Overpass results
  // --------------------------
  const iranianFromOverpass = parsed.filter((p) =>
    matchesIranianKeywords(p.tags, p.name)
  );

  // console.log("🇮🇷 Iranian from Overpass:", iranianFromOverpass.length);
  //if (iranianFromOverpass.length > 0)
  // console.log("🇮🇷 Sample Overpass Iranian:", iranianFromOverpass[0]);

  // Always also include nearby static JSON locations so we don't miss
  // known Iranian supermarkets / restaurants / bakeries.
  const staticNearby = fallbackFromStatic(lat, lon, radiusKm, keyword);
  // console.log("🇮🇷 Nearby static Iranian:", staticNearby.length);

  // Merge Overpass + static, deduplicating by name + rounded coordinates
  const mergedMap = new Map<string, CommunityLocation>();

  const addToMerged = (loc: CommunityLocation) => {
    const key = `${loc.name.toLowerCase()}::${Math.round(
      loc.lat * 10000
    )}::${Math.round(loc.lon * 10000)}`;
    if (!mergedMap.has(key)) {
      mergedMap.set(key, loc);
    }
  };

  iranianFromOverpass.forEach(addToMerged);
  staticNearby.forEach(addToMerged);

  const merged = Array.from(mergedMap.values());
  // console.log("🇮🇷 Total merged Iranian locations:", merged.length);

  if (!merged.length) {
    // Nothing found at all – just return staticNearby (already nearby
    // filtered) so the map is not empty.
    cache[key] = { ts: now, data: staticNearby };
    return staticNearby;
  }

  cache[key] = { ts: now, data: merged };
  return merged;
}

export function regionCenterToQuery(region: Region) {
  return {
    lat: region.latitude,
    lon: region.longitude,
  };
}
