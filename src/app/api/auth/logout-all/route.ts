import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookies, readAccessToken } from "@/lib/auth-cookies";
import {
  backendAuthFetch,
  createProxyResponse,
  createUnauthorizedResponse,
} from "@/lib/backend-auth";

export async function POST(request: NextRequest) {
  const accessToken = await readAccessToken();

  if (!accessToken) {
    return createUnauthorizedResponse();
  }

  const response = await backendAuthFetch("/auth/logout-all", {
    method: "POST",
    requestHeaders: request.headers,
    attachAccessToken: true,
    accessToken,
  });

  if (!response.ok) {
    return createProxyResponse(response);
  }

  await clearAuthCookies();

  return NextResponse.json({ ok: true });
}
