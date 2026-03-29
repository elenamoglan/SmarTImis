import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Cloud, Wind, Thermometer, Droplets, MapPin, Activity } from 'lucide-react';

const TimisoaraWeather = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [aqiData, setAqiData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeatherAndAqi = async () => {
            try {
                // Timisoara coordinates
                const lat = 45.7489;
                const lng = 21.2087;

                const weatherRes = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`);
                setWeatherData(weatherRes.data.current);

                const aqiRes = await axios.get(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=european_aqi,us_aqi`);
                setAqiData(aqiRes.data.current);
            } catch (err) {
                console.error("Failed to fetch weather or AQI data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherAndAqi();
    }, []);

    if (loading) {
        return (
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm animate-pulse h-24 mb-6 flex items-center justify-center">
                <div className="flex gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="w-24 h-8 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!weatherData && !aqiData) return null;

    // Helper function to get AQI description and color
    const getAqiInfo = (aqi) => {
        if (!aqi) return { text: 'Unknown', color: 'text-gray-500', bg: 'bg-gray-100' };
        if (aqi <= 50) return { text: 'Good', color: 'text-green-700', bg: 'bg-green-100' };
        if (aqi <= 100) return { text: 'Moderate', color: 'text-yellow-700', bg: 'bg-yellow-100' };
        if (aqi <= 150) return { text: 'Unhealthy for Sensitive Groups', color: 'text-orange-700', bg: 'bg-orange-100' };
        if (aqi <= 200) return { text: 'Unhealthy', color: 'text-red-700', bg: 'bg-red-100' };
        if (aqi <= 300) return { text: 'Very Unhealthy', color: 'text-purple-700', bg: 'bg-purple-100' };
        return { text: 'Hazardous', color: 'text-rose-900', bg: 'bg-rose-200' };
    };

    const aqiInfo = getAqiInfo(aqiData?.us_aqi);

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-md">
                    <MapPin size={24} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Timișoara</h2>
                    <p className="text-xs text-blue-600 font-medium">City Conditions</p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 md:gap-8 bg-white/60 px-6 py-3 rounded-xl backdrop-blur-sm border border-white/50">
                {weatherData && (
                    <>
                        <div className="flex items-center gap-2">
                            <Thermometer size={18} className="text-orange-500" />
                            <span className="font-semibold text-gray-800">{weatherData.temperature_2m}°C</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                            <Droplets size={18} className="text-blue-400" />
                            <span className="font-semibold text-gray-800">{weatherData.relative_humidity_2m}%</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                            <Wind size={18} className="text-teal-500" />
                            <span className="font-semibold text-gray-800">{weatherData.wind_speed_10m} km/h</span>
                        </div>
                    </>
                )}

                {aqiData && (
                    <div className="flex items-center gap-2 border-l border-gray-200 pl-4 md:pl-8">
                        <Activity size={18} className={aqiInfo.color.replace('text-', 'text-')} />
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 font-medium">Air Quality</span>
                            <span className={`text-sm font-bold px-2 py-0.5 rounded-md mt-0.5 ${aqiInfo.bg} ${aqiInfo.color}`}>
                                {aqiData.us_aqi} AQI - {aqiInfo.text}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimisoaraWeather;
