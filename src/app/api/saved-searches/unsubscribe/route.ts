import { NextRequest } from "next/server";
import { backendAuthFetch, createProxyResponse } from "@/lib/backend-auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const response = await backendAuthFetch("/saved-searches/unsubscribe", {
    method: "POST",
    body,
    requestHeaders: request.headers,
  });

  return createProxyResponse(response);
}
