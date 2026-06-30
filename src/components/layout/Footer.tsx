import Link from "next/link";
import { sanityClient } from "@/sanity/client";
import { SITE_SETTINGS } from "@/sanity/queries";

type FooterLink = {
  label: string;
  href: string;
};

type FooterColumn = {
  heading?: string | null;
  links?: FooterLink[] | null;
};

type SiteSettingsData = {
  footerColumns?: FooterColumn[] | null;
  footerLinks?: FooterLink[] | null;
  footerCopyright?: string | null;
  footerDisclaimer?: string | null;
};

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export async function Footer() {
  const settings = await sanityClient.fetch<SiteSettingsData | null>(SITE_SETTINGS);

  const footerColumns =
    settings?.footerColumns?.filter((column) => (column.links?.length ?? 0) > 0) ?? [];

  const fallbackColumns =
    footerColumns.length === 0 && settings?.footerLinks?.length
      ? [
          {
            heading: null,
            links: settings.footerLinks,
          },
        ]
      : [];

  const columns = footerColumns.length ? footerColumns : fallbackColumns;
  const currentYear = new Date().getFullYear();
  const footerCopyright =
    settings?.footerCopyright?.trim() || `© ${currentYear} RaffleRadar. All rights reserved.`;
  const footerDisclaimer = settings?.footerDisclaimer?.trim() || "";

  return (
    <footer className="border-t border-rr-border bg-rr-surface">
      <div className="container py-8 md:py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-12">
          <div className="max-w-[260px]">
            <Link
              href="/"
              className="inline-block font-medium tracking-[-0.3px] text-rr-primary no-underline"
            >
              RAFFLE<span className="text-rr-green">RADAR</span>
            </Link>
          </div>

          {columns.length ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {columns.map((column, index) => (
                <div key={`${column.heading ?? "footer"}-${index}`} className="min-w-[160px]">
                  {column.heading ? (
                    <h2 className="mb-3 text-sm font-medium text-rr-primary">{column.heading}</h2>
                  ) : null}

                  <ul className="space-y-2">
                    {(column.links ?? []).map((link) => (
                      <li key={`${link.label}-${link.href}`}>
                        {isExternalHref(link.href) ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-rr-secondary no-underline transition hover:text-rr-green"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            className="text-sm text-rr-secondary no-underline transition hover:text-rr-green"
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-8 border-t border-rr-border pt-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <p className="text-sm text-rr-secondary">{footerCopyright}</p>
            {footerDisclaimer ? (
              <p className="max-w-[640px] text-sm leading-6 text-rr-muted">{footerDisclaimer}</p>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
