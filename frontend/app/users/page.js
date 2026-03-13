"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { RoleBadge } from "../../components/ui/Badges";
import { formatDate } from "../../lib/utils";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";

const ROLES = ["staff", "secretariat", "case_manager", "admin"];
const DEPARTMENTS = ["Engineering", "HR", "Finance", "Operations", "Legal", "Marketing", "IT", "Facilities", "Other"];

export default function UsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    if (user && user.role !== "admin") { router.push("/dashboard"); return; }
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleEdit = (u) => {
    setEditUser(u);
    setEditForm({ name: u.name, email: u.email, role: u.role, department: u.department });
    setError("");
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      await api.put(`/users/${editUser._id}`, editForm);
      setEditUser(null);
      await fetchUsers();
    } catch (e) {
      setError(e.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    try {
      await api.delete(`/users/${id}`);
      await fetchUsers();
    } catch (e) {
      alert(e.response?.data?.message || "Delete failed.");
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roleCounts = ROLES.reduce((acc, r) => ({ ...acc, [r]: users.filter((u) => u.role === r).length }), {});

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Staff", count: roleCounts.staff, color: "#3b82f6" },
            { label: "Secretariat", count: roleCounts.secretariat, color: "#8b5cf6" },
            { label: "Case Managers", count: roleCounts.case_manager, color: "#f59e0b" },
            { label: "Admins", count: roleCounts.admin, color: "#10b981" },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div className="text-2xl font-bold mb-1" style={{ fontFamily: "Syne, sans-serif", color: s.color }}>{s.count}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-border p-4 flex flex-wrap gap-3 items-center">
          <input type="text" placeholder="Search by name or email..." className="form-input flex-1 min-w-48" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="form-select w-44" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All roles</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <div className="text-sm text-muted-foreground whitespace-nowrap">{filtered.length} user{filtered.length !== 1 ? "s" : ""}</div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground text-sm">Loading users...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground text-sm">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: "hsl(235, 85%, 55%)" }}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-sm">{u.name}</span>
                          {u._id === user?._id && <span className="text-xs text-muted-foreground">(you)</span>}
                        </div>
                      </td>
                      <td className="text-sm text-muted-foreground">{u.email}</td>
                      <td><RoleBadge role={u.role} /></td>
                      <td className="text-sm">{u.department || "—"}</td>
                      <td className="text-sm text-muted-foreground">{formatDate(u.createdAt)}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEdit(u)} className="text-xs px-2.5 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors font-medium">Edit</button>
                          {u._id !== user?._id && (
                            <button onClick={() => handleDelete(u._id)} className="text-xs px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors font-medium">Delete</button>
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

      {/* Edit Modal */}
      <Modal open={!!editUser} onClose={() => setEditUser(null)} title="Edit User">
        {editUser && (
          <div className="space-y-4">
            {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
            <div>
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input type="email" className="form-input" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Role</label>
              <select className="form-select" value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Department</label>
              <select className="form-select" value={editForm.department} onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}>
                <option value="">None</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditUser(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-all" style={{ background: "hsl(235, 85%, 55%)" }}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
