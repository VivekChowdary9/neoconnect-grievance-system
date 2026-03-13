"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "hsl(220, 20%, 97%)" }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12" style={{ background: "hsl(225, 30%, 12%)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "hsl(235, 85%, 55%)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <span className="text-white text-xl font-bold" style={{ fontFamily: "Syne, sans-serif" }}>NeoConnect</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "Syne, sans-serif" }}>
            Every voice<br />deserves to be heard.
          </h1>
          <p style={{ color: "hsl(220, 20%, 65%)" }} className="text-lg leading-relaxed">
            A transparent platform for staff feedback, complaint tracking, and organizational accountability.
          </p>

          <div className="mt-12 space-y-4">
            {[
              { icon: "🔒", label: "Anonymous submissions supported" },
              { icon: "📊", label: "Real-time case tracking" },
              { icon: "✅", label: "Full lifecycle management" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span style={{ color: "hsl(220, 20%, 75%)" }} className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ color: "hsl(220, 20%, 45%)" }} className="text-xs">
          © {new Date().getFullYear()} NeoConnect. All rights reserved.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "hsl(235, 85%, 55%)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="text-lg font-bold" style={{ fontFamily: "Syne, sans-serif" }}>NeoConnect</span>
          </div>

          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "Syne, sans-serif" }}>Welcome back</h2>
          <p className="text-muted-foreground mb-8 text-sm">Sign in to your account to continue</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 disabled:opacity-60"
              style={{ background: "hsl(235, 85%, 55%)" }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold hover:underline" style={{ color: "hsl(235, 85%, 55%)" }}>
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
