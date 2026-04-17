"use client";
import { Users, Activity, Database, TrendingUp } from "lucide-react";

export default function AdminStats({
  stats,
  loading,
}: {
  stats: any;
  loading: boolean;
}) {
  const items = [
    {
      label: "Total Users",
      value: stats?.total_users ?? "--",
      icon: Users,
      color: "var(--accent-cyan)",
    },
    {
      label: "Predictions Today",
      value: stats?.predictions_today ?? "--",
      icon: Activity,
      color: "var(--accent-gold)",
    },
    {
      label: "Total Predictions",
      value: stats?.total_predictions ?? "--",
      icon: TrendingUp,
      color: "#a78bfa",
    },
    {
      label: "DB Records",
      value: stats?.db_records ?? "--",
      icon: Database,
      color: "#34d399",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 fade-in">
      {items.map((item) => (
        <div key={item.label} className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <item.icon className="w-4 h-4" style={{ color: item.color }} />
            <span className="text-xs font-mono text-white/30 uppercase tracking-widest">
              {item.label}
            </span>
          </div>
          {loading ? (
            <div className="h-8 w-16 rounded shimmer" />
          ) : (
            <p className="font-display text-3xl font-bold text-white">
              {item.value}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
