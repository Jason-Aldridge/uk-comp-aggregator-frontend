import { NextRequest, NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/auth-cookies";
import {
  backendAuthFetch,
  createProxyResponse,
  readBackendResponseBody,
} from "@/lib/backend-auth";

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: unknown;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Record<string, unknown>;
  const response = await backendAuthFetch("/auth/login", {
    method: "POST",
    body,
    requestHeaders: request.headers,
  });

  if (!response.ok) {
    return createProxyResponse(response);
  }

  const data = await readBackendResponseBody<LoginResponse>(response);

  if (!data?.accessToken || !data?.refreshToken) {
    return NextResponse.json({ message: "Invalid auth response" }, { status: 502 });
  }

  await setAuthCookies({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });

  return NextResponse.json({ user: data.user });
}
