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
    const error = await res.json().catch(() => ({}) as { message?: string });
    throw new Error(
      (error as { message?: string }).message ?? `HTTP ${res.status}`,
    );
  }

  return res.json() as Promise<T>;
}

function toNum(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const n = Number.parseFloat(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
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
  operator?: string;
  minPrizeValue?: number;
  website?: string;
  freeOnly?: boolean;
  excludeInstant?: boolean;
  excludeFree?: boolean;
  excludeGames?: boolean;
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

export type CompetitionSearchResult = {
  id: string;
  prize: string;
  imageUrl: string | null;
  ticketPrice: number | string | null;
  operator: {
    name: string;
  } | null;
};

export type OperatorSummary = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  avgVr: number | null;
  vrSampleSize: number | null;
  activeCompetitionsCount: number | null;
};

export type OperatorDetail = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  avgVr: number | null;
  vrSampleSize: number | null;
  activeCompetitionsCount: number | null;
  baseUrl: string | null;
  competitions: CompetitionDetail[];
};

function normalizeEmbeddedOperator(
  value: unknown,
): CompetitionDetail["operator"] {
  if (!value || typeof value !== "object") return null;

  const data = value as Record<string, unknown>;
  const name = typeof data.name === "string" ? data.name : null;

  if (!name) return null;

  return {
    name,
    baseUrl:
      typeof data.baseUrl === "string"
        ? data.baseUrl
        : typeof data.base_url === "string"
          ? data.base_url
          : "",
    avgVr: toNum(data.avgVr ?? data.avg_vr),
    vrSampleSize: toNum(
      data.sampleSize ?? data.vrSampleSize ?? data.vr_sample_size,
    ),
  };
}

function normalizeCompetitionItem<T>(item: T): T {
  if (!item || typeof item !== "object") return item;

  const data = item as Record<string, unknown>;

  if (!("operator" in data)) return item;

  return {
    ...data,
    operator: normalizeEmbeddedOperator(data.operator),
  } as T;
}

function normalizeCompetitionsResponse(value: unknown) {
  let list: unknown[] = [];

  if (Array.isArray(value)) {
    list = value;
  } else if (value && typeof value === "object") {
    const data = value as {
      items?: unknown;
      data?: unknown;
      competitions?: unknown;
    };

    if (Array.isArray(data.items)) list = data.items;
    else if (Array.isArray(data.data)) list = data.data;
    else if (Array.isArray(data.competitions)) list = data.competitions;
  }

  return list.map((item) => normalizeCompetitionItem(item));
}

function normalizeCompetitionSearchResponse(
  value: unknown,
): CompetitionSearchResult[] {
  return normalizeCompetitionsResponse(value).flatMap((item) => {
    if (!item || typeof item !== "object") return [];

    const data = item as {
      id?: string | number;
      prize?: string;
      imageUrl?: string | null;
      image_url?: string | null;
      ticketPrice?: number | string | null;
      ticket_price?: number | string | null;
      operator?: { name?: string } | null;
    };

    if (data.id === undefined || typeof data.prize !== "string") return [];

    return [
      {
        id: String(data.id),
        prize: data.prize,
        imageUrl: data.imageUrl ?? data.image_url ?? null,
        ticketPrice: data.ticketPrice ?? data.ticket_price ?? null,
        operator:
          data.operator && typeof data.operator.name === "string"
            ? { name: data.operator.name }
            : null,
      },
    ];
  });
}

function normalizeOperatorSummary(value: unknown): OperatorSummary[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];

    const data = item as Record<string, unknown>;
    const id = typeof data.id === "string" ? data.id : null;
    const slug = typeof data.slug === "string" ? data.slug : null;
    const name = typeof data.name === "string" ? data.name : null;

    if (!id || !slug || !name) return [];

    return [
      {
        id,
        slug,
        name,
        logoUrl:
          typeof data.logo === "string"
            ? data.logo
            : typeof data.logoUrl === "string"
              ? data.logoUrl
              : null,
        avgVr: toNum(data.avgVr ?? data.avg_vr),
        vrSampleSize: toNum(
          data.sampleSize ?? data.vrSampleSize ?? data.vr_sample_size,
        ),
        activeCompetitionsCount: toNum(
          data.activeCompetitionsCount ?? data.active_competitions_count,
        ),
      },
    ];
  });
}

function normalizeOperatorDetail(value: unknown): OperatorDetail | null {
  if (!value || typeof value !== "object") return null;

  const data = value as Record<string, unknown>;
  const id = typeof data.id === "string" ? data.id : null;
  const slug = typeof data.slug === "string" ? data.slug : null;
  const name = typeof data.name === "string" ? data.name : null;

  if (!id || !slug || !name) return null;

  return {
    id,
    slug,
    name,
    logoUrl:
      typeof data.logo === "string"
        ? data.logo
        : typeof data.logoUrl === "string"
          ? data.logoUrl
          : null,
    avgVr: toNum(data.avgVr ?? data.avg_vr),
    vrSampleSize: toNum(
      data.sampleSize ?? data.vrSampleSize ?? data.vr_sample_size,
    ),
    activeCompetitionsCount: toNum(
      data.activeCompetitionsCount ?? data.active_competitions_count,
    ),
    baseUrl:
      typeof data.baseUrl === "string"
        ? data.baseUrl
        : typeof data.base_url === "string"
          ? data.base_url
          : null,
    competitions: normalizeCompetitionsResponse(
      data.competitions,
    ) as CompetitionDetail[],
  };
}

export async function getCompetitions(params?: GetCompetitionsParams) {
  const query = new URLSearchParams();

  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.page) query.set("page", String(params.page));
  if (params?.sortBy) query.set("sortBy", params.sortBy);
  if (params?.sortOrder) query.set("sortOrder", params.sortOrder);
  if (params?.category) query.set("category", params.category);
  if (params?.closing) query.set("closing", params.closing);
  if (params?.operator) query.set("operator", params.operator);
  if (params?.minPrizeValue)
    query.set("minPrizeValue", String(params.minPrizeValue));
  if (params?.website) query.set("website", params.website);
  if (params?.freeOnly) query.set("freeOnly", "true");
  if (params?.excludeInstant) query.set("excludeInstant", "true");
  if (params?.excludeFree) query.set("excludeFree", "true");
  if (params?.excludeGames) query.set("excludeGames", "true");

  const path =
    query.size > 0 ? `/competitions?${query.toString()}` : "/competitions";
  const response = await apiFetch<unknown>(path);
  return normalizeCompetitionsResponse(response);
}

export async function getCompetitionSearch(
  q: string,
  limit = 8,
  excludeGames = false,
) {
  const query = new URLSearchParams({
    q,
    limit: String(limit),
  });

  if (excludeGames) query.set("excludeGames", "true");

  const response = await apiFetch<unknown>(
    `/competitions/search?${query.toString()}`,
  );
  return normalizeCompetitionSearchResponse(response);
}

export async function getOperators() {
  const response = await apiFetch<unknown>("/operators");
  return normalizeOperatorSummary(response);
}

export async function getOperator(slug: string) {
  const response = await apiFetch<unknown>(`/operators/${slug}`);
  return normalizeOperatorDetail(response);
}

type GetTopOpportunitiesParams = {
  limit?: number;
  excludeInstant?: boolean;
  excludeFree?: boolean;
  excludeGames?: boolean;
};

type GetMostUndersoldParams = {
  limit?: number;
  excludeInstant?: boolean;
  excludeFree?: boolean;
  excludeGames?: boolean;
};

export async function getTopOpportunities(params?: GetTopOpportunitiesParams) {
  const query = new URLSearchParams();
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.excludeInstant) query.set("excludeInstant", "true");
  if (params?.excludeFree) query.set("excludeFree", "true");
  if (params?.excludeGames) query.set("excludeGames", "true");

  const path =
    query.size > 0
      ? `/competitions/top-opportunities?${query.toString()}`
      : "/competitions/top-opportunities";

  const response = await apiFetch<unknown>(path);
  return normalizeCompetitionsResponse(response);
}

export async function getMostUndersold(params?: GetMostUndersoldParams) {
  const query = new URLSearchParams();
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.excludeInstant) query.set("excludeInstant", "true");
  if (params?.excludeFree) query.set("excludeFree", "true");
  if (params?.excludeGames) query.set("excludeGames", "true");

  const path =
    query.size > 0
      ? `/competitions/most-undersold?${query.toString()}`
      : "/competitions/most-undersold";

  const response = await apiFetch<unknown>(path);
  return normalizeCompetitionsResponse(response);
}

export async function getRecentlyEnded(limit = 8) {
  const query = new URLSearchParams({
    limit: String(limit),
  });
  const response = await apiFetch<unknown>(
    `/competitions/recently-ended?${query.toString()}`,
  );
  return normalizeCompetitionsResponse(response);
}

export async function getCompetition(id: string) {
  const response = await apiFetch<CompetitionDetail>(`/competitions/${id}`);
  return normalizeCompetitionItem(response);
}

export async function getCompetitionHistory(id: string) {
  return apiFetch<unknown>(`/competitions/${id}/history`);
}

export async function trackCompetitionClick(id: string) {
  return apiFetch<unknown>(`/competitions/${id}/click`, { method: "POST" });
}
