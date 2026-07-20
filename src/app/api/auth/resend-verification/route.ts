import { NextRequest } from "next/server";
import { backendAuthFetch, createProxyResponse } from "@/lib/backend-auth";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Record<string, unknown>;
  const response = await backendAuthFetch("/auth/resend-verification", {
    method: "POST",
    body,
    requestHeaders: request.headers,
  });

  return createProxyResponse(response);
}
