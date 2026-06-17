export function formatValueRatio(ratio: number | string | null | undefined): string {
  if (ratio === null || ratio === undefined) return "—";

  const n = Number(ratio);

  if (!Number.isFinite(n)) return "—";
  if (n > 5) return "5+";

  return n.toFixed(2);
}

export function valueRatioColor(ratio: number | string | null | undefined): string {
  if (ratio === null || ratio === undefined) return "text-rr-muted";

  const n = Number(ratio);

  if (!Number.isFinite(n)) return "text-rr-muted";
  if (n < 0.5) return "text-red-500";
  if (n < 1.0) return "text-amber-500";

  return "text-rr-green";
}