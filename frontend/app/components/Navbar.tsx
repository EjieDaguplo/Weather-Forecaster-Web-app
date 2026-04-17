"use client";
import Link from "next/link";
import { logout, isAdmin } from "@/app/lib/auth";
import { Cloud, LayoutDashboard, Shield, LogOut } from "lucide-react";

export default function Navbar({ user }: { user: any }) {
  return (
    <nav className="glass border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Cloud className="w-6 h-6" style={{ color: "var(--accent-cyan)" }} />
          <span className="font-display font-bold text-lg text-white">
            WeatherSense
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm font-body"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>

          {user?.role === "admin" && (
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-amber-400/80 hover:text-amber-400 hover:bg-amber-400/5 transition-all text-sm font-body"
            >
              <Shield className="w-4 h-4" />
              Admin
            </Link>
          )}

          <div className="w-px h-6 bg-white/10 mx-2" />

          <span className="text-sm text-white/40 font-mono hidden sm:block">
            {user?.username}
          </span>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all text-sm"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
