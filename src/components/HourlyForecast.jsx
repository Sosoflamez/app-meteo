import { useEffect } from "react";
import { gsap } from "gsap";
import { getWeatherIcon, CSS } from "../utils/weatherHelpers";
import PropTypes from "prop-types";

export default function HourlyForecast({ hourly, hourlyRefs }) {
  useEffect(() => {
    hourlyRefs.current.forEach((el, i) => {
      if (el) gsap.fromTo(el, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", delay: 0.4 + i * 0.06 });
    });
  }, [hourly]);

  return (
    <div style={CSS.panel()}>
      <p style={CSS.label}>⏰ Aujourd hui — heure par heure</p>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${hourly.length},1fr)`, gap: "0.5rem", marginTop: "1rem" }}>
        {hourly.map((h, i) => (
          <div key={h.time} ref={el => hourlyRefs.current[i] = el} style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "0.75rem", padding: "0.75rem 0.5rem", textAlign: "center",
          }}>
            <p style={CSS.text("0.72rem", 500, "rgba(255,255,255,0.45)")}>
              {new Date(h.time).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </p>
            <div style={{ fontSize: "1.5rem", margin: "0.4rem 0" }}>{getWeatherIcon(h.condition.code)}</div>
            <p style={CSS.text("0.95rem", 700, "white")}>{Math.round(h.temp_c)}°</p>
            <p style={CSS.text("0.65rem", 400, "rgba(255,255,255,0.4)")}>{h.chance_of_rain}% 💧</p>
          </div>
        ))}
      </div>
    </div>
  );
}

HourlyForecast.propTypes = {
  hourly: PropTypes.array.isRequired,
  hourlyRefs: PropTypes.object.isRequired,
};
