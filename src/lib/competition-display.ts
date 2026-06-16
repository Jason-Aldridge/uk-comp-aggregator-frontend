export function getUtcDateValue(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export type StatusBadge = {
  variant: "red" | "amber" | "green";
  label: string;
} | null;

export function getStatusBadge(
  endsAt: string | null,
  featured: boolean | undefined,
  valueRatio: number | string | null,
): StatusBadge {
  if (endsAt) {
    const endDate = new Date(endsAt);
    if (!Number.isNaN(endDate.getTime())) {
      const now = new Date();
      const daysLeft = Math.ceil(
        (getUtcDateValue(endDate) - getUtcDateValue(now)) / 86400000,
      );

      if (daysLeft === 0) {
        const timeStr = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Europe/London",
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        }).format(endDate);
        
        return { variant: "red", label: `Ends today ${timeStr}` };
      }

      if (daysLeft > 0 && daysLeft <= 7) {
        return {
          variant: "amber",
          label: `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`,
        };
      }
    }
  }

  if (featured) {
    return { variant: "green", label: "Best value" };
  }

  if (valueRatio) {
    return {
      variant: "green",
      label: `Value ${Number(valueRatio).toFixed(1)}`,
    };
  }

  return null;
}

export function getEndsLabel(endsAt: string | null): string | null {
  if (!endsAt) return null;
  const endDate = new Date(endsAt);
  if (Number.isNaN(endDate.getTime())) return null;

  const now = new Date();
  const daysLeft = Math.ceil(
    (getUtcDateValue(endDate) - getUtcDateValue(now)) / 86400000,
  );

  if (daysLeft <= 0) return "Ends today";
  if (daysLeft === 1) return "Ends tomorrow";
  return `Ends in ${daysLeft} days`;
}

export function formatDateInLondon(date: Date | string | null): string {
  if (!date) return "—";
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(dateObj.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).format(dateObj);
}
export function getEndsTimeLabel(endsAt: string | null): string | null {
  if (!endsAt) return null;
  
  const endDate = new Date(endsAt);
  if (Number.isNaN(endDate.getTime())) return null;

  const now = new Date();
  const daysLeft = Math.ceil(
    (getUtcDateValue(endDate) - getUtcDateValue(now)) / 86400000,
  );

  if (daysLeft === 0) {
    const timeStr = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/London",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    }).format(endDate);
    
    return `Ends today ${timeStr}`;
  }

  return null;
}