import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

function getWeatherIcon(code) {
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

function getTheme(condition = "", isDay = 1) {
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

function ParticleCanvas({ particle }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const pts = Array.from({ length: 30 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 14 + 6,
      sx: (Math.random() - 0.5) * 0.4,
      sy: Math.random() * 0.35 + 0.1,
      op: Math.random() * 0.35 + 0.1,
      w: Math.random() * Math.PI * 2,
      ws: Math.random() * 0.018 + 0.004,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p) => {
        p.w += p.ws;
        p.x += Math.sin(p.w) * 0.4 + p.sx;
        p.y -= p.sy;
        if (p.y < -30) { p.y = canvas.height + 30; p.x = Math.random() * canvas.width; }
        if (p.x < -30) p.x = canvas.width + 30;
        if (p.x > canvas.width + 30) p.x = -30;
        ctx.save();
        ctx.globalAlpha = p.op;
        ctx.font = `${p.size}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(particle, p.x, p.y);
        ctx.restore();
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, [particle]);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
}

function WeatherIconAnim({ icon }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.killTweensOf(ref.current);
    gsap.fromTo(ref.current, { scale: 0, rotate: -15, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" });
    gsap.to(ref.current, { y: -16, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.8 });
    gsap.to(ref.current, { rotate: 6, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.2 });
  }, [icon]);
  return <div ref={ref} style={{ fontSize: "7rem", display: "inline-block", filter: "drop-shadow(0 0 40px rgba(255,255,255,0.15))" }}>{icon}</div>;
}

function AnimatedTemp({ value, accent }) {
  const ref = useRef(null);
  const prev = useRef(0);
  useEffect(() => {
    const obj = { val: prev.current };
    gsap.to(obj, {
      val: value, duration: 1.4, ease: "power3.out",
      onUpdate: () => { if (ref.current) ref.current.textContent = Math.round(obj.val) + "°"; },
    });
    prev.current = value;
  }, [value]);
  return (
    <span ref={ref} style={{ fontSize: "6.5rem", fontWeight: 200, color: "white", lineHeight: 1, textShadow: `0 0 60px ${accent}55` }}>
      {value}°
    </span>
  );
}

function StatBar({ value, max, accent }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) gsap.fromTo(ref.current, { width: 0 }, { width: `${(value / max) * 100}%`, duration: 1, ease: "power2.out", delay: 0.5 });
  }, [value]);
  return (
    <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 999, height: 5, width: "100%", overflow: "hidden", marginTop: 6 }}>
      <div ref={ref} style={{ height: "100%", background: accent, borderRadius: 999, width: 0 }} />
    </div>
  );
}

export default function App() {
  const [city, setCity] = useState("");
  const [query, setQuery] = useState("Cotonou");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(getTheme("clear", 1));

  const mainRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const titleRef = useRef(null);
  const errorRef = useRef(null);
  const forecastRefs = useRef([]);
  const hourlyRefs = useRef([]);
  const statsRefs = useRef([]);

  useEffect(() => {
    gsap.fromTo(mainRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" });
  }, []);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError("");
    axios.get("https://api.weatherapi.com/v1/forecast.json", {
      params: { key: API_KEY, q: query, days: 5, aqi: "no", alerts: "no", lang: "fr" },
    }).then((res) => {
      setWeather(res.data);
      setForecast(res.data.forecast.forecastday);
      setHourly(res.data.forecast.forecastday[0].hour.filter((_, i) => i % 3 === 0));
      setTheme(getTheme(res.data.current.condition.text, res.data.current.is_day));

      setTimeout(() => {
        if (titleRef.current) gsap.fromTo(titleRef.current, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" });
        statsRefs.current.forEach((el, i) => {
          if (el) gsap.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", delay: 0.2 + i * 0.08 });
        });
        forecastRefs.current.forEach((el, i) => {
          if (el) gsap.fromTo(el, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.35, ease: "power2.out", delay: 0.3 + i * 0.07 });
        });
        hourlyRefs.current.forEach((el, i) => {
          if (el) gsap.fromTo(el, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", delay: 0.4 + i * 0.06 });
        });
      }, 60);
    }).catch(() => {
      setError("Ville introuvable. Vérifie le nom et réessaie.");
      setWeather(null);
      if (errorRef.current) {
        gsap.fromTo(errorRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        gsap.to(errorRef.current, { x: 8, duration: 0.07, repeat: 7, yoyo: true, ease: "none" });
      }
    }).finally(() => setLoading(false));
  }, [query]);

  function handleSearch(e) {
    e.preventDefault();
    if (city.trim()) { setQuery(city.trim()); setCity(""); }
  }

  const { bg, accent, particle } = theme;
  const icon = weather ? getWeatherIcon(weather.current.condition.code) : "🌡️";

  const css = {
    page: {
      minHeight: "100vh",
      background: `linear-gradient(160deg, ${bg[0]} 0%, ${bg[1]} 50%, ${bg[2]} 100%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      position: "relative",
      overflow: "hidden",
      padding: "2rem",
      transition: "background 1.5s ease",
    },
    shell: {
      position: "relative",
      zIndex: 10,
      width: "100%",
      maxWidth: 1100,
      display: "grid",
      gridTemplateColumns: "1fr 340px",
      gap: "1.5rem",
      minHeight: 580,
    },
    panel: (extra = {}) => ({
      background: "rgba(255,255,255,0.05)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "1.25rem",
      padding: "2rem",
      ...extra,
    }),
    label: { color: "rgba(255,255,255,0.45)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" },
    text: (size = "1rem", weight = 400, color = "rgba(255,255,255,0.85)") => ({ fontSize: size, fontWeight: weight, color }),
    divider: { height: 1, background: "rgba(255,255,255,0.08)", margin: "1.25rem 0" },
  };

  return (
    <div style={css.page}>
      <ParticleCanvas particle={particle} />

      {/* Lueurs d'ambiance */}
      <div style={{ position: "fixed", top: -200, left: -200, width: 600, height: 600, background: `${accent}18`, borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "fixed", bottom: -150, right: -150, width: 500, height: 500, background: `${accent}10`, borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none", zIndex: 1 }} />

      <div ref={mainRef} style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 1100 }}>

        {/* Barre de recherche en haut */}
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", fontSize: "1.1rem" }}>🔍</span>
            <input
              type="text" value={city} onChange={e => setCity(e.target.value)}
              placeholder="Rechercher une ville..."
              style={{
                width: "100%", background: "rgba(255,255,255,0.07)", color: "white",
                border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.875rem",
                padding: "0.85rem 1rem 0.85rem 2.8rem", outline: "none",
                fontSize: "0.95rem", boxSizing: "border-box",
                transition: "border 0.2s",
              }}
            />
          </div>
          <button type="submit" style={{
            background: accent, color: "#0f172a", border: "none",
            borderRadius: "0.875rem", padding: "0.85rem 1.75rem",
            cursor: "pointer", fontWeight: 700, fontSize: "0.9rem",
            transition: "opacity 0.2s",
          }}>Rechercher</button>
        </form>

        {/* Erreur */}
        {error && (
          <div ref={errorRef} style={{
            background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.35)",
            color: "#fca5a5", borderRadius: "0.875rem", padding: "0.85rem 1.25rem",
            marginBottom: "1rem", fontSize: "0.9rem",
          }}>⚠️ {error}</div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400, flexDirection: "column", gap: "1rem" }}>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <div style={{ width: 48, height: 48, border: `4px solid rgba(255,255,255,0.1)`, borderTop: `4px solid ${accent}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <span style={css.text("0.9rem", 400, "rgba(255,255,255,0.5)")}>Chargement...</span>
          </div>
        )}

        {weather && !loading && (
          <div style={css.shell}>

            {/* ── PANNEAU GAUCHE ── */}
            <div ref={leftRef} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

              {/* Hero météo */}
              <div style={css.panel()}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div ref={titleRef}>
                    <h1 style={{ color: "white", fontSize: "2.8rem", fontWeight: 700, margin: 0, lineHeight: 1.1 }}>
                      {weather.location.name}
                    </h1>
                    <p style={css.text("1rem", 400, "rgba(255,255,255,0.5)")}>
                      {weather.location.country} • {new Date(weather.location.localtime).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    </p>
                    <div style={{ marginTop: "1.5rem" }}>
                      <AnimatedTemp value={Math.round(weather.current.temp_c)} accent={accent} />
                      <p style={{ ...css.text("1.15rem", 500, "rgba(255,255,255,0.7)"), marginTop: "0.5rem", textTransform: "capitalize" }}>
                        {weather.current.condition.text}
                      </p>
                      <p style={css.text("0.9rem", 400, "rgba(255,255,255,0.45)")}>
                        Ressenti {Math.round(weather.current.feelslike_c)}° • Min {Math.round(weather.forecast.forecastday[0].day.mintemp_c)}° / Max {Math.round(weather.forecast.forecastday[0].day.maxtemp_c)}°
                      </p>
                    </div>
                  </div>
                  <WeatherIconAnim icon={icon} />
                </div>

                {/* Stats en ligne */}
                <div style={css.divider} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" }}>
                  {[
                    { icon: "💧", label: "Humidité", value: `${weather.current.humidity}%`, bar: weather.current.humidity, max: 100 },
                    { icon: "💨", label: "Vent", value: `${weather.current.wind_kph} km/h`, bar: weather.current.wind_kph, max: 120 },
                    { icon: "🌡️", label: "Pression", value: `${weather.current.pressure_mb} hPa`, bar: weather.current.pressure_mb - 950, max: 100 },
                    { icon: "👁️", label: "Visibilité", value: `${weather.current.vis_km} km`, bar: weather.current.vis_km, max: 20 },
                  ].map((s, i) => (
                    <div key={s.label} ref={el => statsRefs.current[i] = el}>
                      <p style={css.label}>{s.icon} {s.label}</p>
                      <p style={css.text("1.3rem", 600, "white")}>{s.value}</p>
                      <StatBar value={s.bar} max={s.max} accent={accent} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Prévisions horaires */}
              <div style={css.panel()}>
                <p style={css.label}>⏰ Aujourd'hui — heure par heure</p>
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${hourly.length},1fr)`, gap: "0.5rem", marginTop: "1rem" }}>
                  {hourly.map((h, i) => (
                    <div key={h.time} ref={el => hourlyRefs.current[i] = el} style={{
                      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "0.75rem", padding: "0.75rem 0.5rem", textAlign: "center",
                    }}>
                      <p style={css.text("0.72rem", 500, "rgba(255,255,255,0.45)")}>
                        {new Date(h.time).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                      <div style={{ fontSize: "1.5rem", margin: "0.4rem 0" }}>{getWeatherIcon(h.condition.code)}</div>
                      <p style={css.text("0.95rem", 700, "white")}>{Math.round(h.temp_c)}°</p>
                      <p style={css.text("0.65rem", 400, "rgba(255,255,255,0.4)")}>{h.chance_of_rain}% 💧</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Infos sup */}
              <div style={css.panel({ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem" })}>
                {[
                  { label: "☀️ Lever du soleil", value: weather.forecast.forecastday[0].astro.sunrise },
                  { label: "🌙 Coucher du soleil", value: weather.forecast.forecastday[0].astro.sunset },
                  { label: "🌧️ Risque de pluie", value: `${weather.forecast.forecastday[0].day.daily_chance_of_rain}%` },
                  { label: "💧 Précipitations", value: `${weather.forecast.forecastday[0].day.totalprecip_mm} mm` },
                  { label: "🌬️ Rafales max", value: `${weather.current.gust_kph} km/h` },
                  { label: "☁️ Couverture nuag.", value: `${weather.current.cloud}%` },
                ].map((info, i) => (
                  <div key={info.label} ref={el => statsRefs.current[4 + i] = el}>
                    <p style={css.label}>{info.label}</p>
                    <p style={css.text("1.1rem", 600, "white")}>{info.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── PANNEAU DROIT — prévisions 5 jours ── */}
            <div ref={rightRef} style={css.panel({ display: "flex", flexDirection: "column", gap: "0.5rem" })}>
              <p style={{ ...css.label, marginBottom: "0.75rem" }}>📅 Prévisions 5 jours</p>
              {forecast.map((day, i) => {
                const isToday = i === 0;
                return (
                  <div key={day.date} ref={el => forecastRefs.current[i] = el} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: isToday ? `${accent}18` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${isToday ? accent + "40" : "rgba(255,255,255,0.07)"}`,
                    borderRadius: "0.875rem", padding: "0.85rem 1rem",
                    transition: "background 0.2s",
                  }}>
                    <div style={{ minWidth: "80px" }}>
                      <p style={css.text("0.88rem", isToday ? 700 : 500, isToday ? "white" : "rgba(255,255,255,0.75)")}>
                        {isToday ? "Aujourd'hui" : new Date(day.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
                      </p>
                      <p style={css.text("0.72rem", 400, "rgba(255,255,255,0.4)")}>{day.day.condition.text}</p>
                    </div>
                    <span style={{ fontSize: "1.6rem" }}>{getWeatherIcon(day.day.condition.code)}</span>
                    <div style={{ textAlign: "right" }}>
                      <p style={css.text("1rem", 700, "white")}>{Math.round(day.day.maxtemp_c)}°</p>
                      <p style={css.text("0.82rem", 400, "rgba(255,255,255,0.4)")}>{Math.round(day.day.mintemp_c)}°</p>
                    </div>
                  </div>
                );
              })}

              <div style={css.divider} />

              {/* Qualité de l'air / UV */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "0.25rem" }}>
                {[
                  { label: "Index UV", value: weather.current.uv, icon: "🔆" },
                  { label: "Heure locale", value: new Date(weather.location.localtime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }), icon: "🕐" },
                ].map(info => (
                  <div key={info.label} style={{
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "0.75rem", padding: "0.75rem",
                  }}>
                    <p style={css.label}>{info.icon} {info.label}</p>
                    <p style={css.text("1.2rem", 700, "white")}>{info.value}</p>
                  </div>
                ))}
              </div>

              <div style={{ flex: 1 }} />
              <p style={css.text("0.7rem", 400, "rgba(255,255,255,0.2)")}>Données : weatherapi.com</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}