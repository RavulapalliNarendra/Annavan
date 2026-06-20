"use client";

import { useEffect, useState } from "react";
import { Cloud, Sun, CloudRain, Wind, Loader2, Thermometer, CloudLightning, CloudSnow } from "lucide-react";

interface WeatherData {
    temperature: number;
    windspeed: number;
    weathercode: number;
}

export default function WeatherWidget() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Defaulting to a central Indian location (Nagpur) for demo purposes
                // In a real app, we would get the user's location
                const response = await fetch(
                    "https://api.open-meteo.com/v1/forecast?latitude=21.1458&longitude=79.0882&current_weather=true"
                );
                const data = await response.json();
                setWeather(data.current_weather);
            } catch (err) {
                console.error("Failed to fetch weather", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    const getWeatherIcon = (code: number) => {
        if (code <= 1) return <Sun className="text-yellow-500 h-8 w-8" />;
        if (code <= 3) return <Cloud className="text-gray-400 h-8 w-8" />;
        if (code <= 67) return <CloudRain className="text-blue-400 h-8 w-8" />;
        if (code <= 77) return <CloudSnow className="text-blue-200 h-8 w-8" />;
        if (code <= 99) return <CloudLightning className="text-purple-500 h-8 w-8" />;
        return <Sun className="text-yellow-500 h-8 w-8" />;
    };

    const getWeatherDescription = (code: number) => {
        if (code === 0) return "Clear Sky";
        if (code === 1) return "Mainly Clear";
        if (code === 2) return "Partly Cloudy";
        if (code === 3) return "Overcast";
        if (code >= 45 && code <= 48) return "Foggy";
        if (code >= 51 && code <= 55) return "Drizzle";
        if (code >= 61 && code <= 65) return "Rain";
        if (code >= 80 && code <= 82) return "Showers";
        if (code >= 95) return "Thunderstorm";
        return "Good Weather";
    };

    if (loading) return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center h-40">
            <Loader2 className="animate-spin text-green-600" />
        </div>
    );

    if (error || !weather) return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center h-40 text-gray-400 text-sm">
            Unable to load weather
        </div>
    );

    return (
        <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-sm border border-blue-100">
            <h3 className="text-gray-500 text-sm font-medium mb-4 flex items-center gap-2">
                <Cloud size={16} /> Daily Weather Report (Nagpur)
            </h3>

            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-4xl font-bold text-gray-800">{weather.temperature}°C</span>
                        {getWeatherIcon(weather.weathercode)}
                    </div>
                    <p className="text-blue-600 font-medium mt-1">
                        {getWeatherDescription(weather.weathercode)}
                    </p>
                </div>

                <div className="text-right space-y-2">
                    <div className="flex items-center justify-end gap-2 text-gray-600 text-sm">
                        <Wind size={16} />
                        <span>{weather.windspeed} km/h Wind</span>
                    </div>
                    <div className="flex items-center justify-end gap-2 text-gray-600 text-sm">
                        <Thermometer size={16} />
                        <span>Humidity: --%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
