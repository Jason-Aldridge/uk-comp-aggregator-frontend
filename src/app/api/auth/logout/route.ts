import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookies, readAccessToken } from "@/lib/auth-cookies";
import { backendAuthFetch } from "@/lib/backend-auth";

export async function POST(request: NextRequest) {
  const accessToken = await readAccessToken();

  if (accessToken) {
    try {
      await backendAuthFetch("/auth/logout", {
        method: "POST",
        requestHeaders: request.headers,
        authorizationToken: accessToken,
      });
    } catch {}
  }

  await clearAuthCookies();

  return NextResponse.json({ ok: true });
}
