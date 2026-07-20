import { cookies } from "next/headers";

type AuthTokenPair = {
  accessToken: string;
  refreshToken: string;
};

export const ACCESS_COOKIE_NAME = "rr_access";
export const REFRESH_COOKIE_NAME = "rr_refresh";

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const ACCESS_COOKIE_MAX_AGE = 60 * 15;
const REFRESH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export async function setAuthCookies({
  accessToken,
  refreshToken,
}: AuthTokenPair) {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_COOKIE_MAX_AGE,
  });

  cookieStore.set(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "lax",
    path: "/api/auth",
    maxAge: REFRESH_COOKIE_MAX_AGE,
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_COOKIE_NAME, "", {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  cookieStore.set(REFRESH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "lax",
    path: "/api/auth",
    maxAge: 0,
  });
}

export async function readAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_COOKIE_NAME)?.value ?? null;
}
