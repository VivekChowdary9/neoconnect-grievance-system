"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import api from "../../services/api";
import StatCard from "../../components/ui/StatCard";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, CartesianGrid
} from "recharts";

const BAR_COLORS = ["#4f46e5", "#7c3aed", "#2563eb", "#0891b2", "#059669", "#d97706", "#dc2626"];
const STATUS_COLORS = {
  New: "#3b82f6", Assigned: "#eab308", "In Progress": "#8b5cf6",
  Pending: "#f97316", Resolved: "#10b981", Escalated: "#ef4444"
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-border rounded-xl p-3 shadow-lg text-sm">
        <p className="font-semibold mb-1">{label}</p>
        <p style={{ color: payload[0].fill }}>{payload[0].value} cases</p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== "admin" && user.role !== "secretariat") {
      router.push("/dashboard");
      return;
    }
    fetchAnalytics();
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      const { data: d } = await api.get("/analytics/cases");
      setData(d);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (loading) return <DashboardLayout><div className="p-12 text-center text-muted-foreground text-sm">Loading analytics...</div></DashboardLayout>;
  if (!data) return <DashboardLayout><div className="p-12 text-center text-muted-foreground text-sm">No data available.</div></DashboardLayout>;

  const pieData = data.byStatus.map((s) => ({
    name: s.name,
    value: s.count,
    fill: STATUS_COLORS[s.name] || "#6b7280"
  }));

  const resolutionRate = data.total > 0 ? Math.round((data.resolved / data.total) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Cases" value={data.total} icon="◫" color="#4f46e5" subtitle="All time" />
          <StatCard title="Resolved" value={data.resolved} icon="✓" color="#10b981" subtitle={`${resolutionRate}% resolution rate`} />
          <StatCard title="Escalated" value={data.escalated} icon="⚡" color="#ef4444" subtitle="Needs attention" />
          <StatCard title="Hotspots" value={data.hotspots?.length || 0} icon="⚠" color="#f59e0b" subtitle="Dept+Category clusters" />
        </div>

        {/* Hotspots alert */}
        {data.hotspots?.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <h3 className="font-bold text-amber-800 mb-3 text-sm" style={{ fontFamily: "Syne, sans-serif" }}>⚠ Hotspot Departments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.hotspots.map((h, i) => (
                <div key={i} className="bg-white border border-amber-200 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{h.department}</p>
                      <p className="text-xs text-muted-foreground">{h.category}</p>
                    </div>
                    <span className="text-lg font-bold text-amber-600">{h.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* By Department */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h3 className="font-bold mb-5" style={{ fontFamily: "Syne, sans-serif" }}>Cases by Department</h3>
            {data.byDepartment.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.byDepartment} margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {data.byDepartment.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* By Category */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h3 className="font-bold mb-5" style={{ fontFamily: "Syne, sans-serif" }}>Cases by Category</h3>
            {data.byCategory.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.byCategory} margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {data.byCategory.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* By Status - Pie */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h3 className="font-bold mb-5" style={{ fontFamily: "Syne, sans-serif" }}>Cases by Status</h3>
            {pieData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(v, n) => [v + " cases", n]} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Resolution rate card */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h3 className="font-bold mb-5" style={{ fontFamily: "Syne, sans-serif" }}>Resolution Rate</h3>
            <div className="flex flex-col items-center justify-center h-48 gap-4">
              <div className="relative w-36 h-36">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#10b981" strokeWidth="12"
                    strokeDasharray={`${resolutionRate * 3.14} 314`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold" style={{ fontFamily: "Syne, sans-serif", color: "#10b981" }}>{resolutionRate}%</span>
                  <span className="text-xs text-muted-foreground">resolved</span>
                </div>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                {data.resolved} of {data.total} total cases resolved
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
