import { getStatusClass, getSeverityClass } from "../../lib/utils";

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusClass(status)}`}>
      {status}
    </span>
  );
}

export function SeverityBadge({ severity }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getSeverityClass(severity)}`}>
      {severity}
    </span>
  );
}

export function RoleBadge({ role }) {
  const styles = {
    staff: "bg-blue-100 text-blue-700",
    secretariat: "bg-purple-100 text-purple-700",
    case_manager: "bg-amber-100 text-amber-700",
    admin: "bg-emerald-100 text-emerald-700",
  };
  const labels = {
    staff: "Staff",
    secretariat: "Secretariat",
    case_manager: "Case Manager",
    admin: "Admin",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[role] || "bg-gray-100 text-gray-700"}`}>
      {labels[role] || role}
    </span>
  );
}
