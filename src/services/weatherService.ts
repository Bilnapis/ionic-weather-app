import axios from "axios";

export interface HourlyWeather {
  time: string;
  temperature: number;
}

export interface DailyWeather {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  precipitationChance?: number;
  windSpeed?: number;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  apparentTemperature?: number;
  weatherCode?: number;
  windSpeed?: number;
  humidity?: number;
  precipitationChance?: number;
}

const API_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * Fetch hourly temperature data for Jakarta (-6.2, 106.8).
 */
export async function fetchHourlyWeather(): Promise<HourlyWeather[]> {
  const { data } = await axios.get(API_URL, {
    params: {
      latitude: -6.2,
      longitude: 106.8,
      hourly: "temperature_2m",
    },
  });

  const times: string[] = data?.hourly?.time ?? [];
  const temps: number[] = data?.hourly?.temperature_2m ?? [];

  return times
    .map((time, index) => ({
      time,
      temperature: temps[index],
    }))
    .filter(
      (entry) =>
        typeof entry.temperature === "number" &&
        !Number.isNaN(entry.temperature)
    );
}

/**
 * Fetch current conditions for Jakarta (-6.2, 106.8).
 */
export async function fetchCurrentWeather(): Promise<CurrentWeather> {
  const { data } = await axios.get(API_URL, {
    params: {
      latitude: -6.2,
      longitude: 106.8,
      current: ["temperature_2m"],
    },
  });

  const current = data?.current ?? {};
  const times: string[] = data?.hourly?.time ?? [];
  const precipitation: number[] = data?.hourly?.precipitation_probability ?? [];
  const currentIndex = current?.time
    ? times.findIndex((time) => time === current.time)
    : -1;

  return {
    time: current?.time,
    temperature: current?.temperature_2m,
    apparentTemperature: current?.apparent_temperature,
    weatherCode: current?.weathercode,
    windSpeed: current?.windspeed_10m,
    humidity: current?.relativehumidity_2m,
    precipitationChance:
      currentIndex >= 0 ? precipitation[currentIndex] : precipitation[0],
  };
}

export interface WeatherDescriptor {
  label: string;
  icon: "rainy" | "cloudy" | "partly-sunny" | "sunny" | "thunderstorm";
}

/**
 * Map Open-Meteo weather codes to a simple label and icon name.
 */
export function describeWeather(code: number | undefined): WeatherDescriptor {
  if (code === undefined || code === null) {
    return { label: "Unknown", icon: "cloudy" };
  }

  if ([0].includes(code)) return { label: "Sunny", icon: "sunny" };
  if ([1, 2].includes(code))
    return { label: "Partly Cloudy", icon: "partly-sunny" };
  if ([3].includes(code)) return { label: "Cloudy", icon: "cloudy" };
  if ([45, 48].includes(code)) return { label: "Foggy", icon: "cloudy" };
  if ([51, 53, 55, 56, 57, 61, 63, 65, 80, 81, 82].includes(code))
    return { label: "Rainy", icon: "rainy" };
  if ([66, 67, 71, 73, 75, 77, 85, 86].includes(code))
    return { label: "Snowy", icon: "rainy" };
  if ([95, 96, 99].includes(code))
    return { label: "Thunder", icon: "thunderstorm" };

  return { label: "Cloudy", icon: "cloudy" };
}
