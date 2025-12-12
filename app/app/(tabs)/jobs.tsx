import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Spacing } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
}

interface WeatherDisplayProps {
  style?: any;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  weatherInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  temperatureContainer: {
    flex: 1,
  },
  temperature: {
    fontSize: 24,
    fontWeight: "600",
  },
  condition: {
    fontSize: 14,
    marginTop: 2,
  },
  location: {
    fontSize: 12,
    marginTop: 2,
  },
  details: {
    alignItems: "flex-end",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  detailText: {
    fontSize: 12,
    marginLeft: 4,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
  },
  errorText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
  },
});

const weatherIcons: { [key: string]: string } = {
  clear: "sun.max.fill",
  clouds: "cloud.fill",
  rain: "cloud.rain.fill",
  snow: "snow",
  thunderstorm: "cloud.bolt.fill",
  drizzle: "cloud.drizzle.fill",
  mist: "cloud.fog.fill",
  fog: "cloud.fog.fill",
  haze: "sun.haze.fill",
  dust: "sun.dust.fill",
  sand: "sun.dust.fill",
  ash: "smoke.fill",
  squall: "wind",
  tornado: "tornado",
  default: "questionmark.circle",
};

export default function WeatherDisplay({ style }: WeatherDisplayProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Theme colors
  const cardBackgroundColor = useThemeColor({}, "card") as string;
  const borderColor = useThemeColor({}, "border") as string;

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    let lat = 52.52; // Default Berlin coordinates
    let lon = 13.405;
    let locationName = "Berlin";

    try {
      setLoading(true);
      setError(null);

      // Try to get saved location from AsyncStorage
      try {
        const savedLocationData = await AsyncStorage.getItem(
          "Simorgh.savedLocation"
        );
        if (savedLocationData) {
          const location = JSON.parse(savedLocationData);
          lat = location.latitude;
          lon = location.longitude;
          locationName = "Your Location";
          console.log("Using saved location:", lat, lon);
        }
      } catch (storageError) {
        console.warn(
          "Could not load saved location, using default:",
          storageError
        );
      }

      // 7Timer! API (free, no API key required)
      // Using CIVIL product for general weather forecast
      const response = await fetch(
        `http://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`
      );

      if (!response.ok) {
        throw new Error("Weather data unavailable");
      }

      const data = await response.json();

      // Check if we have data
      if (!data || !data.dataseries || data.dataseries.length === 0) {
        throw new Error("No weather data available");
      }

      // Get current forecast (first item in dataseries)
      const currentForecast = data.dataseries[0];

      // Map 7Timer! weather types to our conditions
      const getWeatherCondition = (weatherType: string) => {
        if (weatherType.includes("clear")) return "clear";
        if (weatherType.includes("pcloudy")) return "clouds";
        if (weatherType.includes("mcloudy")) return "clouds";
        if (weatherType.includes("cloudy")) return "clouds";
        if (weatherType.includes("humid")) return "fog";
        if (weatherType.includes("rain")) return "rain";
        if (weatherType.includes("snow")) return "snow";
        if (weatherType.includes("ts")) return "thunderstorm";
        return "clear";
      };

      // Convert wind speed from 7Timer! scale to km/h
      const convertWindSpeed = (windSpeed: number) => {
        const windSpeeds = [0, 2, 5, 8, 10, 15, 20, 25, 30]; // Approximate km/h values
        return windSpeeds[windSpeed - 1] || 10; // Default to 10 km/h
      };

      const weatherData: WeatherData = {
        location: locationName,
        temperature: currentForecast.temp2m || 18,
        condition: getWeatherCondition(currentForecast.weather || "clearday"),
        icon:
          weatherIcons[
            getWeatherCondition(currentForecast.weather || "clearday")
          ] || weatherIcons.clear,
        humidity: currentForecast.rh2m || 65,
        windSpeed: convertWindSpeed(currentForecast.wind10m?.speed || 3),
        feelsLike: currentForecast.temp2m || 18, // 7Timer! doesn't provide feels-like
      };

      setWeather(weatherData);
    } catch (err) {
      console.error("Weather fetch error:", err);
      setError("Unable to fetch weather");

      // Fallback data for demo
      setWeather({
        location: "Berlin",
        temperature: 18,
        condition: "clear",
        icon: weatherIcons.clear,
        humidity: 65,
        windSpeed: 12,
        feelsLike: 17,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          styles.loadingContainer,
          { backgroundColor: cardBackgroundColor, borderColor },
          style,
        ]}
      >
        <ActivityIndicator size="small" color="#3B82F6" />
        <ThemedText style={[styles.detailText, { marginLeft: Spacing.sm }]}>
          Loading weather...
        </ThemedText>
      </View>
    );
  }

  if (error && !weather) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: cardBackgroundColor, borderColor },
          style,
        ]}
      >
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </View>
    );
  }

  if (!weather) return null;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: cardBackgroundColor, borderColor },
        style,
      ]}
    >
      <View style={styles.weatherInfo}>
        <View style={styles.iconContainer}>
          <IconSymbol name={weather.icon as any} size={24} color="#3B82F6" />
        </View>
        <View style={styles.temperatureContainer}>
          <ThemedText style={styles.temperature}>
            {weather.temperature}°C
          </ThemedText>
          <ThemedText style={styles.condition}>
            {weather.condition.charAt(0).toUpperCase() +
              weather.condition.slice(1)}
          </ThemedText>
          <ThemedText style={styles.location}>{weather.location}</ThemedText>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <IconSymbol
            name="thermometer"
            size={12}
            color="rgba(255,255,255,0.6)"
          />
          <ThemedText style={styles.detailText}>
            Feels {weather.feelsLike}°C
          </ThemedText>
        </View>
        <View style={styles.detailItem}>
          <IconSymbol name="drop" size={12} color="rgba(255,255,255,0.6)" />
          <ThemedText style={styles.detailText}>{weather.humidity}%</ThemedText>
        </View>
        <View style={styles.detailItem}>
          <IconSymbol name="wind" size={12} color="rgba(255,255,255,0.6)" />
          <ThemedText style={styles.detailText}>
            {weather.windSpeed} km/h
          </ThemedText>
        </View>
      </View>
    </View>
  );
}
