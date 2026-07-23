import { NextRequest, NextResponse } from "next/server";
import { readAccessToken, readAnonId } from "@/lib/auth-cookies";
import { backendAuthFetch } from "@/lib/backend-auth";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const accessToken = await readAccessToken();
  const anonId = await readAnonId();

  const body = (await request.json().catch(() => ({}))) as {
    source?: string;
  };

  try {
    await backendAuthFetch(`/operators/${encodeURIComponent(id)}/click`, {
      method: "POST",
      body: {
        source: body.source,
        anon_id: anonId,
      },
      requestHeaders: request.headers,
      attachAccessToken: !!accessToken,
      accessToken,
      anonId,
    });
  } catch {}

  return NextResponse.json({ ok: true });
}
