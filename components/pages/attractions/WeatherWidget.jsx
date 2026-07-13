"use client";
import { useEffect, useState } from "react";

export function WeatherWidget({ location }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For a real app, this would call OpenWeatherMap or WeatherAPI.
    // To avoid needing an API key for the demo, we simulate a realistic weather response based on Western Kenya's typical climate.
    const timer = setTimeout(() => {
      setWeather({
        temp: Math.floor(Math.random() * (28 - 22 + 1) + 22), // 22-28 C
        condition: ["Sunny", "Partly Cloudy", "Light Rain"][Math.floor(Math.random() * 3)],
        humidity: Math.floor(Math.random() * (80 - 60 + 1) + 60), // 60-80%
      });
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [location]);

  if (loading) {
    return (
      <div className="bg-[#E0F2FE] border border-[#7DD3FC] rounded-2xl p-5 animate-pulse">
        <div className="h-5 bg-[#BAE6FD] rounded w-1/2 mb-3"></div>
        <div className="h-10 bg-[#BAE6FD] rounded w-1/3"></div>
      </div>
    );
  }

  const getIcon = (condition) => {
    switch(condition) {
      case "Sunny": return "☀️";
      case "Partly Cloudy": return "⛅";
      case "Light Rain": return "🌦️";
      default: return "🌤️";
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#E0F2FE] to-[#BAE6FD] border border-[#7DD3FC] rounded-2xl p-5 shadow-sm">
      <h3 className="font-display text-lg font-bold text-[#0369A1] mb-2">
        Current Weather in {location || "Bungoma"}
      </h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{getIcon(weather.condition)}</span>
          <div>
            <div className="font-display text-3xl font-black text-[#0C4A6E] leading-none">
              {weather.temp}°C
            </div>
            <div className="text-sm font-semibold text-[#0284C7] mt-1">
              {weather.condition}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-[#0369A1] uppercase tracking-wider">Humidity</div>
          <div className="font-bold text-[#0C4A6E]">{weather.humidity}%</div>
        </div>
      </div>
    </div>
  );
}
