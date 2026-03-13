"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { StatusBadge, SeverityBadge } from "../../components/ui/Badges";
import { caseService } from "../../services/caseService";
import { useAuth } from "../../hooks/useAuth";
import { formatDate } from "../../lib/utils";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";

export default function CasesPage() {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [assignModal, setAssignModal] = useState(null);
  const [caseManagers, setCaseManagers] = useState([]);
  const [assignTo, setAssignTo] = useState("");
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchCases();
    if (user?.role === "secretariat" || user?.role === "admin") fetchCaseManagers();
  }, [user]);

  useEffect(() => {
    let result = cases;
    if (search) result = result.filter((c) => c.trackingId?.toLowerCase().includes(search.toLowerCase()) || c.category?.toLowerCase().includes(search.toLowerCase()) || c.department?.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter) result = result.filter((c) => c.status === statusFilter);
    setFiltered(result);
  }, [cases, search, statusFilter]);

  const fetchCases = async () => {
    try {
      const data = await caseService.getCases();
      setCases(data);
      setFiltered(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchCaseManagers = async () => {
    try {
      const { data } = await api.get("/users?role=case_manager");
      setCaseManagers(data);
    } catch (e) { console.error(e); }
  };

  const handleAssign = async () => {
    if (!assignTo) return;
    setAssigning(true);
    try {
      await caseService.assignCase(assignModal._id, assignTo);
      await fetchCases();
      setAssignModal(null);
      setAssignTo("");
    } catch (e) { console.error(e); }
    finally { setAssigning(false); }
  };

  const STATUSES = ["New", "Assigned", "In Progress", "Pending", "Resolved", "Escalated"];

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-border p-4 flex flex-wrap gap-3 items-center">
          <input type="text" placeholder="Search by ID, category, department..." className="form-input flex-1 min-w-48" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="form-select w-44" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="text-sm text-muted-foreground whitespace-nowrap">{filtered.length} case{filtered.length !== 1 ? "s" : ""}</div>
          {(user?.role !== "case_manager") && (
            <Link href="/submit-case" className="px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all whitespace-nowrap" style={{ background: "hsl(235, 85%, 55%)" }}>
              + New Case
            </Link>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground text-sm">Loading cases...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground text-sm">No cases found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tracking ID</th>
                    <th>Category</th>
                    <th>Department</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th>Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c._id}>
                      <td>
                        <Link href={`/cases/${c._id}`} className="font-mono text-xs font-semibold hover:underline" style={{ color: "hsl(235, 85%, 55%)" }}>
                          {c.trackingId}
                        </Link>
                      </td>
                      <td className="font-medium">{c.category}</td>
                      <td>{c.department}</td>
                      <td><SeverityBadge severity={c.severity} /></td>
                      <td><StatusBadge status={c.status} /></td>
                      <td>{c.assignedTo ? <span className="text-sm">{c.assignedTo.name}</span> : <span className="text-muted-foreground text-xs">Unassigned</span>}</td>
                      <td className="text-muted-foreground text-sm">{formatDate(c.createdAt)}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Link href={`/cases/${c._id}`} className="text-xs px-2.5 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors font-medium">View</Link>
                          {(user?.role === "secretariat" || user?.role === "admin") && (
                            <button onClick={() => { setAssignModal(c); setAssignTo(c.assignedTo?._id || ""); }}
                              className="text-xs px-2.5 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors font-medium">
                              Assign
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Assign Modal */}
      <Modal open={!!assignModal} onClose={() => setAssignModal(null)} title="Assign Case Manager">
        {assignModal && (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Case</p>
              <p className="font-mono font-bold">{assignModal.trackingId}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{assignModal.category} — {assignModal.department}</p>
            </div>
            <div>
              <label className="form-label">Select Case Manager</label>
              <select className="form-select" value={assignTo} onChange={(e) => setAssignTo(e.target.value)}>
                <option value="">Choose case manager...</option>
                {caseManagers.map((cm) => <option key={cm._id} value={cm._id}>{cm.name} ({cm.department || "—"})</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setAssignModal(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleAssign} disabled={assigning || !assignTo} className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-all" style={{ background: "hsl(235, 85%, 55%)" }}>
                {assigning ? "Assigning..." : "Assign"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
