"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/lib/api";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      router.push("/login");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
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

        {/* Center Copy */}
        <div className="relative flex flex-col">
          <div className="mb-3">
            {" "}
            {/* Logo */}
            <div className="relative mb-10 flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="SkyCast"
                className="h-10 w-auto object-contain rounded-2xl"
              />
              <span className="text-white font-extrabold text-xl tracking-widest uppercase">
                SkyCast
              </span>
            </div>
          </div>
          <p className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase">
            Join WeatherSense
          </p>
          <h2 className="text-5xl font-black text-white leading-tight">
            Start forecasting
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              smarter today.
            </span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-xs">
            Create your free account and get access to real-time atmospheric
            data, hyper-local forecasts, and intelligent alerts.
          </p>
        </div>

        {/* Footer */}
        <div className="relative">
          <p className="text-slate-600 text-sm">
            © 2026 WeatherSense. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-950">
        <div className="w-full max-w-sm">
          {/* Mobile-only logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <img
              src="/logo.png"
              alt="SkyCast"
              className="h-8 w-auto object-contain"
            />
          </div>

          {/* Card */}
          <div className="flex flex-col gap-10 p-8">
            {/* Heading */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-black text-white tracking-tight">
                Create account
              </h1>
              <p className="text-slate-400 text-sm">
                Fill in the details below to get started
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 text-red-300 text-sm p-4">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-8"
              autoComplete="off"
            >
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
                  autoComplete="off"
                  name="username"
                  className="w-full px-4 py-4 bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-cyan-500 focus:bg-slate-800 transition-colors duration-200"
                  placeholder="Choose a username"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  autoComplete="off"
                  name="email"
                  className="w-full px-4 py-4 bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-cyan-500 focus:bg-slate-800 transition-colors duration-200"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
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
                    className="w-full px-4 py-4 pr-11 bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-cyan-500 focus:bg-slate-800 transition-colors duration-200"
                    placeholder="Create a password"
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

              {/* Confirm Password */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
                    }
                    autoComplete="new-password"
                    name="confirmPassword"
                    className="w-full px-4 py-4 pr-11 bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-cyan-500 focus:bg-slate-800 transition-colors duration-200"
                    placeholder="Re-enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors duration-200"
                  >
                    {showConfirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm tracking-widest uppercase transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          </div>

          {/* Sign In */}
          <p className="text-center text-sm text-slate-500 mt-8">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors duration-200"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
