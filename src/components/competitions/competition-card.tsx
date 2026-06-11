import Image from "next/image";
import Link from "next/link";
import {
  IconCar,
  IconCurrencyPound,
  IconGift,
  IconClockHour4,
  IconDeviceLaptop,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { Competition } from "@/types/competition";

function PlaceholderIcon({ category }: { category: string | null }) {
  const cls = "text-rr-border";
  const size = 40;

  switch (category?.toLowerCase()) {
    case "cars":
      return <IconCar size={size} className={cls} />;
    case "watches":
      return <IconClockHour4 size={size} className={cls} />;
    case "tech":
      return <IconDeviceLaptop size={size} className={cls} />;
    case "cash":
      return <IconCurrencyPound size={size} className={cls} />;
    default:
      return <IconGift size={size} className={cls} />;
  }
}

interface Props {
  competition: Competition;
  featured?: boolean;
}

const ticketCountFormatter = new Intl.NumberFormat("en-GB");

function getUtcDateValue(date: Date) {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function getStatusBadge(
  endsAt: string | null,
  featured: boolean | undefined,
  valueRatio: number | string | null,
) {
  if (endsAt) {
    const endDate = new Date(endsAt);
    if (!Number.isNaN(endDate.getTime())) {
      const now = new Date();
      const daysLeft = Math.ceil(
        (getUtcDateValue(endDate) - getUtcDateValue(now)) / 86400000,
      );

      if (daysLeft === 0) {
        return { variant: "red" as const, label: "Ends today" };
      }

      if (daysLeft > 0 && daysLeft <= 7) {
        return {
          variant: "amber" as const,
          label: `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`,
        };
      }
    }
  }

  if (featured) {
    return { variant: "green" as const, label: "Best value" };
  }

  if (valueRatio) {
    return {
      variant: "green" as const,
      label: `Value ${Number(valueRatio).toFixed(1)}`,
    };
  }

  return null;
}

export function CompetitionCard({ competition, featured }: Props) {
  const {
    id,
    prize,
    imageUrl,
    ticketPrice,
    ticketsTotal,
    percentSold,
    endsAt,
    category,
    instantPrizes,
    valueRatio,
  } = competition;

  const percent = percentSold ? Number(percentSold) : 0;
  const price = ticketPrice ? Number(ticketPrice) : null;
  const statusBadge = getStatusBadge(endsAt, featured, valueRatio);

  return (
    <Link
      href={`/competitions/${id}`}
      className={[
        "block rounded-[10px] overflow-hidden border cursor-pointer transition-opacity hover:opacity-90",
        "bg-rr-surface border-rr-border",
        featured ? "border-rr-green-border" : "",
      ].join(" ")}
    >
      <div className="relative h-[110px] bg-rr-elevated flex items-center justify-center">
        {imageUrl ? (
          <Image src={imageUrl} alt={prize} fill className="object-cover" />
        ) : (
          <PlaceholderIcon category={category} />
        )}
        <span className="absolute top-1.5 left-1.5">
          <Badge variant="operator">
            {competition.operator?.name ?? "Unknown"}
          </Badge>
        </span>
        {statusBadge && (
          <span className="absolute top-1.5 right-1.5">
            <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
          </span>
        )}
      </div>
      <div className="p-[9px]">
        <p className="text-[11.5px] font-medium text-rr-text-primary leading-[1.35] h-8 overflow-hidden mb-1.5">
          {prize}
        </p>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[13px] font-medium text-rr-green">
            {price === 0 ? "FREE" : price ? `£${price.toFixed(2)}` : "—"}
          </span>
          <span className="text-[10px] text-rr-muted">
            {typeof ticketsTotal === "number"
              ? `${ticketCountFormatter.format(ticketsTotal)} tickets`
              : "— tickets"}
          </span>
        </div>
        <ProgressBar value={percent} />
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-rr-muted">
            {percent.toFixed(0)}% sold
          </span>
          {instantPrizes && (
            <span className="text-[10px] text-rr-green font-medium">
              Auto draw
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}