"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/app/lib/api";
import Navbar from "@/app/components/Navbar";
import ForecastChart from "@/app/components/ForecasterChart";
import PredictionForm from "@/app/components/PredictionForm";
import { Cloud, Wind, Droplets, Thermometer } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userCookie = Cookies.get("auth_user");
    const token = Cookies.get("auth_token");
    if (!token || !userCookie) {
      router.replace("/login");
      return;
    }
    setUser(JSON.parse(userCookie));
    fetchWeather();
  }, [router]);

  const fetchWeather = async () => {
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        api.get("/weather/current"),
        api.get("/weather/forecast"),
      ]);
      setWeather(weatherRes.data);
      setForecast(forecastRes.data.forecast || []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "morning";
    if (h < 18) return "afternoon";
    return "evening";
  }

  const stats = [
    {
      label: "Temperature",
      value: weather?.temperature ? `${weather.temperature}°C` : "--",
      icon: Thermometer,
      color: "#fb923c",
    },
    {
      label: "Humidity",
      value: weather?.humidity ? `${weather.humidity}%` : "--",
      icon: Droplets,
      color: "#22d3ee",
    },
    {
      label: "Wind Speed",
      value: weather?.wind_speed ? `${weather.wind_speed} km/h` : "--",
      icon: Wind,
      color: "#a78bfa",
    },
    {
      label: "Condition",
      value: weather?.condition || "--",
      icon: Cloud,
      color: "#22d3ee",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase mb-2">
            Weather Dashboard
          </p>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Good {getGreeting()},{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              {user?.username}
            </span>
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-slate-900 border border-slate-800/60 p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                  {stat.label}
                </span>
              </div>
              {loading ? (
                <div className="h-8 w-20 bg-slate-800 animate-pulse" />
              ) : (
                <p className="text-2xl font-black text-white">{stat.value}</p>
              )}
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left — Chart + Detail */}
          <div className="lg:col-span-2 space-y-6">
            <ForecastChart data={forecast} loading={loading} />

            {/* Current Weather Detail */}
            {!loading && weather && (
              <div className="bg-slate-900 border border-slate-800/60 p-6">
                <p className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase mb-1">
                  Current Conditions
                </p>
                <h3 className="text-lg font-black text-white mb-5">
                  {weather.location || "Your Location"}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    {
                      label: "Feels Like",
                      value: `${weather.feels_like ?? "--"}°C`,
                    },
                    {
                      label: "Pressure",
                      value: `${weather.pressure ?? "--"} hPa`,
                    },
                    {
                      label: "Visibility",
                      value: `${weather.visibility ?? "--"} km`,
                    },
                    {
                      label: "Humidity",
                      value: `${weather.humidity ?? "--"}%`,
                    },
                    {
                      label: "Wind",
                      value: `${weather.wind_speed ?? "--"} km/h`,
                    },
                    { label: "Condition", value: weather.condition ?? "--" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-slate-800/60 border border-slate-700/60 p-4 text-center"
                    >
                      <p className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-2">
                        {item.label}
                      </p>
                      <p className="text-base font-black text-white">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Loading skeleton */}
            {loading && (
              <div className="bg-slate-900 border border-slate-800/60 p-6">
                <div className="h-4 w-32 bg-slate-800 animate-pulse mb-5" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-slate-800/60 border border-slate-700/60 p-4"
                    >
                      <div className="h-3 w-16 bg-slate-700 animate-pulse mb-3 mx-auto" />
                      <div className="h-5 w-20 bg-slate-700 animate-pulse mx-auto" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — Prediction */}
          <div className="lg:col-span-1">
            <PredictionForm onResult={(r) => console.log("Prediction:", r)} />
          </div>
        </div>
      </main>
    </div>
  );
}
