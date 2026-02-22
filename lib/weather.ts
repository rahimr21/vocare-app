import * as Location from "expo-location";

const WMO_CODES: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Freezing fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Light rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Light snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Light rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Light snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with light hail",
  99: "Thunderstorm with heavy hail",
};

function celsiusToFahrenheit(c: number): number {
  return Math.round(c * 9 / 5 + 32);
}

export async function getWeather(): Promise<string> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return "Unknown weather (location permission denied)";
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Low,
    });

    const { latitude, longitude } = location.coords;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather API: ${res.status}`);

    const data = await res.json();
    const cw = data.current_weather;
    const code = cw?.weathercode ?? 0;
    const tempC = cw?.temperature ?? 0;
    const description = WMO_CODES[code] || "Unknown conditions";
    const tempF = celsiusToFahrenheit(tempC);

    return `${description}, ${tempF}°F (${Math.round(tempC)}°C)`;
  } catch (e) {
    console.warn("Weather fetch failed:", e);
    return "Unknown weather";
  }
}
