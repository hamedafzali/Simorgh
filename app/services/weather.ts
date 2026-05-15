type WeatherSnapshot = {
  temperatureC: number;
  weatherCode: number;
  windSpeedKmh: number;
};

function withTimeout(url: string, timeoutMs = 8000) {
  return new Promise<Response>((resolve, reject) => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort();
      reject(new Error("Weather request timed out"));
    }, timeoutMs);

    fetch(url, { signal: controller.signal })
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timer));
  });
}

export async function getCurrentWeather(
  lat: number,
  lon: number
): Promise<WeatherSnapshot> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("current_weather", "true");
  url.searchParams.set("forecast_days", "1");

  const response = await withTimeout(url.toString());
  if (!response.ok) {
    throw new Error("Weather request failed");
  }

  const payload = (await response.json()) as {
    current_weather?: {
      temperature?: number;
      weathercode?: number;
      windspeed?: number;
    };
  };

  if (
    payload.current_weather?.temperature === undefined ||
    payload.current_weather?.weathercode === undefined ||
    payload.current_weather?.windspeed === undefined
  ) {
    throw new Error("Weather data missing");
  }

  return {
    temperatureC: Math.round(payload.current_weather.temperature),
    weatherCode: payload.current_weather.weathercode,
    windSpeedKmh: Math.round(payload.current_weather.windspeed),
  };
}

export function describeWeatherCode(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 3) return "Cloudy";
  if (code <= 48) return "Fog";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 86) return "Snow showers";
  if (code <= 99) return "Thunder";
  return "Weather";
}
