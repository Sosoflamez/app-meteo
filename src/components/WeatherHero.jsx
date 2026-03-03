import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { CSS } from "../utils/weatherHelpers";
import AnimatedTemp from "./ui/AnimatedTemp";
import WeatherIconAnim from "./ui/WeatherIconAnim";
import StatBar from "./ui/StatBar";
import PropTypes from "prop-types";

export default function WeatherHero({ weather, icon, accent, statsRefs }) {
  const titleRef = useRef(null);

  useEffect(() => {
    if (titleRef.current)
      gsap.fromTo(titleRef.current, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" });
  }, [weather.location.name]);

  const stats = [
    { icon: "💧", label: "Humidité",   value: `${weather.current.humidity}%`,        bar: weather.current.humidity,             max: 100 },
    { icon: "💨", label: "Vent",       value: `${weather.current.wind_kph} km/h`,    bar: weather.current.wind_kph,             max: 120 },
    { icon: "🌡️", label: "Pression",  value: `${weather.current.pressure_mb} hPa`,  bar: weather.current.pressure_mb - 950,    max: 100 },
    { icon: "👁️", label: "Visibilité", value: `${weather.current.vis_km} km`,        bar: weather.current.vis_km,               max: 20  },
  ];

  return (
    <div style={CSS.panel()}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div ref={titleRef}>
          <h1 style={{ color: "white", fontSize: "2.8rem", fontWeight: 700, margin: 0, lineHeight: 1.1 }}>
            {weather.location.name}
          </h1>
          <p style={CSS.text("1rem", 400, "rgba(255,255,255,0.5)")}>
            {weather.location.country} • {new Date(weather.location.localtime).toLocaleDateString("fr-FR", {
              weekday: "long", day: "numeric", month: "long", year: "numeric",
            })}
          </p>
          <div style={{ marginTop: "1.5rem" }}>
            <AnimatedTemp value={Math.round(weather.current.temp_c)} accent={accent} />
            <p style={{ ...CSS.text("1.15rem", 500, "rgba(255,255,255,0.7)"), marginTop: "0.5rem", textTransform: "capitalize" }}>
              {weather.current.condition.text}
            </p>
            <p style={CSS.text("0.9rem", 400, "rgba(255,255,255,0.45)")}>
              Ressenti {Math.round(weather.current.feelslike_c)}° •
              Min {Math.round(weather.forecast.forecastday[0].day.mintemp_c)}° /
              Max {Math.round(weather.forecast.forecastday[0].day.maxtemp_c)}°
            </p>
          </div>
        </div>
        <WeatherIconAnim icon={icon} />
      </div>

      <div style={CSS.divider} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" }}>
        {stats.map((s, i) => (
          <div key={s.label} ref={el => statsRefs.current[i] = el}>
            <p style={CSS.label}>{s.icon} {s.label}</p>
            <p style={CSS.text("1.3rem", 600, "white")}>{s.value}</p>
            <StatBar value={s.bar} max={s.max} accent={accent} />
          </div>
        ))}
      </div>
    </div>
  );
}

WeatherHero.propTypes = {
  weather: PropTypes.object.isRequired,
  icon: PropTypes.string.isRequired,
  accent: PropTypes.string.isRequired,
  statsRefs: PropTypes.object.isRequired,
};