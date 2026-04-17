"use client";
import { useState } from "react";
import api from "@/app/lib/api";
import { Loader2, Zap } from "lucide-react";

interface Props {
  onResult: (result: any) => void;
}

export default function PredictionForm({ onResult }: Props) {
  const [form, setForm] = useState({
    temperature: "",
    humidity: "",
    wind_speed: "",
    pressure: "",
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/weather/predict", {
        temperature: parseFloat(form.temperature),
        humidity: parseFloat(form.humidity),
        wind_speed: parseFloat(form.wind_speed),
        pressure: parseFloat(form.pressure),
      });
      setResult(res.data);
      onResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "temperature", label: "Temperature (°C)", placeholder: "e.g. 28" },
    { key: "humidity", label: "Humidity (%)", placeholder: "e.g. 75" },
    { key: "wind_speed", label: "Wind Speed (km/h)", placeholder: "e.g. 12" },
    { key: "pressure", label: "Pressure (hPa)", placeholder: "e.g. 1013" },
  ];

  return (
    <div className="glass-strong rounded-2xl p-6 fade-in h-fit">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(0,212,255,0.15)" }}
        >
          <Zap className="w-4 h-4" style={{ color: "var(--accent-cyan)" }} />
        </div>
        <div>
          <p className="font-mono text-xs text-white/30 uppercase tracking-widest">
            AI Model
          </p>
          <h3 className="font-display text-lg font-semibold text-white">
            Run Prediction
          </h3>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="block text-xs font-mono text-white/30 uppercase tracking-widest mb-1.5">
              {f.label}
            </label>
            <input
              type="number"
              step="any"
              required
              placeholder={f.placeholder}
              value={(form as any)[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-cyan-400/50 transition-all font-mono text-sm"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-display font-semibold text-sky-950 flex items-center justify-center gap-2 transition-all hover:opacity-90 mt-2"
          style={{ background: "var(--accent-cyan)" }}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Predict Now"
          )}
        </button>
      </form>

      {result && (
        <div className="mt-5 p-4 rounded-xl bg-white/5 border border-white/10 fade-in">
          <p className="font-mono text-xs text-white/30 uppercase tracking-widest mb-2">
            Prediction Result
          </p>
          <p
            className="font-display text-2xl font-bold"
            style={{ color: "var(--accent-cyan)" }}
          >
            {result.prediction}
          </p>
          {result.confidence && (
            <p className="text-white/40 text-sm mt-1 font-mono">
              Confidence: {(result.confidence * 100).toFixed(1)}%
            </p>
          )}
        </div>
      )}
    </div>
  );
}
