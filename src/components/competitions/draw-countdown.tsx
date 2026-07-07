"use client";

import { useEffect, useMemo, useState } from "react";

type DrawCountdownProps = {
  endsAt: string | null;
};

function pluralize(n: number, one: string, many: string) {
  return n === 1 ? one : many;
}

function formatRemaining(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (days >= 1) {
    return `${days} ${pluralize(days, "day", "days")} ${hours} ${pluralize(hours, "hour", "hours")} ${mins} ${pluralize(mins, "min", "mins")}`;
  }

  return `${hours} ${pluralize(hours, "hour", "hours")} ${mins} ${pluralize(mins, "min", "mins")} ${secs} ${pluralize(secs, "sec", "secs")}`;
}

export function DrawCountdown({ endsAt }: DrawCountdownProps) {
  const targetMs = useMemo(() => {
    if (!endsAt) return null;
    const t = new Date(endsAt).getTime();
    return Number.isFinite(t) ? t : null;
  }, [endsAt]);

  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (!targetMs) return;
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [targetMs]);

  if (!targetMs) {
    return <span className="text-rr-muted text-[13px] font-normal whitespace-nowrap md:text-sm">TBC</span>;
  }

  const diff = targetMs - nowMs;

  if (diff <= 0) {
    return <span className="text-rr-muted text-[13px] font-normal whitespace-nowrap md:text-sm">Ended</span>;
  }

  return (
    <span className="text-[13px] whitespace-nowrap md:text-sm">
      {formatRemaining(diff)}
    </span>
  );
}
