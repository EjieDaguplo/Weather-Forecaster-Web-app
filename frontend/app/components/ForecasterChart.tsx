"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface Props {
  data: any[];
  loading: boolean;
}

export default function ForecastChart({ data, loading }: Props) {
  return (
    <div className="glass rounded-2xl p-6 fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-mono text-xs text-white/30 uppercase tracking-widest">
            7-Day Forecast
          </p>
          <h3 className="font-display text-lg font-semibold text-white mt-0.5">
            Temperature Trend
          </h3>
        </div>
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center text-white/20 text-sm font-mono">
          Loading forecast data...
        </div>
      ) : data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-white/20 text-sm font-mono">
          No forecast data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              stroke="rgba(255,255,255,0.2)"
              tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.2)"
              tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }}
            />
            <Tooltip
              contentStyle={{
                background: "#0d1f3c",
                border: "1px solid rgba(0,212,255,0.2)",
                borderRadius: 12,
                fontFamily: "JetBrains Mono",
                fontSize: 12,
              }}
              labelStyle={{ color: "rgba(255,255,255,0.6)" }}
              itemStyle={{ color: "#00d4ff" }}
            />
            <Area
              type="monotone"
              dataKey="temperature"
              stroke="#00d4ff"
              strokeWidth={2}
              fill="url(#tempGrad)"
              dot={{ fill: "#00d4ff", r: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
