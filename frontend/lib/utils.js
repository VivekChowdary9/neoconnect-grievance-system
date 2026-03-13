import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getStatusClass(status) {
  const map = {
    New: "badge-new",
    Assigned: "badge-assigned",
    "In Progress": "badge-in-progress",
    Pending: "badge-pending",
    Resolved: "badge-resolved",
    Escalated: "badge-escalated",
  };
  return map[status] || "bg-gray-100 text-gray-700";
}

export function getSeverityClass(severity) {
  const map = {
    Low: "badge-low",
    Medium: "badge-medium",
    High: "badge-high",
  };
  return map[severity] || "bg-gray-100 text-gray-700";
}
