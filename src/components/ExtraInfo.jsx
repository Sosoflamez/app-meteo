import { useEffect } from "react";
import { gsap } from "gsap";
import { CSS } from "../utils/weatherHelpers";
import PropTypes from "prop-types";

export default function ExtraInfo({ weather, statsRefs, offset = 4 }) {
  const today = weather.forecast.forecastday[0];

  const infos = [
    { label: "☀️ Lever du soleil",   value: today.astro.sunrise },
    { label: "🌙 Coucher du soleil", value: today.astro.sunset },
    { label: "🌧️ Risque de pluie",  value: `${today.day.daily_chance_of_rain}%` },
    { label: "💧 Précipitations",    value: `${today.day.totalprecip_mm} mm` },
    { label: "🌬️ Rafales max",      value: `${weather.current.gust_kph} km/h` },
    { label: "☁️ Couverture nuag.",  value: `${weather.current.cloud}%` },
  ];

  useEffect(() => {
    infos.forEach((_, i) => {
      const el = statsRefs.current[offset + i];
      if (el) gsap.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", delay: 0.3 + i * 0.07 });
    });
  }, [weather]);

  return (
    <div style={CSS.panel({ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem" })}>
      {infos.map((info, i) => (
        <div key={info.label} ref={el => statsRefs.current[offset + i] = el}>
          <p style={CSS.label}>{info.label}</p>
          <p style={CSS.text("1.1rem", 600, "white")}>{info.value}</p>
        </div>
      ))}
    </div>
  );
}

ExtraInfo.propTypes = {
  weather: PropTypes.object.isRequired,
  statsRefs: PropTypes.object.isRequired,
  offset: PropTypes.number.isRequired,
};