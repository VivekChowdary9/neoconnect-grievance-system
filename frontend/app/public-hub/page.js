"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";
import { formatDate } from "../../lib/utils";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";
import { caseService } from "../../services/caseService";

export default function PublicHubPage() {
  const { user } = useAuth();
  const [resolvedCases, setResolvedCases] = useState([]);
  const [minutes, setMinutes] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minuteSearch, setMinuteSearch] = useState("");
  const [activeTab, setActiveTab] = useState("digest");

  // Secretariat modals
  const [minutesModal, setMinutesModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [minutesForm, setMinutesForm] = useState({ title: "", date: "", file: null });
  const [updateForm, setUpdateForm] = useState({ title: "", description: "" });
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [casesData, minutesData, updatesData] = await Promise.all([
        caseService.getCases(),
        api.get("/public/minutes").then((r) => r.data),
        api.get("/public/updates").then((r) => r.data),
      ]);
      setResolvedCases(casesData.filter((c) => c.status === "Resolved"));
      setMinutes(minutesData);
      setUpdates(updatesData);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleUploadMinutes = async () => {
    setPostError("");
    if (!minutesForm.title || !minutesForm.date || !minutesForm.file) { setPostError("All fields required."); return; }
    setPosting(true);
    try {
      const fd = new FormData();
      fd.append("title", minutesForm.title);
      fd.append("date", minutesForm.date);
      fd.append("file", minutesForm.file);
      await api.post("/public/minutes", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setMinutesModal(false);
      setMinutesForm({ title: "", date: "", file: null });
      await fetchAll();
    } catch (e) { setPostError(e.response?.data?.message || "Upload failed."); }
    finally { setPosting(false); }
  };

  const handlePostUpdate = async () => {
    setPostError("");
    if (!updateForm.title || !updateForm.description) { setPostError("All fields required."); return; }
    setPosting(true);
    try {
      await api.post("/public/updates", updateForm);
      setUpdateModal(false);
      setUpdateForm({ title: "", description: "" });
      await fetchAll();
    } catch (e) { setPostError(e.response?.data?.message || "Post failed."); }
    finally { setPosting(false); }
  };

  const filteredMinutes = minutes.filter((m) => m.title.toLowerCase().includes(minuteSearch.toLowerCase()));

  const isSecretary = user?.role === "secretariat" || user?.role === "admin";

  const tabs = [
    { id: "digest", label: "Quarterly Digest" },
    { id: "impact", label: "Impact Tracking" },
    { id: "minutes", label: "Minutes Archive" },
    { id: "updates", label: "Announcements" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Actions for secretariat */}
        {isSecretary && (
          <div className="bg-white rounded-2xl border border-border p-4 flex flex-wrap gap-3">
            <button onClick={() => setMinutesModal(true)} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
              📄 Upload Minutes
            </button>
            <button onClick={() => setUpdateModal(true)} className="px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all" style={{ background: "hsl(235, 85%, 55%)" }}>
              📢 Post Announcement
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border border-border p-1">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? "text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              style={activeTab === tab.id ? { background: "hsl(235, 85%, 55%)" } : {}}>
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground text-sm">Loading...</div>
        ) : (
          <>
            {/* Quarterly Digest */}
            {activeTab === "digest" && (
              <div className="bg-white rounded-2xl border border-border">
                <div className="px-6 py-4 border-b border-border">
                  <h3 className="font-bold" style={{ fontFamily: "Syne, sans-serif" }}>Resolved Cases — Quarterly Digest</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{resolvedCases.length} case{resolvedCases.length !== 1 ? "s" : ""} resolved</p>
                </div>
                {resolvedCases.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">No resolved cases yet.</div>
                ) : (
                  <div className="divide-y divide-border">
                    {resolvedCases.map((c) => (
                      <div key={c._id} className="px-6 py-4 flex items-center justify-between">
                        <div>
                          <span className="font-mono text-xs font-bold mr-3" style={{ color: "hsl(235, 85%, 55%)" }}>{c.trackingId}</span>
                          <span className="text-sm font-medium">{c.category}</span>
                          <span className="text-muted-foreground text-sm"> · {c.department}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDate(c.createdAt)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Impact Tracking */}
            {activeTab === "impact" && (
              <div className="bg-white rounded-2xl border border-border">
                <div className="px-6 py-4 border-b border-border">
                  <h3 className="font-bold" style={{ fontFamily: "Syne, sans-serif" }}>Impact Tracking</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Issue → Action → Result</p>
                </div>
                {resolvedCases.filter((c) => c.actionTaken || c.result).length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">No impact records yet. Case managers can add action taken and result when resolving cases.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Case</th>
                          <th>Issue</th>
                          <th>Action Taken</th>
                          <th>Result</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resolvedCases.filter((c) => c.actionTaken || c.result).map((c) => (
                          <tr key={c._id}>
                            <td className="font-mono text-xs font-bold" style={{ color: "hsl(235, 85%, 55%)" }}>{c.trackingId}</td>
                            <td><div className="text-sm font-medium">{c.category}</div><div className="text-xs text-muted-foreground">{c.department}</div></td>
                            <td className="text-sm max-w-xs">{c.actionTaken || <span className="text-muted-foreground">—</span>}</td>
                            <td className="text-sm max-w-xs">{c.result || <span className="text-muted-foreground">—</span>}</td>
                            <td className="text-muted-foreground text-sm">{formatDate(c.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Minutes */}
            {activeTab === "minutes" && (
              <div className="bg-white rounded-2xl border border-border">
                <div className="px-6 py-4 border-b border-border flex items-center gap-3">
                  <h3 className="font-bold flex-1" style={{ fontFamily: "Syne, sans-serif" }}>Minutes Archive</h3>
                  <input type="text" placeholder="Search minutes..." className="form-input w-52" value={minuteSearch} onChange={(e) => setMinuteSearch(e.target.value)} />
                </div>
                {filteredMinutes.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">No meeting minutes uploaded yet.</div>
                ) : (
                  <div className="divide-y divide-border">
                    {filteredMinutes.map((m) => (
                      <div key={m._id} className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm bg-red-50 text-red-600">📄</div>
                          <div>
                            <p className="text-sm font-medium">{m.title}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(m.date)}</p>
                          </div>
                        </div>
                        <a href={`http://localhost:5000${m.fileUrl}`} target="_blank" rel="noopener noreferrer"
                          className="text-sm font-medium px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors">
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Updates/Announcements */}
            {activeTab === "updates" && (
              <div className="space-y-4">
                {updates.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-border p-8 text-center text-muted-foreground text-sm">No announcements yet.</div>
                ) : (
                  updates.map((u) => (
                    <div key={u._id} className="bg-white rounded-2xl border border-border p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold" style={{ fontFamily: "Syne, sans-serif" }}>{u.title}</h4>
                        <span className="text-xs text-muted-foreground ml-4 flex-shrink-0">{formatDate(u.date)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{u.description}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Upload Minutes Modal */}
      <Modal open={minutesModal} onClose={() => setMinutesModal(false)} title="Upload Meeting Minutes">
        <div className="space-y-4">
          {postError && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{postError}</div>}
          <div>
            <label className="form-label">Title</label>
            <input type="text" className="form-input" placeholder="e.g. Q1 2025 Board Meeting" value={minutesForm.title} onChange={(e) => setMinutesForm({ ...minutesForm, title: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Date</label>
            <input type="date" className="form-input" value={minutesForm.date} onChange={(e) => setMinutesForm({ ...minutesForm, date: e.target.value })} />
          </div>
          <div>
            <label className="form-label">PDF File</label>
            <input type="file" className="form-input" accept=".pdf" onChange={(e) => setMinutesForm({ ...minutesForm, file: e.target.files[0] })} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setMinutesModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
            <button onClick={handleUploadMinutes} disabled={posting} className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-all" style={{ background: "hsl(235, 85%, 55%)" }}>
              {posting ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Post Update Modal */}
      <Modal open={updateModal} onClose={() => setUpdateModal(false)} title="Post Announcement">
        <div className="space-y-4">
          {postError && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{postError}</div>}
          <div>
            <label className="form-label">Title</label>
            <input type="text" className="form-input" placeholder="Announcement title" value={updateForm.title} onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Description</label>
            <textarea className="form-textarea" rows={4} placeholder="Write your announcement..." value={updateForm.description} onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setUpdateModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
            <button onClick={handlePostUpdate} disabled={posting} className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-all" style={{ background: "hsl(235, 85%, 55%)" }}>
              {posting ? "Posting..." : "Post Announcement"}
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
