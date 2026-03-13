"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { caseService } from "../../services/caseService";

const CATEGORIES = ["Safety", "Policy", "Facilities", "HR", "Other"];
const DEPARTMENTS = ["Engineering", "HR", "Finance", "Operations", "Legal", "Marketing", "IT", "Facilities", "Other"];
const SEVERITIES = ["Low", "Medium", "High"];

export default function SubmitCasePage() {
  const router = useRouter();
  const [form, setForm] = useState({ category: "", department: "", location: "", severity: "Low", description: "", anonymous: false });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (file) formData.append("file", file);
      const result = await caseService.createCase(formData);
      setSuccess(result);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit case.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <DashboardLayout>
        <div className="max-w-lg mx-auto mt-10">
          <div className="bg-white rounded-2xl border border-border p-8 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl" style={{ background: "hsl(235, 85%, 96%)" }}>✓</div>
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "Syne, sans-serif" }}>Case Submitted!</h2>
            <p className="text-muted-foreground mb-4 text-sm">Your case has been successfully submitted and will be reviewed shortly.</p>
            <div className="bg-muted/50 rounded-xl p-4 mb-6">
              <p className="text-xs text-muted-foreground mb-1">Tracking ID</p>
              <p className="font-mono font-bold text-xl" style={{ color: "hsl(235, 85%, 55%)" }}>{success.trackingId}</p>
              <p className="text-xs text-muted-foreground mt-1">Save this ID to track your case</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setSuccess(null); setForm({ category: "", department: "", location: "", severity: "Low", description: "", anonymous: false }); setFile(null); }}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
                Submit another
              </button>
              <button onClick={() => router.push("/cases")} className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-all" style={{ background: "hsl(235, 85%, 55%)" }}>
                View cases
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-border">
          <div className="px-6 py-5 border-b border-border">
            <h2 className="font-bold text-lg" style={{ fontFamily: "Syne, sans-serif" }}>New Case Submission</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Fill in the details below. Fields marked * are required.</p>
          </div>
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
            {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Category *</label>
                <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Department *</label>
                <select className="form-select" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required>
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Location</label>
                <input type="text" className="form-input" placeholder="e.g. Floor 3, Building A" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Severity *</label>
                <select className="form-select" value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })} required>
                  {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Description *</label>
              <textarea className="form-textarea" rows={5} placeholder="Describe the issue in detail..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required minLength={20} />
              <p className="text-xs text-muted-foreground mt-1">{form.description.length} characters (minimum 20)</p>
            </div>

            <div>
              <label className="form-label">Attachment (optional)</label>
              <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary/50 transition-colors cursor-pointer" onClick={() => document.getElementById("file-input").click()}>
                <input id="file-input" type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files[0])} />
                {file ? (
                  <div className="text-sm">
                    <span className="font-medium text-foreground">{file.name}</span>
                    <span className="text-muted-foreground ml-2">({(file.size / 1024).toFixed(1)} KB)</span>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="ml-3 text-red-500 hover:underline">Remove</button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground">Click to upload image or PDF</p>
                    <p className="text-xs text-muted-foreground mt-1">Max 10MB</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/30">
              <div className="relative">
                <input type="checkbox" id="anon" checked={form.anonymous} onChange={(e) => setForm({ ...form, anonymous: e.target.checked })} className="w-4 h-4 rounded" />
              </div>
              <div>
                <label htmlFor="anon" className="text-sm font-medium cursor-pointer">Submit anonymously</label>
                <p className="text-xs text-muted-foreground">Your identity will not be attached to this case</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => router.back()} className="flex-1 py-3 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60" style={{ background: "hsl(235, 85%, 55%)" }}>
                {loading ? "Submitting..." : "Submit Case"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
