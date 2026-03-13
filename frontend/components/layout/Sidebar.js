"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "⊞", roles: ["staff", "secretariat", "case_manager", "admin"] },
  { href: "/submit-case", label: "Submit Case", icon: "✚", roles: ["staff", "secretariat", "admin"] },
  { href: "/cases", label: "Cases", icon: "◫", roles: ["staff", "secretariat", "case_manager", "admin"] },
  { href: "/polls", label: "Polls", icon: "◉", roles: ["staff", "secretariat", "case_manager", "admin"] },
  { href: "/public-hub", label: "Public Hub", icon: "◈", roles: ["staff", "secretariat", "case_manager", "admin"] },
  { href: "/analytics", label: "Analytics", icon: "▨", roles: ["admin", "secretariat"] },
  { href: "/users", label: "Users", icon: "◙", roles: ["admin"] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const visibleItems = NAV_ITEMS.filter((item) => user && item.roles.includes(user.role));

  const roleLabel = {
    staff: "Staff",
    secretariat: "Secretariat",
    case_manager: "Case Manager",
    admin: "Administrator",
  };

  return (
    <aside className="sidebar w-64 min-h-screen flex flex-col fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="px-6 py-5 border-b" style={{ borderColor: "hsl(225, 25%, 18%)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "hsl(235, 85%, 55%)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg" style={{ fontFamily: "Syne, sans-serif" }}>NeoConnect</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "hsl(220, 15%, 45%)" }}>
          Navigation
        </p>
        {visibleItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href} className={`sidebar-link ${active ? "active" : ""}`}>
              <span className="text-base w-5 text-center">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div className="px-4 py-4 border-t" style={{ borderColor: "hsl(225, 25%, 18%)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: "hsl(235, 85%, 55%)" }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs truncate" style={{ color: "hsl(220, 15%, 50%)" }}>{roleLabel[user?.role]}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full text-left text-xs px-3 py-2 rounded-lg transition-colors hover:bg-white/10"
          style={{ color: "hsl(220, 15%, 55%)" }}
        >
          Sign out →
        </button>
      </div>
    </aside>
  );
}
