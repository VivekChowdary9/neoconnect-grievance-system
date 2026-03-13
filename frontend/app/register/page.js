"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";

const DEPARTMENTS = ["Engineering", "HR", "Finance", "Operations", "Legal", "Marketing", "IT", "Facilities", "Other"];

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", department: "", role: "staff" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "hsl(220, 20%, 97%)" }}>
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
            Join the conversation.<br />Shape the culture.
          </h1>
          <p style={{ color: "hsl(220, 20%, 65%)" }} className="text-lg leading-relaxed">
            Create your account to start submitting feedback, tracking complaints, and contributing to a better workplace.
          </p>
          <div className="mt-12 space-y-4">
            {[{ icon: "🎯", label: "Track every complaint in real-time" }, { icon: "🤝", label: "Work with management transparently" }, { icon: "📢", label: "Your feedback drives real change" }].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span style={{ color: "hsl(220, 20%, 75%)" }} className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <p style={{ color: "hsl(220, 20%, 45%)" }} className="text-xs">© {new Date().getFullYear()} NeoConnect. All rights reserved.</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "Syne, sans-serif" }}>Create account</h2>
          <p className="text-muted-foreground mb-8 text-sm">Fill in your details to get started</p>

          {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Full name</label>
              <input type="text" className="form-input" placeholder="Jane Smith" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="form-label">Email address</label>
              <input type="email" className="form-input" placeholder="you@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="Min. 8 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
            </div>
            <div>
              <label className="form-label">Department</label>
              <select className="form-select" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required>
                <option value="">Select department</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Role</label>
              <select className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="staff">Staff</option>
                <option value="secretariat">Secretariat</option>
                <option value="case_manager">Case Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 px-4 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60 mt-2" style={{ background: "hsl(235, 85%, 55%)" }}>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold hover:underline" style={{ color: "hsl(235, 85%, 55%)" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
