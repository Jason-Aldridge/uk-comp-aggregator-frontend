import "server-only";

import { NextResponse } from "next/server";
import { readAccessToken } from "@/lib/auth-cookies";

type BackendAuthFetchOptions = {
  method?: string;
  body?: unknown;
  requestHeaders?: Headers;
  attachAccessToken?: boolean;
  accessToken?: string | null;
  authorizationToken?: string | null;
};

function getBackendUrl() {
  const value = process.env.BACKEND_URL;

  if (!value) {
    throw new Error("Missing BACKEND_URL");
  }

  return value;
}

function getInternalApiKey() {
  const value = process.env.INTERNAL_API_KEY;

  if (!value) {
    throw new Error("Missing INTERNAL_API_KEY");
  }

  return value;
}

function getClientIp(requestHeaders?: Headers) {
  const forwardedFor = requestHeaders?.get("x-forwarded-for");

  if (forwardedFor) {
    const firstValue = forwardedFor
      .split(",")
      .map((value) => value.trim())
      .find(Boolean);

    if (firstValue) {
      return firstValue;
    }
  }

  const realIp = requestHeaders?.get("x-real-ip")?.trim();
  return realIp || null;
}

export async function backendAuthFetch(
  path: string,
  {
    method = "GET",
    body,
    requestHeaders,
    attachAccessToken = false,
    accessToken,
    authorizationToken,
  }: BackendAuthFetchOptions = {},
) {
  const headers = new Headers();
  const userAgent = requestHeaders?.get("user-agent")?.trim();
  const clientIp = getClientIp(requestHeaders);

  headers.set("x-internal-key", getInternalApiKey());

  if (userAgent) {
    headers.set("x-client-user-agent", userAgent);
  }

  if (clientIp) {
    headers.set("x-client-ip", clientIp);
  }

  const bearerToken =
    authorizationToken ??
    (attachAccessToken ? accessToken ?? (await readAccessToken()) : null);

  if (bearerToken) {
    headers.set("authorization", `Bearer ${bearerToken}`);
  }

  if (body !== undefined) {
    headers.set("content-type", "application/json");
  }

  return fetch(new URL(path, getBackendUrl()), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
}

export async function readBackendResponseBody<T = unknown>(response: Response) {
  const rawBody = await response.text();

  if (!rawBody) {
    return null as T | null;
  }

  try {
    return JSON.parse(rawBody) as T;
  } catch {
    return rawBody as T;
  }
}

export async function createProxyResponse(response: Response) {
  const body = await response.text();
  const headers = new Headers();
  const contentType = response.headers.get("content-type");

  if (contentType) {
    headers.set("content-type", contentType);
  }

  return new NextResponse(body || null, {
    status: response.status,
    headers,
  });
}

export function createUnauthorizedResponse() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}
