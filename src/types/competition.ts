export type CompetitionOperator = {
  name: string;
};

export type Competition = {
  id: string;
  prize: string;
  imageUrl: string | null;
  ticketPrice: number | string | null;
  ticketsTotal: number | null;
  ticketsLeft?: number | null;
  percentSold: number | string | null;
  endsAt: string | null;
  category: string | null;
  instantPrizes: boolean | null;
  valueRatio: number | string | null;
  operator?: CompetitionOperator | null;
};