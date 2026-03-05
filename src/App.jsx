import { useWeather } from "./utils/useWeather.js";
import { getWeatherIcon } from "./services/weatherService.js";
import {
  ParticleCanvas,
  WeatherIconAnim,
  AnimatedTemp,
  StatBar,
} from "./components/WeatherComponents";
import { getHeroStats, getExtraInfo, getMiniCards } from "./utils/constants.js";
import "./App.css";

export default function App() {
  const {
    city,
    setCity,
    weather,
    forecast,
    hourly,
    error,
    loading,
    theme,
    handleSearch,
    mainRef,
    titleRef,
    errorRef,
    forecastRefs,
    hourlyRefs,
    statsRefs,
  } = useWeather();

  const { bg, accent, particle } = theme;
  const icon = weather ? getWeatherIcon(weather.current.condition.code) : "🌡️";

  return (
    <div
      className="page"
      style={{
        background: `linear-gradient(160deg, ${bg[0]} 0%, ${bg[1]} 50%, ${bg[2]} 100%)`,
      }}
    >
      <ParticleCanvas particle={particle} />
      <div className="glow-top" style={{ background: `${accent}18` }} />
      <div className="glow-bottom" style={{ background: `${accent}10` }} />

      <div ref={mainRef} className="main-wrapper">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Rechercher une ville..."
              className="search-input"
            />
          </div>
          <button
            type="submit"
            className="search-button"
            style={{ background: accent }}
          >
            Rechercher
          </button>
        </form>

        {error && (
          <div ref={errorRef} className="error-box">
            ⚠️ {error}
          </div>
        )}

        {loading && (
          <div className="loading-wrapper">
            <div className="spinner" style={{ borderTopColor: accent }} />
            <span className="loading-text">Chargement...</span>
          </div>
        )}

        {weather && !loading && (
          <div className="weather-grid">
            <div className="left-col">
              <div className="panel">
                <div className="hero-header">
                  <div ref={titleRef}>
                    <h1 className="city-name">{weather.location.name}</h1>
                    <p className="city-sub">
                      {weather.location.country} •{" "}
                      {new Date(weather.location.localtime).toLocaleDateString(
                        "fr-FR",
                        {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </p>
                    <div className="temp-wrapper">
                      <AnimatedTemp
                        value={Math.round(weather.current.temp_c)}
                        accent={accent}
                      />
                      <p className="condition-text">
                        {weather.current.condition.text}
                      </p>
                      <p className="feels-like">
                        Ressenti {Math.round(weather.current.feelslike_c)}° •
                        Min{" "}
                        {Math.round(
                          weather.forecast.forecastday[0].day.mintemp_c,
                        )}
                        ° / Max{" "}
                        {Math.round(
                          weather.forecast.forecastday[0].day.maxtemp_c,
                        )}
                        °
                      </p>
                    </div>
                  </div>
                  <WeatherIconAnim icon={icon} />
                </div>

                <div className="divider" />

                <div className="stats-grid">
                  {getHeroStats(weather.current).map((s, i) => (
                    <div
                      key={s.label}
                      ref={(el) => (statsRefs.current[i] = el)}
                    >
                      <p className="stat-label">
                        {s.icon} {s.label}
                      </p>
                      <p className="stat-value">{s.value}</p>
                      <StatBar value={s.bar} max={s.max} accent={accent} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel">
                <p className="stat-label">
                  ⏰ Aujourd&apos;hui — heure par heure
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${hourly.length}, 1fr)`,
                    gap: "0.5rem",
                    marginTop: "1rem",
                  }}
                >
                  {hourly.map((h, i) => (
                    <div
                      key={h.time}
                      ref={(el) => (hourlyRefs.current[i] = el)}
                      className="hourly-card"
                    >
                      <p className="hourly-time">
                        {new Date(h.time).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <div className="hourly-icon">
                        {getWeatherIcon(h.condition.code)}
                      </div>
                      <p className="hourly-temp">{Math.round(h.temp_c)}°</p>
                      <p className="hourly-rain">{h.chance_of_rain}% 💧</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel panel-info-grid">
                {getExtraInfo(
                  weather.current,
                  weather.forecast.forecastday[0],
                ).map((info, i) => (
                  <div
                    key={info.label}
                    ref={(el) => (statsRefs.current[4 + i] = el)}
                  >
                    <p className="stat-label">{info.label}</p>
                    <p className="stat-value" style={{ fontSize: "1.1rem" }}>
                      {info.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel panel-right">
              <p className="stat-label forecast-section-label">
                📅 Prévisions 5 jours
              </p>

              {forecast.map((day, i) => {
                const isToday = i === 0;
                return (
                  <div
                    key={day.date}
                    ref={(el) => (forecastRefs.current[i] = el)}
                    className="forecast-card"
                    style={{
                      background: isToday
                        ? `${accent}18`
                        : "rgba(255,255,255,0.04)",
                      border: `1px solid ${isToday ? accent + "40" : "rgba(255,255,255,0.07)"}`,
                    }}
                  >
                    <div className="forecast-day">
                      <p
                        className="forecast-day-name"
                        style={{
                          fontWeight: isToday ? 700 : 500,
                          color: isToday ? "white" : "rgba(255,255,255,0.75)",
                        }}
                      >
                        {isToday
                          ? "Aujourd'hui"
                          : new Date(day.date).toLocaleDateString("fr-FR", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            })}
                      </p>
                      <p className="forecast-condition">
                        {day.day.condition.text}
                      </p>
                    </div>
                    <span className="forecast-icon">
                      {getWeatherIcon(day.day.condition.code)}
                    </span>
                    <div className="forecast-temps">
                      <p className="forecast-max">
                        {Math.round(day.day.maxtemp_c)}°
                      </p>
                      <p className="forecast-min">
                        {Math.round(day.day.mintemp_c)}°
                      </p>
                    </div>
                  </div>
                );
              })}

              <div className="divider" />

              <div className="mini-cards-grid">
                {getMiniCards(weather.current, weather.location.localtime).map(
                  (info) => (
                    <div key={info.label} className="mini-card">
                      <p className="stat-label">
                        {info.icon} {info.label}
                      </p>
                      <p className="mini-card-value">{info.value}</p>
                    </div>
                  ),
                )}
              </div>

              <div style={{ flex: 1 }} />
              <p className="data-source">Données : weatherapi.com</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
