"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/ui/StatCard";
import { StatusBadge, SeverityBadge } from "../../components/ui/Badges";
import { caseService } from "../../services/caseService";
import { useAuth } from "../../hooks/useAuth";
import { formatDate } from "../../lib/utils";
import Link from "next/link";
import api from "../../services/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const casesData = await caseService.getCases();
        setCases(casesData);
        if (user?.role === "admin" || user?.role === "secretariat") {
          const { data } = await api.get("/analytics/cases");
          setAnalytics(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  const stats = {
    total: cases.length,
    new: cases.filter((c) => c.status === "New").length,
    inProgress: cases.filter((c) => ["Assigned", "In Progress", "Pending"].includes(c.status)).length,
    resolved: cases.filter((c) => c.status === "Resolved").length,
    escalated: cases.filter((c) => c.status === "Escalated").length,
  };

  const recentCases = [...cases].slice(0, 5);

  const adminStats = analytics ? [
    { title: "Total Cases", value: analytics.total, icon: "◫", color: "#4f46e5", subtitle: "All time" },
    { title: "Resolved", value: analytics.resolved, icon: "✓", color: "#10b981", subtitle: "Successfully closed" },
    { title: "Escalated", value: analytics.escalated, icon: "⚡", color: "#ef4444", subtitle: "Needs attention" },
    { title: "Active Hotspots", value: analytics.hotspots?.length || 0, icon: "⚠", color: "#f59e0b", subtitle: "5+ cases same dept/category" },
  ] : [];

  const staffStats = [
    { title: "My Cases", value: stats.total, icon: "◫", color: "#4f46e5", subtitle: "Submitted by you" },
    { title: "New", value: stats.new, icon: "✦", color: "#3b82f6", subtitle: "Awaiting assignment" },
    { title: "In Progress", value: stats.inProgress, icon: "↻", color: "#8b5cf6", subtitle: "Being handled" },
    { title: "Resolved", value: stats.resolved, icon: "✓", color: "#10b981", subtitle: "Closed cases" },
  ];

  const displayStats = (user?.role === "admin" || user?.role === "secretariat") && analytics ? adminStats : staffStats;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome */}
        <div className="bg-white rounded-2xl p-6 border border-border flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
              Good {getTimeOfDay()}, {user?.name?.split(" ")[0]} 👋
            </h2>
            <p className="text-muted-foreground text-sm">Here&apos;s what&apos;s happening in your workspace today.</p>
          </div>
          {user?.role !== "case_manager" && (
            <Link href="/submit-case" className="px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all" style={{ background: "hsl(235, 85%, 55%)" }}>
              + Submit Case
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {displayStats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Hotspots alert */}
        {analytics?.hotspots?.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-amber-600 font-bold text-sm">⚠ Active Hotspots Detected</span>
            </div>
            <div className="space-y-1">
              {analytics.hotspots.map((h, i) => (
                <div key={i} className="text-sm text-amber-700">
                  <span className="font-semibold">{h.department}</span> — {h.category}: <span className="font-bold">{h.count} cases</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent cases */}
        <div className="bg-white rounded-2xl border border-border">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-base" style={{ fontFamily: "Syne, sans-serif" }}>Recent Cases</h3>
            <Link href="/cases" className="text-sm font-medium hover:underline" style={{ color: "hsl(235, 85%, 55%)" }}>View all →</Link>
          </div>
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
          ) : recentCases.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground text-sm mb-3">No cases yet.</p>
              {user?.role !== "case_manager" && (
                <Link href="/submit-case" className="text-sm font-semibold hover:underline" style={{ color: "hsl(235, 85%, 55%)" }}>Submit your first case →</Link>
              )}
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
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCases.map((c) => (
                    <tr key={c._id}>
                      <td>
                        <Link href={`/cases/${c._id}`} className="font-mono text-xs font-semibold hover:underline" style={{ color: "hsl(235, 85%, 55%)" }}>
                          {c.trackingId}
                        </Link>
                      </td>
                      <td>{c.category}</td>
                      <td>{c.department}</td>
                      <td><SeverityBadge severity={c.severity} /></td>
                      <td><StatusBadge status={c.status} /></td>
                      <td className="text-muted-foreground">{formatDate(c.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
