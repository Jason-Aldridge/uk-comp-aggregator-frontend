import Link from "next/link";
import { SanityImage } from "@/components/ui/SanityImage";
import { urlFor } from "@/sanity/client";

type PostSlug = {
  current: string;
};

type FeaturedPostCardProps = {
  title: string;
  slug: PostSlug;
  heroImage?: unknown;
  excerpt: string;
  category?: string | null;
  publishedAt: string;
};

function formatPublishedDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function FeaturedPostCard({
  title,
  slug,
  heroImage,
  excerpt,
  category,
  publishedAt,
}: FeaturedPostCardProps) {
  const href = `/blog/${slug.current}`;
  const imgSrc = heroImage
    ? urlFor(heroImage)
        .width(1100)
        .height(620)
        .fit("max")
        .auto("format")
        .quality(75)
        .url()
    : null;

  return (
    <Link href={href} className="group block no-underline" aria-label={title}>
      <article className="overflow-hidden rounded-xl border border-rr-border bg-rr-elevated transition group-hover:border-rr-green/40">
        <div className="grid grid-cols-1 lg:grid-cols-[1.04fr_0.96fr]">
          <div
            className="relative bg-rr-surface p-4 md:p-5"
            style={{ aspectRatio: "16 / 9" }}
          >
            {imgSrc ? (
              <SanityImage
                src={imgSrc}
                alt={title}
                fill
                sizes="(max-width: 1024px) 100vw, 56vw"
                className="object-contain"
                unoptimized
              />
            ) : (
              <div className="h-full w-full bg-rr-surface" />
            )}
          </div>

          <div className="flex min-w-0 flex-col justify-center px-6 py-6 md:px-7 lg:px-7 lg:py-7">
            <div className="flex flex-wrap items-center gap-2 text-sm text-rr-muted">
              {category ? (
                <span className="inline-flex rounded-full border border-rr-green-border bg-rr-green-bg px-2.5 py-1 text-[11px] font-medium text-rr-green">
                  {category}
                </span>
              ) : null}
              <span>{formatPublishedDate(publishedAt)}</span>
            </div>

            <h2 className="mt-4 text-2xl font-medium leading-[1.15] tracking-[-0.03em] text-rr-primary md:text-[30px]">
              {title}
            </h2>

            <p className="mt-3 line-clamp-5 text-[15px] leading-6 text-rr-secondary">
              {excerpt}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
