"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/app/lib/api";
import { Cloud, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", form);
      const { token, user } = res.data;
      Cookies.set("auth_token", token, { expires: 7 });
      Cookies.set("auth_user", JSON.stringify(user), { expires: 7 });
      router.push(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-14 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800/60 overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(6,182,212,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.4) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Glow orb */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 blur-[120px] pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <img
            src="/logo.jpg"
            alt="SkyCast"
            className="h-10 w-auto object-contain rounded-2xl"
          />
          <span className="text-white font-extrabold text-xl tracking-widest uppercase">
            SkyCast
          </span>
        </div>

        {/* Center Copy */}
        <div className="relative flex flex-col gap-6 items-center text-justify-center">
          <p className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase">
            Precision Forecasting
          </p>
          <h2 className="text-5xl font-black text-white leading-tight">
            The weather,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              on your terms.
            </span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-xs">
            Real-time atmospheric data, hyper-local forecasts, and intelligent
            alerts — all in one place.
          </p>
        </div>

        {/* Footer */}
        <div className="relative">
          <p className="text-slate-600 text-sm">
            © 2026 WeatherSense-Abado. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-950">
        <div className="w-full max-w-sm">
          {/* Card — no border, no rounded */}
          <div className="flex flex-col gap-8">
            {/* Mobile-only logo */}
            <div className="lg:hidden flex items-center gap-3 mb-20">
              <img
                src="/logo.jpg"
                alt="SkyCast"
                className="h-10 w-auto object-contain rounded-2xl animate-spin"
              />
              {/* Heading */}
              <span className="text-white font-bold text-2xl tracking-widest uppercase">
                SkyCast
              </span>
            </div>
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-3xl font-black text-white tracking-tight animate-pulse">
                Welcome back
              </h1>
              <p className="text-slate-400 text-sm">
                Sign in to access your dashboard
              </p>
            </div>
            {error && (
              <div className="text-red-300 text-lg text-center p-4 mb-8">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              {/* Username */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  autoComplete="on"
                  name="username"
                  className="w-full px-4 py-3 pr-11 bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 text-lg font-medium focus:outline-none focus:border-cyan-500 focus:bg-slate-800 transition-colors duration-200"
                  placeholder="Enter your username"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    autoComplete="new-password"
                    name="password"
                    className="w-full px-4 py-3 pr-11 bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 text-lg font-medium focus:outline-none focus:border-cyan-500 focus:bg-slate-800 transition-colors duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors duration-200"
                  >
                    {showPass ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 bg-slate-800 border border-slate-600 accent-cyan-500 cursor-pointer"
                  />
                  <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-200"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-lg tracking-widest uppercase transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
              <div className="mt-1">
                {/* Sign Up */}
                <p className="text-center text-sm text-slate-500">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/signup")}
                    className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors duration-200"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
