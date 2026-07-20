import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  REFRESH_COOKIE_NAME,
  clearAuthCookies,
  setAuthCookies,
} from "@/lib/auth-cookies";
import { backendAuthFetch, createUnauthorizedResponse, readBackendResponseBody } from "@/lib/backend-auth";

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;

  if (!refreshToken) {
    return createUnauthorizedResponse();
  }

  const response = await backendAuthFetch("/auth/refresh", {
    method: "POST",
    requestHeaders: request.headers,
    authorizationToken: refreshToken,
  });

  if (!response.ok) {
    await clearAuthCookies();
    return createUnauthorizedResponse();
  }

  const data = await readBackendResponseBody<RefreshResponse>(response);

  if (!data?.accessToken || !data?.refreshToken) {
    await clearAuthCookies();
    return createUnauthorizedResponse();
  }

  await setAuthCookies({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });

  return NextResponse.json({ ok: true });
}
