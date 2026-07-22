export function getUserAgentLabel(userAgent: string | null): string {
  const value = userAgent?.trim();
  if (!value) return "Unknown device";

  let browser = "";
  let platform = "";

  if (value.includes("Edg/") || value.includes("Edge/")) browser = "Edge";
  else if (value.includes("Chrome/") || value.includes("CriOS/")) browser = "Chrome";
  else if (value.includes("Safari/") && !value.includes("Chrome/") && !value.includes("CriOS/")) browser = "Safari";
  else if (value.includes("Firefox/") || value.includes("FxiOS/")) browser = "Firefox";
  else if (value.includes("OPR/") || value.includes("Opera/")) browser = "Opera";
  else if (value.includes("SamsungBrowser/")) browser = "Samsung Internet";

  if (value.includes("iPhone")) platform = "iPhone";
  else if (value.includes("iPad")) platform = "iPad";
  else if (value.includes("Android")) platform = "Android";
  else if (value.includes("Macintosh") || value.includes("Mac OS X")) platform = "Mac";
  else if (value.includes("Windows")) platform = "Windows";
  else if (value.includes("CrOS")) platform = "ChromeOS";
  else if (value.includes("Linux")) platform = "Linux";

  if (browser && platform) return `${browser} on ${platform}`;
  if (browser) return browser;
  if (platform) return platform;
  return "Unknown device";
}
