"use client";
import { useAuth } from "../../hooks/useAuth";
import { usePathname } from "next/navigation";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/submit-case": "Submit a Case",
  "/cases": "Case Management",
  "/polls": "Polls & Voting",
  "/public-hub": "Public Hub",
  "/analytics": "Analytics",
  "/users": "User Management",
};

export default function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const title = Object.entries(PAGE_TITLES).find(([key]) => pathname === key || pathname.startsWith(key + "/"))?.[1] || "NeoConnect";

  const roleBadge = {
    staff: { label: "Staff", color: "#3b82f6" },
    secretariat: { label: "Secretariat", color: "#8b5cf6" },
    case_manager: { label: "Case Manager", color: "#f59e0b" },
    admin: { label: "Admin", color: "#10b981" },
  };
  const badge = roleBadge[user?.role] || roleBadge.staff;

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-20">
      <div>
        <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "Syne, sans-serif" }}>{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-white" style={{ background: badge.color }}>
          {badge.label}
        </span>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: "hsl(235, 85%, 55%)" }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
