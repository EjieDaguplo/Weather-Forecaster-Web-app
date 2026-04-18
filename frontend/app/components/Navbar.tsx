"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Cloud, LayoutDashboard, Shield, LogOut } from "lucide-react";

export default function Navbar({ user }: { user: any }) {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("auth_token");
    Cookies.remove("auth_user");
    router.replace("/login");
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.jpg"
            alt="SkyCast"
            className="h-8 w-auto object-contain rounded-xl"
          />
          <span className="text-white font-extrabold text-base tracking-widest uppercase">
            SkyCast
          </span>
        </div>

        {/* Nav Links + User */}
        <div className="flex items-center gap-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors duration-200 text-sm font-bold tracking-wide uppercase"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>

          {user?.role === "admin" && (
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 text-yellow-400/80 hover:text-yellow-400 hover:bg-yellow-400/5 transition-colors duration-200 text-sm font-bold tracking-wide uppercase"
            >
              <Shield className="w-4 h-4" />
              Admin
            </Link>
          )}

          <div className="w-px h-5 bg-slate-700 mx-2" />

          <span className="text-sm text-slate-500 font-mono hidden sm:block mr-2">
            {user?.username}
          </span>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-red-400 hover:bg-red-400/5 transition-colors duration-200 text-sm font-bold tracking-wide uppercase"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
