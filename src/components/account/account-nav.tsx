"use client";

import {
  IconHeart,
  IconBell,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";
import { cn } from "@/lib/cn";

export type AccountSection = "wishlist" | "alerts" | "searches" | "settings";

type AccountNavProps = {
  active: AccountSection;
  onChange: (section: AccountSection) => void;
};

const sections: { id: AccountSection; label: string; icon: typeof IconHeart }[] = [
  { id: "wishlist", label: "Wishlist", icon: IconHeart },
  { id: "alerts", label: "Alerts", icon: IconBell },
  { id: "searches", label: "Saved searches", icon: IconSearch },
  { id: "settings", label: "Settings", icon: IconSettings },
];

export function AccountNav({ active, onChange }: AccountNavProps) {
  return (
    <nav className="rounded-2xl border border-rr-border bg-rr-surface md:w-52">
      <div className="flex overflow-x-auto md:flex-col">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = active === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onChange(section.id)}
              className={cn(
                "flex min-w-0 shrink-0 items-center gap-2 border-l-2 px-4 py-3 text-left text-sm transition md:w-full md:px-3",
                isActive
                  ? "border-l-rr-green bg-rr-elevated font-medium text-rr-primary"
                  : "border-l-transparent text-rr-secondary hover:bg-rr-elevated hover:text-rr-primary"
              )}
            >
              <Icon size={18} className="shrink-0" />
              <span className="truncate">{section.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
