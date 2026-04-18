"use client";
import { Users, Activity, TrendingUp, Database } from "lucide-react";

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
      color: "#22d3ee",
    },
    {
      label: "Predictions Today",
      value: stats?.predictions_today ?? "--",
      icon: Activity,
      color: "#facc15",
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-slate-900 border border-slate-800/60 p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <item.icon className="w-4 h-4" style={{ color: item.color }} />
            <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">
              {item.label}
            </span>
          </div>
          {loading ? (
            <div className="h-8 w-16 bg-slate-800 animate-pulse" />
          ) : (
            <p className="text-3xl font-black text-white">{item.value}</p>
          )}
        </div>
      ))}
    </div>
  );
}
