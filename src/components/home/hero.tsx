import { formatDistanceToNow } from "date-fns";
import { getStats } from "@/lib/api";

function formatRelativeTime(value: string | null): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return formatDistanceToNow(date, { addSuffix: true })
    .replace("less than a minute ago", "just now")
    .replace(" minute ago", " min ago")
    .replace(" minutes ago", " min ago")
    .replace(" hour ago", " hr ago")
    .replace(" hours ago", " hr ago")
    .replace(" day ago", " d ago")
    .replace(" days ago", " d ago");
}

export async function Hero() {
  const stats = await getStats();

  const liveDraws = stats?.competitionsCount ?? 0;
  const operators = stats?.operatorsCount ?? 0;
  const updated = formatRelativeTime(stats.lastUpdatedAt);

  return (
    <section className="bg-gradient-to-b from-rr-surface to-rr-bg">
      <div className="container py-10 md:py-14 text-center">
        <p className="text-[13px] font-medium text-rr-green">
          The UK&apos;s competition intelligence hub
        </p>

        <h1 className="mt-2 mx-auto max-w-3xl text-3xl md:text-5xl font-semibold tracking-[-0.02em] text-rr-primary leading-[1.05]">
          Find better draws. <span className="text-rr-green">Win smarter.</span>
        </h1>

        <p className="mt-3 mx-auto max-w-[650px] text-[13px] md:text-sm text-rr-muted">
          Track undersold competitions, spot real value and enter at the right time.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-6">
          <div>
            <p className="text-rr-green text-lg font-semibold leading-none">
              {liveDraws}
            </p>
            <p className="mt-1 text-[12px] text-rr-muted">Live draws</p>
          </div>

          <div className="h-8 w-px bg-rr-border" />

          <div>
            <p className="text-rr-green text-lg font-semibold leading-none">
              {operators}
            </p>
            <p className="mt-1 text-[12px] text-rr-muted">Operators</p>
          </div>

          <div className="h-8 w-px bg-rr-border" />

          <div>
            <p className="text-rr-green text-lg font-semibold leading-none">
              {updated}
            </p>
            <p className="mt-1 text-[12px] text-rr-muted">Last updated</p>
          </div>
        </div>
      </div>
    </section>
  );
}