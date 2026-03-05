
export const DEFAULT_CITY = "Cotonou";
export const API_DAYS = 5;
export const API_LANG = "fr";
export const HOURLY_STEP = 3;

export const ANIM = {
    page: { duration: 0.9, y: 40 },
    title: { duration: 0.5, x: -20 },
    stats: { duration: 0.4, y: 16, baseDelay: 0.2, step: 0.08 },
    forecast: { duration: 0.35, x: 20, baseDelay: 0.3, step: 0.07 },
    hourly: { duration: 0.3, y: 12, baseDelay: 0.4, step: 0.06 },
    error: { shake: { x: 8, duration: 0.07, repeat: 7 } },
};

export const WEATHER_ICON_MAP = [
    { codes: [1000], icon: "☀️" },
    { codes: [1003], icon: "⛅" },
    { codes: [1006, 1009], icon: "☁️" },
    { codes: [1030, 1135, 1147], icon: "🌫️" },
    { codes: [1063, 1150, 1153, 1180, 1183, 1240], icon: "🌦️" },
    { codes: [1186, 1189, 1192, 1195, 1243, 1246], icon: "🌧️" },
    { codes: [1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258], icon: "❄️" },
    { codes: [1087, 1273, 1276, 1279, 1282], icon: "⛈️" },
    { codes: [1069, 1072, 1168, 1171, 1198, 1201, 1204, 1207, 1237, 1249, 1252], icon: "🌨️" },
];

export const WEATHER_ICON_FALLBACK = "🌡️";

export const THEMES = [
    {
        match: (c, isDay) => (c.includes("sunny") || c.includes("clear")) && isDay,
        theme: { bg: ["#0f172a", "#1e293b", "#0f172a"], accent: "#f59e0b", particle: "🌟", label: "Ensoleillé" },
    },
    {
        match: (c, isDay) => c.includes("clear") && !isDay,
        theme: { bg: ["#020617", "#0f172a", "#1e1b4b"], accent: "#818cf8", particle: "⭐", label: "Nuit claire" },
    },
    {
        match: (c) => c.includes("rain") || c.includes("shower") || c.includes("drizzle"),
        theme: { bg: ["#0c1445", "#1e3a5f", "#0f172a"], accent: "#38bdf8", particle: "💧", label: "Pluie" },
    },
    {
        match: (c) => c.includes("snow") || c.includes("blizzard"),
        theme: { bg: ["#0f172a", "#1e293b", "#172554"], accent: "#bae6fd", particle: "❄️", label: "Neige" },
    },
    {
        match: (c) => c.includes("thunder") || c.includes("storm"),
        theme: { bg: ["#09090b", "#18181b", "#0f172a"], accent: "#facc15", particle: "⚡", label: "Orage" },
    },
    {
        match: (c) => c.includes("cloud") || c.includes("overcast"),
        theme: { bg: ["#0f172a", "#1e293b", "#334155"], accent: "#94a3b8", particle: "☁️", label: "Nuageux" },
    },
];

export const THEME_DEFAULT = { bg: ["#0f172a", "#1e3a5f", "#0f172a"], accent: "#38bdf8", particle: "✨", label: "" };


export const getHeroStats = (current) => [
    { icon: "💧", label: "Humidité", value: `${current.humidity}%`, bar: current.humidity, max: 100 },
    { icon: "💨", label: "Vent", value: `${current.wind_kph} km/h`, bar: current.wind_kph, max: 120 },
    { icon: "🌡️", label: "Pression", value: `${current.pressure_mb} hPa`, bar: current.pressure_mb - 950, max: 100 },
    { icon: "👁️", label: "Visibilité", value: `${current.vis_km} km`, bar: current.vis_km, max: 20 },
];

export const getExtraInfo = (current, forecastday) => [
    { label: "☀️ Lever du soleil", value: forecastday.astro.sunrise },
    { label: "🌙 Coucher du soleil", value: forecastday.astro.sunset },
    { label: "🌧️ Risque de pluie", value: `${forecastday.day.daily_chance_of_rain}%` },
    { label: "💧 Précipitations", value: `${forecastday.day.totalprecip_mm} mm` },
    { label: "🌬️ Rafales max", value: `${current.gust_kph} km/h` },
    { label: "☁️ Couverture nuag.", value: `${current.cloud}%` },
];

export const getMiniCards = (current, localtime) => [
    { icon: "🔆", label: "Index UV", value: current.uv },
    {
        icon: "🕐", label: "Heure locale",
        value: new Date(localtime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    },
];