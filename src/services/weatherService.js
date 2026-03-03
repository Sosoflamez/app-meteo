import axios from "axios";

const API_KEY = "be1f2a23648f45da97a84334251110";
const BASE_URL = "https://api.weatherapi.com/v1/forecast.json";

export async function fetchWeather(city) {
  const { data } = await axios.get(BASE_URL, {
    params: { key: API_KEY, q: city, days: 5, aqi: "no", alerts: "no", lang: "fr" },
  });
  return data;
}