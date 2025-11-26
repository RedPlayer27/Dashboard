import React, { useState } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_KEY;

export default function WeatherWidget() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchWeatherByCity(e) {
    e.preventDefault();
    if (!city.trim()) return;

    if (!API_KEY) {
      setError("Missing OpenWeatherMap API key.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        {
          params: {
            q: city.trim(),
            units: "metric",
            appid: API_KEY,
          },
        }
      );
      setWeather(response.data);
    } catch (err) {
      setWeather(null);
      setError("Could not fetch weather for that city.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchWeatherByCoords(lat, lon) {
    if (!API_KEY) {
      setError("Missing OpenWeatherMap API key.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        {
          params: {
            lat,
            lon,
            units: "metric",
            appid: API_KEY,
          },
        }
      );
      setWeather(response.data);
      setCity(response.data.name || "");
    } catch (err) {
      setWeather(null);
      setError("Could not fetch weather for your location.");
    } finally {
      setLoading(false);
    }
  }

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }

    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      () => {
        setError("Permission denied or unable to get location.");
      }
    );
  }

  const temperature = weather?.main?.temp;
  const feelsLike = weather?.main?.feels_like;
  const condition = weather?.weather?.[0]?.description;
  const iconCode = weather?.weather?.[0]?.icon;
  const iconUrl = iconCode
    ? `https://openweathermap.org/img/wn/${iconCode}@2x.png`
    : null;
  const locationName = weather?.name;

  return (
     <div className="widget-card h-100">
    <h5 className="widget-title">Weather</h5>

      <form onSubmit={fetchWeatherByCity} className="mb-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </div>
      </form>

      <button
        type="button"
        className="btn btn-outline-secondary btn-sm mb-3"
        onClick={handleUseMyLocation}
      >
        Use my location
      </button>

      {loading && (
        <div className="text-center my-3">
          <div className="spinner-border spinner-border-sm" role="status" />
          <span className="ms-2">Loading weather...</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger py-2" role="alert">
          {error}
        </div>
      )}

      {!loading && !weather && !error && (
        <p className="text-muted mb-0">
          Search for a city or use your location to see the weather.
        </p>
      )}

      {!loading && weather && (
        <div className="d-flex align-items-center mt-2">
          {iconUrl && (
            <img
              src={iconUrl}
              alt={condition || "Weather icon"}
              style={{ width: 60, height: 60 }}
            />
          )}
          <div className="ms-3">
            <h6 className="mb-1">
              {locationName || "Unknown location"}
            </h6>
            <div className="fs-4 fw-bold">
              {Math.round(temperature)}°C
            </div>
            <div className="text-muted" style={{ textTransform: "capitalize" }}>
              {condition}
            </div>
            {typeof feelsLike === "number" && (
              <div className="small text-muted">
                Feels like {Math.round(feelsLike)}°C
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
