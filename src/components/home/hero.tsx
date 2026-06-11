type CompetitionStatsResponse = {
  competitionsCount: number;
  operatorsCount: number;
  lastScrapedAt: string | null;
};

function formatRelativeTime(value: string | null): string {
  if (!value) return "—";
  const ts = new Date(value).getTime();
  if (Number.isNaN(ts)) return "—";

  const diffMs = Date.now() - ts;
  const diffMin = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr`;

  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} d`;
}

async function getStats(): Promise<CompetitionStatsResponse | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) return null;

  try {
    const res = await fetch(`${baseUrl}/competitions/stats`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as CompetitionStatsResponse;
  } catch {
    return null;
  }
}

export async function Hero() {
  const stats = await getStats();

  const liveDraws = stats?.competitionsCount ?? 0;
  const operators = stats?.operatorsCount ?? 0;
  const updated = formatRelativeTime(stats?.lastScrapedAt ?? null);

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