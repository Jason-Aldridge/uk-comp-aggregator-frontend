"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type CompetitionHistory = {
  scrapedAt: string;
  ticketsSold: number;
  percentSold: number;
};

type TicketSalesChartProps = {
  history: CompetitionHistory[];
};

const axisTimeFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

const tooltipTimeFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export function TicketSalesChart({ history }: TicketSalesChartProps) {
  if (history.length < 3) {
    return (
      <div className="text-center text-rr-muted text-sm py-10">
        Not enough history yet — check back soon.
      </div>
    );
  }

  const data = [...history].sort(
    (a, b) => new Date(a.scrapedAt).getTime() - new Date(b.scrapedAt).getTime(),
  );

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height={256}>
        <LineChart data={data}>
          <XAxis
            dataKey="scrapedAt"
            stroke="var(--text-muted)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => axisTimeFormat.format(new Date(value))}
          />
          <YAxis
            stroke="var(--text-muted)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "var(--text-primary)",
            }}
            labelStyle={{ color: "var(--text-primary)", fontWeight: 600 }}
            formatter={(value) => [`${value}%`, "Sold"]}
            labelFormatter={(label) => tooltipTimeFormat.format(new Date(label))}
          />
          <Line
            type="monotone"
            dataKey="percentSold"
            stroke="var(--accent)"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
              fill: "var(--accent)",
              stroke: "var(--surface)",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}