import { clearTokens, getRefreshToken, setTokens } from "@/lib/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string;
};

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
  isRetry = false,
): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && !isRetry && typeof window !== "undefined") {
    const refreshToken = getRefreshToken();

    if (refreshToken) {
      const refreshed = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (refreshed.ok) {
        const tokens = (await refreshed.json()) as RefreshResponse;
        setTokens(tokens.accessToken, tokens.refreshToken);
        return apiFetch<T>(path, { ...options, token: tokens.accessToken }, true);
      }
    }

    clearTokens();
    throw new Error("Session expired");
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({} as { message?: string }));
    throw new Error(
      (error as { message?: string }).message ?? `HTTP ${res.status}`,
    );
  }

  return res.json() as Promise<T>;
}

export async function getStats() {
  return apiFetch<{
    competitionsCount: number;
    operatorsCount: number;
    lastUpdatedAt: string | null;
  }>("/stats");
}

export type GetCompetitionsParams = {
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: string;
  category?: string;
  closing?: string;
  minPrizeValue?: number;
  website?: string;
  freeOnly?: boolean;
  excludeInstant?: boolean;
  excludeFree?: boolean;
};

export type CompetitionDetail = {
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
  operator: {
    name: string;
    baseUrl: string;
    avgVr: number | null;
    vrSampleSize: number | null;
  } | null;
  prizeValue: number | string | null;
  prizeValueEstimated: boolean | null;
  cashAlternative: number | string | null;
  maxPerPerson: number | null;
  numWinners: number | null;
  prizeMake: string | null;
  prizeModel: string | null;
  description: string | null;
  sourceUrl: string | null;
};

function normalizeCompetitionsResponse(value: unknown) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    const data = value as {
      items?: unknown;
      data?: unknown;
      competitions?: unknown;
    };

    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.competitions)) return data.competitions;
  }

  return [];
}

export async function getCompetitions(params?: GetCompetitionsParams) {
  const query = new URLSearchParams();

  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.page) query.set("page", String(params.page));
  if (params?.sortBy) query.set("sortBy", params.sortBy);
  if (params?.sortOrder) query.set("sortOrder", params.sortOrder);
  if (params?.category) query.set("category", params.category);
  if (params?.closing) query.set("closing", params.closing);
  if (params?.minPrizeValue) query.set("minPrizeValue", String(params.minPrizeValue));
  if (params?.website) query.set("website", params.website);
  if (params?.freeOnly) query.set("freeOnly", "true");
  if (params?.excludeInstant) query.set("excludeInstant", "true");
  if (params?.excludeFree) query.set("excludeFree", "true");

  const path = query.size > 0 ? `/competitions?${query.toString()}` : "/competitions";
  const response = await apiFetch<unknown>(path);
  return normalizeCompetitionsResponse(response);
}

type GetTopOpportunitiesParams = {
  limit?: number;
};

export async function getTopOpportunities(params?: GetTopOpportunitiesParams) {
  const query = new URLSearchParams();
  if (params?.limit) query.set("limit", String(params.limit));

  const path =
    query.size > 0
      ? `/competitions/top-opportunities?${query.toString()}`
      : "/competitions/top-opportunities";

  const response = await apiFetch<unknown>(path);
  return normalizeCompetitionsResponse(response);
}

export async function getCompetition(id: string) {
  return apiFetch<CompetitionDetail>(`/competitions/${id}`);
}

export async function getCompetitionHistory(id: string) {
  return apiFetch<unknown>(`/competitions/${id}/history`);
}

export async function trackCompetitionClick(id: string) {
  return apiFetch<unknown>(`/competitions/${id}/click`, { method: "POST" });
}