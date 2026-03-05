import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

export async function fetchWeather(query) {
  const res = await axios.get("https://api.weatherapi.com/v1/forecast.json", {
    params: {
      key: API_KEY,
      q: query,
      days: 5,
      aqi: "no",
      alerts: "no",
      lang: "fr",
    },
  });
  return res.data;
}

export function getWeatherIcon(code) {
  if (!code) return "🌡️";
  if ([1000].includes(code)) return "☀️";
  if ([1003].includes(code)) return "⛅";
  if ([1006, 1009].includes(code)) return "☁️";
  if ([1030, 1135, 1147].includes(code)) return "🌫️";
  if ([1063, 1150, 1153, 1180, 1183, 1240].includes(code)) return "🌦️";
  if ([1186, 1189, 1192, 1195, 1243, 1246].includes(code)) return "🌧️";
  if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code)) return "❄️";
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) return "⛈️";
  if ([1069, 1072, 1168, 1171, 1198, 1201, 1204, 1207, 1237, 1249, 1252].includes(code)) return "🌨️";
  return "🌡️";
}

export function getTheme(condition = "", isDay = 1) {
  const c = condition.toLowerCase();
  if (c.includes("sunny") || (c.includes("clear") && isDay))
    return { bg: ["#0f172a", "#1e293b", "#0f172a"], accent: "#f59e0b", particle: "🌟", label: "Ensoleillé" };
  if (c.includes("clear") && !isDay)
    return { bg: ["#020617", "#0f172a", "#1e1b4b"], accent: "#818cf8", particle: "⭐", label: "Nuit claire" };
  if (c.includes("rain") || c.includes("shower") || c.includes("drizzle"))
    return { bg: ["#0c1445", "#1e3a5f", "#0f172a"], accent: "#38bdf8", particle: "💧", label: "Pluie" };
  if (c.includes("snow") || c.includes("blizzard"))
    return { bg: ["#0f172a", "#1e293b", "#172554"], accent: "#bae6fd", particle: "❄️", label: "Neige" };
  if (c.includes("thunder") || c.includes("storm"))
    return { bg: ["#09090b", "#18181b", "#0f172a"], accent: "#facc15", particle: "⚡", label: "Orage" };
  if (c.includes("cloud") || c.includes("overcast"))
    return { bg: ["#0f172a", "#1e293b", "#334155"], accent: "#94a3b8", particle: "☁️", label: "Nuageux" };
  return { bg: ["#0f172a", "#1e3a5f", "#0f172a"], accent: "#38bdf8", particle: "✨", label: "" };
}
