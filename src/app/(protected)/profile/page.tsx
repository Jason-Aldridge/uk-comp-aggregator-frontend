"use client";

import { useState } from "react";
import { AccountGreeting } from "@/components/account/account-greeting";
import { AccountNav, type AccountSection } from "@/components/account/account-nav";
import { SettingsSection } from "@/components/account/settings-section";

function WishlistPlaceholder() {
  return (
    <div className="rounded-2xl border border-rr-border bg-rr-surface p-6">
      <h3 className="mb-2 text-base font-medium text-rr-primary">Wishlist</h3>
      <p className="text-sm text-rr-secondary">Saved competitions will appear here.</p>
    </div>
  );
}

function AlertsPlaceholder() {
  return (
    <div className="rounded-2xl border border-rr-border bg-rr-surface p-6">
      <h3 className="mb-2 text-base font-medium text-rr-primary">Alerts</h3>
      <p className="text-sm text-rr-secondary">Alert preferences will appear here.</p>
    </div>
  );
}

function SavedSearchesPlaceholder() {
  return (
    <div className="rounded-2xl border border-rr-border bg-rr-surface p-6">
      <h3 className="mb-2 text-base font-medium text-rr-primary">Saved searches</h3>
      <p className="text-sm text-rr-secondary">Saved searches will appear here.</p>
    </div>
  );
}


function SectionContent({ section }: { section: AccountSection }) {
  switch (section) {
    case "wishlist":
      return <WishlistPlaceholder />;
    case "alerts":
      return <AlertsPlaceholder />;
    case "searches":
      return <SavedSearchesPlaceholder />;
    case "settings":
      return <SettingsSection />;
    default:
      return <WishlistPlaceholder />;
  }
}

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState<AccountSection>("wishlist");

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-6">
        <AccountGreeting />
      </div>

      <div className="grid gap-6 md:grid-cols-[14rem_1fr]">
        <AccountNav active={activeSection} onChange={setActiveSection} />
        <SectionContent section={activeSection} />
      </div>
    </div>
  );
}
