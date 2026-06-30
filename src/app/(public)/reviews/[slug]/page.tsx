import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityClient, urlFor } from "@/sanity/client";
import { ALL_REVIEW_SLUGS, RELATED_REVIEWS, REVIEW_BY_SLUG } from "@/sanity/queries";
import { ReviewArticle } from "@/components/sanity/ReviewArticle";

export const revalidate = 60;

type PageParams = {
  slug: string;
};

type ReviewSlug = {
  current: string;
};

type SeoMeta = {
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: unknown;
};

type ReviewData = {
  title: string;
  slug: ReviewSlug;
  operatorName?: string | null;
  heroImage?: unknown;
  excerpt?: string | null;
  rating?: number | null;
  body?: unknown[];
  publishedAt?: string | null;
  seo?: SeoMeta;
};

type ReviewListItem = {
  _id: string;
  title: string;
  slug: ReviewSlug;
  operatorName?: string | null;
  heroImage?: unknown;
  excerpt: string;
  rating?: number | null;
  publishedAt: string;
};

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch<string[]>(ALL_REVIEW_SLUGS);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const review = await sanityClient.fetch<ReviewData | null>(REVIEW_BY_SLUG, { slug });

  if (!review) {
    return {};
  }

  const title = review.seo?.seoTitle ?? `${review.title} — RaffleRadar`;
  const description = review.seo?.seoDescription ?? review.excerpt ?? undefined;
  const imageSource = review.seo?.seoImage ?? review.heroImage;
  const imageUrl = imageSource
    ? urlFor(imageSource)
        .width(1200)
        .height(630)
        .fit("crop")
        .crop("focalpoint")
        .auto("format")
        .quality(75)
        .url()
    : undefined;

  return {
    title,
    description,
    openGraph: imageUrl ? { title, description, images: [{ url: imageUrl }] } : { title, description },
    twitter: imageUrl
      ? { card: "summary_large_image", title, description, images: [imageUrl] }
      : { card: "summary", title, description },
  };
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const review = await sanityClient.fetch<ReviewData | null>(REVIEW_BY_SLUG, { slug });

  if (!review) {
    notFound();
  }

  const relatedReviews = await sanityClient.fetch<ReviewListItem[]>(RELATED_REVIEWS, { slug });

  return <ReviewArticle review={review} relatedReviews={relatedReviews} />;
}
