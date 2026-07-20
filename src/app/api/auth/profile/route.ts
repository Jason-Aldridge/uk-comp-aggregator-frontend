import { NextRequest } from "next/server";
import { readAccessToken } from "@/lib/auth-cookies";
import {
  backendAuthFetch,
  createProxyResponse,
  createUnauthorizedResponse,
} from "@/lib/backend-auth";

export async function PATCH(request: NextRequest) {
  const accessToken = await readAccessToken();

  if (!accessToken) {
    return createUnauthorizedResponse();
  }

  const body = (await request.json()) as Record<string, unknown>;
  const response = await backendAuthFetch("/auth/profile", {
    method: "PATCH",
    body,
    requestHeaders: request.headers,
    attachAccessToken: true,
    accessToken,
  });

  return createProxyResponse(response);
}
