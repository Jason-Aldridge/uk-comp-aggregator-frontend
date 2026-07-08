import Link from "next/link";
import {
  IconCar,
  IconCurrencyPound,
  IconGift,
  IconClockHour4,
  IconDeviceLaptop,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { CompetitionImage } from "@/components/ui/CompetitionImage";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { Competition } from "@/types/competition";
import {
  getEndedLabel,
  getStatusBadge,
  getEndsLabel,
} from "@/lib/competition-display";

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
  variant?: "default" | "ended";
}

const ticketCountFormatter = new Intl.NumberFormat("en-GB");

export function CompetitionCard({ competition, featured, variant = "default" }: Props) {
  const {
    id,
    prize,
    imageUrl,
    ticketPrice,
    ticketsTotal,
    ticketsLeft,
    percentSold,
    finalPercentSold,
    endsAt,
    closedAt,
    category,
    instantPrizes,
  } = competition;

  const isEnded = variant === "ended";
  const percentRaw = isEnded ? finalPercentSold ?? percentSold : percentSold;
  const percent =
    typeof percentRaw === "number"
      ? Number.isFinite(percentRaw)
        ? percentRaw
        : null
      : typeof percentRaw === "string"
        ? Number.isFinite(Number.parseFloat(percentRaw))
          ? Number.parseFloat(percentRaw)
          : null
        : null;
  const price = ticketPrice !== null ? Number(ticketPrice) : null;
  const statusBadge = isEnded ? null : getStatusBadge(endsAt, featured, null);
  const timingLabel = isEnded ? getEndedLabel(endsAt, closedAt) : getEndsLabel(endsAt);
  const badgeShowsTime =
    statusBadge?.variant === "red" || statusBadge?.variant === "amber";

  const cardClassName = [
    "block overflow-hidden rounded-[10px] border",
    "bg-rr-surface border-rr-border",
    featured ? "border-rr-green-border" : "",
    isEnded ? "cursor-default" : "cursor-pointer transition-opacity hover:opacity-90",
  ].join(" ");

  const cardContent = (
    <>
      <div className="relative flex h-[150px] items-center justify-center bg-rr-elevated">
        {imageUrl ? (
          <CompetitionImage
            src={imageUrl}
            alt={prize}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
            unoptimized
          />
        ) : (
          <PlaceholderIcon category={category} />
        )}
        <div className="absolute inset-x-1.5 top-1.5 flex flex-col items-start gap-1 md:inset-x-auto md:left-1.5 md:right-1.5 md:flex-row md:items-start md:justify-between">
          <span className="max-w-full md:max-w-[calc(100%-90px)]">
            <Badge variant="operator">
              {competition.operator?.name ?? "Unknown"}
            </Badge>
          </span>
          {statusBadge && (
            <span className="self-end md:self-auto">
              <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
            </span>
          )}
        </div>
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
            {isEnded
              ? timingLabel ?? "Ended"
              : typeof ticketsLeft === "number"
                ? `${ticketCountFormatter.format(ticketsLeft)} left`
                : typeof ticketsTotal === "number"
                  ? `${ticketCountFormatter.format(ticketsTotal)} tickets`
                  : "— tickets"}
          </span>
        </div>
        {percent !== null ? <ProgressBar value={percent} /> : null}
        <div className="flex justify-between mt-1">
          {percent !== null ? (
            <span className="text-[10px] text-rr-muted">
              {percent.toFixed(0)}% sold
              {timingLabel && !isEnded && !badgeShowsTime ? ` · ${timingLabel}` : ""}
            </span>
          ) : timingLabel && !isEnded && !badgeShowsTime ? (
            <span className="text-[10px] text-rr-muted">{timingLabel}</span>
          ) : (
            <span />
          )}
          {isEnded ? (
            <Badge variant="neutral">Draw complete</Badge>
          ) : instantPrizes ? (
            <span className="text-[10px] font-medium text-rr-green">Auto draw</span>
          ) : null}
        </div>
      </div>
    </>
  );

  if (isEnded) {
    return <div className={cardClassName}>{cardContent}</div>;
  }

  return (
    <Link href={`/competitions/${id}`} className={cardClassName}>
      {cardContent}
    </Link>
  );
}