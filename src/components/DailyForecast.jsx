import { useEffect } from "react";
import { gsap } from "gsap";
import { getWeatherIcon, CSS } from "../utils/weatherHelpers";
import PropTypes from "prop-types";

export default function DailyForecast({ forecast, weather, accent, forecastRefs }) {
  useEffect(() => {
    forecastRefs.current.forEach((el, i) => {
      if (el) gsap.fromTo(el, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.35, ease: "power2.out", delay: 0.3 + i * 0.07 });
    });
  }, [forecast]);

  return (
    <div style={CSS.panel({ display: "flex", flexDirection: "column", gap: "0.5rem" })}>
      <p style={{ ...CSS.label, marginBottom: "0.75rem" }}>📅 Prévisions 5 jours</p>

      {forecast.map((day, i) => {
        const isToday = i === 0;
        return (
          <div key={day.date} ref={el => forecastRefs.current[i] = el} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: isToday ? `${accent}18` : "rgba(255,255,255,0.04)",
            border: `1px solid ${isToday ? accent + "40" : "rgba(255,255,255,0.07)"}`,
            borderRadius: "0.875rem", padding: "0.85rem 1rem",
          }}>
            <div style={{ minWidth: 80 }}>
              <p style={CSS.text("0.88rem", isToday ? 700 : 500, isToday ? "white" : "rgba(255,255,255,0.75)")}>
                {isToday ? "Aujourd'hui" : new Date(day.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
              </p>
              <p style={CSS.text("0.72rem", 400, "rgba(255,255,255,0.4)")}>{day.day.condition.text}</p>
            </div>
            <span style={{ fontSize: "1.6rem" }}>{getWeatherIcon(day.day.condition.code)}</span>
            <div style={{ textAlign: "right" }}>
              <p style={CSS.text("1rem", 700, "white")}>{Math.round(day.day.maxtemp_c)}°</p>
              <p style={CSS.text("0.82rem", 400, "rgba(255,255,255,0.4)")}>{Math.round(day.day.mintemp_c)}°</p>
            </div>
          </div>
        );
      })}

      <div style={CSS.divider} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        {[
          { label: "Index UV", value: weather.current.uv, icon: "🔆" },
          { label: "Heure locale", value: new Date(weather.location.localtime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }), icon: "🕐" },
        ].map(info => (
          <div key={info.label} style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "0.75rem", padding: "0.75rem",
          }}>
            <p style={CSS.label}>{info.icon} {info.label}</p>
            <p style={CSS.text("1.2rem", 700, "white")}>{info.value}</p>
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }} />
      <p style={CSS.text("0.7rem", 400, "rgba(255,255,255,0.2)")}>Données : weatherapi.com</p>
    </div>
  );
}

DailyForecast.propTypes = {
  forecast: PropTypes.array.isRequired,
  weather: PropTypes.object.isRequired,
  accent: PropTypes.string.isRequired,
  forecastRefs: PropTypes.object.isRequired,
};