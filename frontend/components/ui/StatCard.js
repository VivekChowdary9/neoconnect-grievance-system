export default function StatCard({ title, value, subtitle, color = "#4f46e5", icon }) {
  return (
    <div className="stat-card animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0" style={{ background: color }}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold mb-1" style={{ fontFamily: "Syne, sans-serif" }}>{value ?? "—"}</div>
      <div className="text-sm font-medium text-foreground">{title}</div>
      {subtitle && <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>}
    </div>
  );
}
