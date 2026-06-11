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