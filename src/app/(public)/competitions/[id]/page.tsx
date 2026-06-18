import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  IconCar,
  IconCurrencyPound,
  IconGift,
  IconClockHour4,
  IconDeviceLaptop,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { EnterButton } from "@/components/competitions/enter-button";
import { SaveActions } from "@/components/competitions/save-actions";
import { TicketSalesChart } from "@/components/competitions/ticket-sales-chart";
import { CompetitionCard } from "@/components/competitions/competition-card";
import {
  getCompetition,
  getCompetitionHistory,
  getCompetitions,
  type CompetitionDetail,
} from "@/lib/api";
import type { Competition } from "@/types/competition";
import { formatDateInLondon, getEndsTimeLabel } from "@/lib/competition-display";

type CompetitionHistory = {
  scrapedAt: string;
  ticketsSold: number;
  percentSold: number;
};

const MIN_VR_SAMPLE = 5;

function PlaceholderIcon({ category }: { category: string | null }) {
  const cls = "text-rr-border";
  const size = 80;

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const competition = await getCompetition(id);

    if (!competition || typeof competition !== "object") {
      return {
        title: "Competition Not Found",
        description: "The requested competition could not be found.",
      };
    }

    const comp = competition as CompetitionDetail;
    const { prize } = comp;
    const metaDescription = `Win ${prize} in this UK prize draw competition.`;

    return {
      title: prize,
      description: metaDescription,
      openGraph: { title: prize, description: metaDescription, type: "website" },
      twitter: {
        card: "summary_large_image",
        title: prize,
        description: metaDescription,
      },
    };
  } catch {
    return {
      title: "Competition Not Found",
      description: "The requested competition could not be found.",
    };
  }
}

async function fetchCompetitionData(id: string) {
  try {
    const competitionPromise = getCompetition(id);
    const historyPromise = getCompetitionHistory(id);
    const moreFromOperatorPromise = competitionPromise.then((value) => {
      if (!value || typeof value !== "object") return [];
      const comp = value as Competition;
      const website = comp.operator?.baseUrl;
      if (!website) return [];

      return getCompetitions({
        website,
        sortBy: "valueRatio",
        sortOrder: "desc",
        limit: 5,
      });
    });

    const [competition, historyData, moreFromOperatorData] = await Promise.all([
      competitionPromise,
      historyPromise,
      moreFromOperatorPromise,
    ]);

    if (!competition || typeof competition !== "object") {
      notFound();
    }

    const comp = competition as Competition;
    const {
      prize,
      imageUrl,
      ticketPrice,
      ticketsTotal,
      ticketsLeft,
      percentSold,
      endsAt,
      category,
      instantPrizes,
      valueRatio,
      operator,
      prizeValue,
      cashAlternative,
      maxPerPerson,
      numWinners,
      prizeMake,
      prizeModel,
      description,
      sourceUrl,
    } = comp;

    const totalTicketsValue = ticketsTotal ?? 0;
    const remainingTickets = ticketsLeft ?? totalTicketsValue;
    const soldTickets = totalTicketsValue - remainingTickets;
    const ticketsSoldForOdds =
      typeof ticketsTotal === "number" && typeof ticketsLeft === "number"
        ? Math.max(0, ticketsTotal - ticketsLeft)
        : null;
    const percentValue = percentSold ? Number(percentSold) : 0;
    const priceValue = ticketPrice ? Number(ticketPrice) : null;

    let history: CompetitionHistory[] = [];
    if (Array.isArray(historyData)) {
      history = historyData as CompetitionHistory[];
    }

    const moreFromOperator = Array.isArray(moreFromOperatorData)
      ? (moreFromOperatorData as Competition[])
          .filter((c) => c.id !== id)
          .slice(0, 4)
      : [];

    return {
      prize,
      imageUrl,
      endsAt,
      category,
      instantPrizes,
      valueRatio,
      operator,
      prizeValue,
      cashAlternative,
      maxPerPerson,
      numWinners,
      prizeMake,
      prizeModel,
      description,
      sourceUrl,
      totalTicketsValue,
      remainingTickets,
      soldTickets,
      ticketsSoldForOdds,
      percentValue,
      priceValue,
      history,
      moreFromOperator,
    };
  } catch (error) {
    console.error("Failed to load competition page:", error);
    notFound();
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await fetchCompetitionData(id);

  if (!data) {
    notFound();
  }

  const {
    prize,
    imageUrl,
    category,
    operator,
    endsAt,
    priceValue,
    totalTicketsValue,
    remainingTickets,
    soldTickets,
    ticketsSoldForOdds,
    percentValue,
    instantPrizes,
    prizeValue,
    cashAlternative,
    maxPerPerson,
    numWinners,
    prizeMake,
    prizeModel,
    description,
    sourceUrl,
    history,
    moreFromOperator,
  } = data;

  const prizeValueNum = prizeValue ? Number(prizeValue) : null;
  const cashAltNum = cashAlternative ? Number(cashAlternative) : null;
  const makeModel = [prizeMake, prizeModel].filter(Boolean).join(" / ");
  const winnersForOdds =
    typeof numWinners === "number" && numWinners > 0 ? numWinners : 1;
  const liveOdds =
    ticketsSoldForOdds && ticketsSoldForOdds > 0
      ? Math.max(1, Math.round(ticketsSoldForOdds / winnersForOdds))
      : null;
  const maxTicketsOdds =
    maxPerPerson !== null && maxPerPerson > 0 && totalTicketsValue > 0
      ? Math.max(1, Math.round(totalTicketsValue / (maxPerPerson * winnersForOdds)))
      : null;
  const operatorVrText =
    operator &&
    operator.avgVr !== null &&
    operator.vrSampleSize !== null &&
    operator.vrSampleSize >= MIN_VR_SAMPLE
      ? `${operator.name} VR: ${Number(operator.avgVr).toFixed(1)}`
      : operator
        ? `${operator.name} VR: Not enough data yet`
        : null;

  return (
    <main>
      <div className="container py-6 md:py-8">
        <div className="mb-4">
          <nav className="flex items-center gap-2 text-sm text-rr-muted">
            <Link href="/" className="hover:text-rr-primary transition-colors">
              Home
            </Link>
            <span>›</span>
            <Link
              href="/competitions"
              className="hover:text-rr-primary transition-colors"
            >
              Competitions
            </Link>
            <span>›</span>
            <span className="text-rr-secondary">{prize}</span>
          </nav>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 md:gap-8 md:items-start">
          <div className="order-1 flex flex-col gap-8">
            <div className="relative rounded-[10px] overflow-hidden border border-rr-border bg-rr-elevated h-[300px] md:h-[350px] flex items-center justify-center">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={prize}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <PlaceholderIcon category={category} />
              )}
            </div>

            <div className="hidden md:block">
              <h2 className="text-lg font-semibold text-rr-primary mb-4">
                Ticket sales history
              </h2>
              <div className="rounded-lg border border-rr-border bg-rr-elevated p-4">
                <TicketSalesChart history={history} />
              </div>
            </div>
          </div>

          <div className="order-2 mt-8 md:mt-0">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {operator && <Badge variant="operator">{operator.name}</Badge>}
              {operatorVrText && (
                <span className="inline-flex items-center gap-1 text-xs text-rr-muted">
                  <span>{operatorVrText}</span>
                  <InfoTooltip text="Typical tickets-value vs prize across this operator's competitions. Lower = more player-friendly." />
                </span>
              )}
              {category && (
                <Badge variant="neutral" className="text-rr-muted bg-rr-elevated">
                  {category}
                </Badge>
              )}
              {getEndsTimeLabel(endsAt) && (
                <Badge variant="red">{getEndsTimeLabel(endsAt)}</Badge>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-semibold text-rr-primary mb-6">
              {prize}
            </h1>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-lg border border-rr-border bg-rr-elevated p-4">
                <p className="text-xs text-rr-muted mb-1">Ticket price</p>
                <p className="text-xl font-semibold text-rr-green">
                  {priceValue === 0
                    ? "FREE"
                    : priceValue
                      ? `£${priceValue.toFixed(2)}`
                      : "—"}
                </p>
              </div>
              <div className="rounded-lg border border-rr-border bg-rr-elevated p-4">
                <p className="text-xs text-rr-muted mb-1">Prize value</p>
                <p className="text-xl font-semibold text-rr-primary">
                  {prizeValueNum
                    ? `£${prizeValueNum.toLocaleString("en-GB")}`
                    : "—"}
                </p>
              </div>
              <div className="rounded-lg border border-rr-border bg-rr-elevated p-4">
                <p className="text-xs text-rr-muted mb-1">Total tickets</p>
                <p className="text-xl font-semibold text-rr-primary">
                  {totalTicketsValue
                    ? totalTicketsValue.toLocaleString("en-GB")
                    : "—"}
                </p>
              </div>
              <div className="rounded-lg border border-rr-border bg-rr-elevated p-4">
                <p className="text-xs text-rr-muted mb-1">Max per person</p>
                <p className="text-xl font-semibold text-rr-primary">
                  {maxPerPerson ?? "—"}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-rr-border bg-rr-elevated p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-rr-secondary">
                  {soldTickets.toLocaleString("en-GB")} sold
                </span>
                <span className="text-sm text-rr-secondary">
                  {remainingTickets.toLocaleString("en-GB")} remaining
                </span>
              </div>
              <ProgressBar value={percentValue} className="mb-2" />
              <div>
                <span className="text-sm font-medium text-rr-green">
                  {percentValue.toFixed(0)}% sold
                </span>
              </div>

              {!instantPrizes && (
                <div className="mt-3 space-y-2">
                  <div>
                    <p className="flex items-center gap-1 text-xs text-rr-muted">
                      <span className="text-rr-muted">
                        Live odds
                        <InfoTooltip text="Your chance per ticket based on how many have sold so far. This shortens as more tickets sell before the draw." />
                      </span>
                    </p>
                    <p className="text-sm font-medium text-rr-primary">
                      {liveOdds
                        ? `1 in ${liveOdds.toLocaleString("en-GB")}`
                        : "No tickets sold yet"}
                    </p>
                    <p className="text-xs text-rr-muted">
                      based on tickets sold so far
                    </p>
                  </div>
                  {maxPerPerson !== null && (
                    <div>
                      <p className="text-sm font-medium text-rr-primary">
                        {maxTicketsOdds
                          ? `1 in ${maxTicketsOdds.toLocaleString("en-GB")}`
                          : "No tickets sold yet"}
                      </p>
                      <p className="text-xs text-rr-muted">
                        with max {maxPerPerson} tickets
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3 mb-6">
              <EnterButton
                competitionId={id}
                sourceUrl={sourceUrl}
                operatorName={operator?.name ?? "Operator"}
              />
              <SaveActions />
            </div>

            {(cashAltNum || endsAt) && (
              <div className="rounded-lg border border-rr-border bg-rr-elevated p-4 mb-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs text-rr-muted mb-1">Cash alternative</p>
                    <p className="text-lg font-semibold text-rr-primary">
                      {cashAltNum ? (
                        `£${cashAltNum.toLocaleString("en-GB")}`
                      ) : (
                        <span className="text-rr-muted text-sm font-normal">
                          Not offered
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-rr-muted mb-1">Draw date</p>
                    <p className="text-lg font-semibold text-rr-primary">
                      {endsAt ? (
                        formatDateInLondon(endsAt)
                      ) : (
                        <span className="text-rr-muted text-sm font-normal">
                          TBC
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold text-rr-primary mb-4">
                About this competition
              </h2>
              <div className="rounded-lg border border-rr-border bg-rr-elevated p-4">
                {description && (
                  <p className="text-sm text-rr-secondary mb-4 leading-relaxed">
                    {description}
                  </p>
                )}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-rr-muted">Winners</span>
                    <span className="text-xs text-rr-secondary">
                      {numWinners ?? 1}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-rr-muted">Instant prize</span>
                    <span className="text-xs text-rr-secondary">
                      {instantPrizes ? "Yes" : "No"}
                    </span>
                  </div>
                  {makeModel && (
                    <div className="flex justify-between">
                      <span className="text-xs text-rr-muted">Make / model</span>
                      <span className="text-xs text-rr-secondary">
                        {makeModel}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="order-3 mt-8 md:hidden">
            <h2 className="text-lg font-semibold text-rr-primary mb-4">
              Ticket sales history
            </h2>
            <div className="rounded-lg border border-rr-border bg-rr-elevated p-4">
              <TicketSalesChart history={history} />
            </div>
          </div>
        </div>

        {moreFromOperator.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-rr-primary mb-4">
              More from {operator?.name ?? "Operator"}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {moreFromOperator.map((competition) => (
                <CompetitionCard
                  key={competition.id}
                  competition={competition}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}