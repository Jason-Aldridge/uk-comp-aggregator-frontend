import { NextRequest } from "next/server";
import { readAccessToken } from "@/lib/auth-cookies";
import {
  backendAuthFetch,
  createProxyResponse,
  createUnauthorizedResponse,
} from "@/lib/backend-auth";

export async function GET(request: NextRequest) {
  const accessToken = await readAccessToken();

  if (!accessToken) {
    console.log("[DEBUG /api/auth/me] No access token in cookie");
    return createUnauthorizedResponse();
  }

  console.log("[DEBUG /api/auth/me] Token present, forwarding to backend");

  const response = await backendAuthFetch("/auth/me", {
    method: "GET",
    requestHeaders: request.headers,
    attachAccessToken: true,
    accessToken,
  });

  console.log(
    `[DEBUG /api/auth/me] Backend response status: ${response.status}`
  );

  return createProxyResponse(response);
}
