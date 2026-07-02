import { sanityClient } from "@/sanity/client";
import { SITE_SETTINGS } from "@/sanity/queries";

export const dynamic = "force-dynamic";

type SiteSettingsData = {
  maintenanceMessage?: string | null;
};

export default async function MaintenancePage() {
  const settings = await sanityClient.fetch<SiteSettingsData | null>(SITE_SETTINGS);
  const message =
    settings?.maintenanceMessage?.trim() ||
    "We're carrying out scheduled maintenance and will be back shortly.";

  return (
    <main className="bg-rr-bg">
      <div className="container flex min-h-[70vh] items-center justify-center py-12">
        <div className="w-full max-w-[720px] rounded-2xl border border-rr-border bg-rr-surface px-6 py-10 text-center shadow-sm md:px-10 md:py-14">
          <div className="inline-flex items-center text-xl font-semibold tracking-[-0.4px] text-rr-primary">
            RAFFLE<span className="text-rr-green">RADAR</span>
          </div>
          <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-rr-green">
            Down for maintenance
          </p>
          <h1 className="mt-3 text-3xl font-medium tracking-[-0.03em] text-rr-primary md:text-5xl">
            Down for maintenance
          </h1>
          <p className="mx-auto mt-5 max-w-[560px] text-base leading-7 text-rr-secondary md:text-lg">
            {message}
          </p>
        </div>
      </div>
    </main>
  );
}