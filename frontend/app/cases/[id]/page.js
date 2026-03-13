"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { StatusBadge, SeverityBadge } from "../../../components/ui/Badges";
import { caseService } from "../../../services/caseService";
import { useAuth } from "../../../hooks/useAuth";
import { formatDate } from "../../../lib/utils";

const STATUSES = ["New", "Assigned", "In Progress", "Pending", "Resolved", "Escalated"];

export default function CaseDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCase();
  }, [id]);

  const fetchCase = async () => {
    try {
      const data = await caseService.getCaseById(id);
      setCaseData(data);
      setStatus(data.status);
      setActionTaken(data.actionTaken || "");
      setResult(data.result || "");
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const canEdit = user?.role === "case_manager" || user?.role === "secretariat" || user?.role === "admin";

  const handleUpdate = async () => {
    setError(""); setSuccess("");
    setUpdating(true);
    try {
      await caseService.updateCase(id, { status, note: note.trim() || undefined, actionTaken, result });
      setNote("");
      setSuccess("Case updated successfully.");
      await fetchCase();
    } catch (e) {
      setError(e.response?.data?.message || "Update failed.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <DashboardLayout><div className="p-12 text-center text-muted-foreground text-sm">Loading case...</div></DashboardLayout>;
  if (!caseData) return <DashboardLayout><div className="p-12 text-center text-muted-foreground text-sm">Case not found.</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button onClick={() => router.back()} className="text-muted-foreground hover:text-foreground text-sm transition-colors">← Back</button>
                <span className="font-mono font-bold text-lg" style={{ color: "hsl(235, 85%, 55%)" }}>{caseData.trackingId}</span>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <StatusBadge status={caseData.status} />
                <SeverityBadge severity={caseData.severity} />
                {caseData.anonymous && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">Anonymous</span>}
              </div>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>Submitted {formatDate(caseData.createdAt)}</p>
              {caseData.submittedBy && !caseData.anonymous && <p className="mt-0.5">By {caseData.submittedBy.name}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Details */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="font-bold mb-4" style={{ fontFamily: "Syne, sans-serif" }}>Case Details</h3>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                {[
                  { label: "Category", value: caseData.category },
                  { label: "Department", value: caseData.department },
                  { label: "Location", value: caseData.location || "—" },
                  { label: "Assigned To", value: caseData.assignedTo?.name || "Unassigned" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <dt className="text-muted-foreground text-xs mb-0.5">{label}</dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 pt-4 border-t border-border">
                <dt className="text-muted-foreground text-xs mb-1.5">Description</dt>
                <dd className="text-sm leading-relaxed">{caseData.description}</dd>
              </div>
              {caseData.fileUrl && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-muted-foreground text-xs mb-1.5">Attachment</p>
                  <a href={`http://localhost:5000${caseData.fileUrl}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium hover:underline" style={{ color: "hsl(235, 85%, 55%)" }}>
                    📎 View attachment
                  </a>
                </div>
              )}
            </div>

            {/* Resolution */}
            {(caseData.actionTaken || caseData.result) && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                <h3 className="font-bold mb-4 text-green-800" style={{ fontFamily: "Syne, sans-serif" }}>Resolution Details</h3>
                {caseData.actionTaken && <div className="mb-3"><p className="text-xs text-green-700 mb-1">Action Taken</p><p className="text-sm">{caseData.actionTaken}</p></div>}
                {caseData.result && <div><p className="text-xs text-green-700 mb-1">Result</p><p className="text-sm">{caseData.result}</p></div>}
              </div>
            )}

            {/* Notes */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="font-bold mb-4" style={{ fontFamily: "Syne, sans-serif" }}>Notes & Activity</h3>
              {caseData.notes?.length === 0 ? (
                <p className="text-sm text-muted-foreground">No notes yet.</p>
              ) : (
                <div className="space-y-3">
                  {caseData.notes?.map((n, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5" style={{ background: "hsl(235, 85%, 55%)" }}>
                        {n.addedBy?.name?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1 bg-muted/40 rounded-xl p-3">
                        <p className="text-xs text-muted-foreground mb-1">{n.addedBy?.name || "Unknown"} · {formatDate(n.addedAt)}</p>
                        <p className="text-sm">{n.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar actions */}
          <div className="space-y-5">
            {canEdit && (
              <div className="bg-white rounded-2xl border border-border p-5">
                <h3 className="font-bold mb-4 text-sm" style={{ fontFamily: "Syne, sans-serif" }}>Update Case</h3>
                {error && <div className="mb-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">{error}</div>}
                {success && <div className="mb-3 p-2.5 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs">{success}</div>}
                <div className="space-y-3">
                  <div>
                    <label className="form-label text-xs">Status</label>
                    <select className="form-select text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label text-xs">Add Note</label>
                    <textarea className="form-textarea text-sm" rows={3} placeholder="Add a note..." value={note} onChange={(e) => setNote(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label text-xs">Action Taken</label>
                    <textarea className="form-textarea text-sm" rows={2} placeholder="Describe action taken..." value={actionTaken} onChange={(e) => setActionTaken(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label text-xs">Result</label>
                    <textarea className="form-textarea text-sm" rows={2} placeholder="Outcome / result..." value={result} onChange={(e) => setResult(e.target.value)} />
                  </div>
                  <button onClick={handleUpdate} disabled={updating} className="w-full py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-all" style={{ background: "hsl(235, 85%, 55%)" }}>
                    {updating ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-border p-5 text-sm space-y-2">
              <h3 className="font-bold text-sm mb-3" style={{ fontFamily: "Syne, sans-serif" }}>Timeline</h3>
              <div className="flex items-center gap-2 text-muted-foreground"><span>📅</span><span>Created {formatDate(caseData.createdAt)}</span></div>
              {caseData.updatedAt !== caseData.createdAt && <div className="flex items-center gap-2 text-muted-foreground"><span>🔄</span><span>Updated {formatDate(caseData.updatedAt)}</span></div>}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
