import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { fetchWeather, getTheme } from "../services/weatherService.js";
import { DEFAULT_CITY, HOURLY_STEP, ANIM } from "./constants.js";

export function useWeather() {
  const [city, setCity] = useState("");
  const [query, setQuery] = useState(DEFAULT_CITY);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(getTheme("clear", 1));


  const mainRef = useRef(null);
  const titleRef = useRef(null);
  const errorRef = useRef(null);
  const forecastRefs = useRef([]);
  const hourlyRefs = useRef([]);
  const statsRefs = useRef([]);

  useEffect(() => {
    if (!mainRef.current) return;
    gsap.fromTo(
      mainRef.current,
      { opacity: 0, y: ANIM.page.y },
      { opacity: 1, y: 0, duration: ANIM.page.duration, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError("");

    fetchWeather(query)
      .then((data) => {
        setWeather(data);
        setForecast(data.forecast.forecastday);
        setHourly(data.forecast.forecastday[0].hour.filter((_, i) => i % HOURLY_STEP === 0));
        setTheme(getTheme(data.current.condition.text, data.current.is_day));
        _animateOnLoad();
      })
      .catch(() => {
        setError("Ville introuvable. Vérifie le nom et réessaie.");
        setWeather(null);
        _animateError();
      })
      .finally(() => setLoading(false));
  }, [query]);

  function _animateOnLoad() {
    setTimeout(() => {
      if (titleRef.current)
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, x: -ANIM.title.x * -1 },
          { opacity: 1, x: 0, duration: ANIM.title.duration, ease: "power2.out" }
        );

      statsRefs.current.forEach((el, i) => {
        if (el) gsap.fromTo(el,
          { opacity: 0, y: ANIM.stats.y },
          { opacity: 1, y: 0, duration: ANIM.stats.duration, ease: "power2.out", delay: ANIM.stats.baseDelay + i * ANIM.stats.step }
        );
      });

      forecastRefs.current.forEach((el, i) => {
        if (el) gsap.fromTo(el,
          { opacity: 0, x: ANIM.forecast.x },
          { opacity: 1, x: 0, duration: ANIM.forecast.duration, ease: "power2.out", delay: ANIM.forecast.baseDelay + i * ANIM.forecast.step }
        );
      });

      hourlyRefs.current.forEach((el, i) => {
        if (el) gsap.fromTo(el,
          { opacity: 0, y: ANIM.hourly.y },
          { opacity: 1, y: 0, duration: ANIM.hourly.duration, ease: "power2.out", delay: ANIM.hourly.baseDelay + i * ANIM.hourly.step }
        );
      });
    }, 60);
  }

  function _animateError() {
    if (!errorRef.current) return;
    gsap.fromTo(errorRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    gsap.to(errorRef.current, {
      x: ANIM.error.shake.x,
      duration: ANIM.error.shake.duration,
      repeat: ANIM.error.shake.repeat,
      yoyo: true,
      ease: "none",
    });
  }

  function handleSearch(e) {
    e.preventDefault();
    if (city.trim()) { setQuery(city.trim()); setCity(""); }
  }

  return {

    city, setCity,
    weather, forecast, hourly,
    error, loading, theme,

    handleSearch,

    mainRef, titleRef, errorRef, forecastRefs, hourlyRefs, statsRefs,
  };
}