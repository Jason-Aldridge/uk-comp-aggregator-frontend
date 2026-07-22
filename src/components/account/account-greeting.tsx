"use client";

import { useAuth } from "@/contexts/auth-context";

function getInitials(value: string): string {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0]?.[0] ?? "";
  const second = (parts.length > 1 ? parts[1]?.[0] : parts[0]?.[1]) ?? "";
  return (first + second).toUpperCase() || "?";
}

function formatMemberSince(dateValue: string | Date | undefined): string {
  if (!dateValue) return "";
  const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();
  return `${month} ${year}`;
}

export function AccountGreeting() {
  const { user } = useAuth();

  const label = user?.displayName?.trim() || user?.email || "";
  const initials = label
    ? getInitials(label.includes("@") ? label.split("@")[0] : label)
    : "?";

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-rr-green bg-rr-green-bg text-base font-medium text-rr-green">
        {initials}
      </div>
      <div className="min-w-0">
        <h2 className="text-lg font-medium text-rr-primary">
          Hi, {user?.displayName || user?.email || "Guest"}
        </h2>
        <p className="text-sm text-rr-secondary">
          Member since {formatMemberSince(user?.createdAt)}
        </p>
      </div>
    </div>
  );
}
