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
    return { bg: ["#0f172a", "#1e293b", "#0f172a"], accent: "#f59e0b", particle: "🌟" };
  if (c.includes("clear") && !isDay)
    return { bg: ["#020617", "#0f172a", "#1e1b4b"], accent: "#818cf8", particle: "⭐" };
  if (c.includes("rain") || c.includes("shower") || c.includes("drizzle"))
    return { bg: ["#0c1445", "#1e3a5f", "#0f172a"], accent: "#38bdf8", particle: "💧" };
  if (c.includes("snow") || c.includes("blizzard"))
    return { bg: ["#0f172a", "#1e293b", "#172554"], accent: "#bae6fd", particle: "❄️" };
  if (c.includes("thunder") || c.includes("storm"))
    return { bg: ["#09090b", "#18181b", "#0f172a"], accent: "#facc15", particle: "⚡" };
  if (c.includes("cloud") || c.includes("overcast"))
    return { bg: ["#0f172a", "#1e293b", "#334155"], accent: "#94a3b8", particle: "☁️" };
  return { bg: ["#0f172a", "#1e3a5f", "#0f172a"], accent: "#38bdf8", particle: "✨" };
}

export const CSS = {
  panel: (extra = {}) => ({
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "1.25rem",
    padding: "2rem",
    ...extra,
  }),
  label: {
    color: "rgba(255,255,255,0.45)", fontSize: "0.7rem",
    fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
    margin: 0,
  },
  text: (size = "1rem", weight = 400, color = "rgba(255,255,255,0.85)") => ({
    fontSize: size, fontWeight: weight, color, margin: 0,
  }),
  divider: { height: 1, background: "rgba(255,255,255,0.08)", margin: "1.25rem 0" },
};