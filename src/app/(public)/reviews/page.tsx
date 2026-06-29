import type { Metadata } from "next";
import { sanityClient } from "@/sanity/client";
import { ALL_REVIEWS } from "@/sanity/queries";
import { ReviewCard } from "@/components/sanity/ReviewCard";

export const revalidate = 60;

type ReviewSlug = {
  current: string;
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

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Reviews — RaffleRadar",
  };
}

export default async function ReviewsPage() {
  const reviews = await sanityClient.fetch<ReviewListItem[]>(ALL_REVIEWS);

  return (
    <main className="bg-rr-bg">
      <section className="bg-gradient-to-b from-rr-surface to-rr-bg">
        <div className="container py-14 md:py-16">
          <div className="mx-auto max-w-[760px] text-center">
            <h1 className="text-4xl font-medium leading-tight tracking-[-0.03em] text-rr-primary md:text-5xl">
              Reviews
            </h1>
            <p className="mx-auto mt-5 max-w-[680px] text-base leading-7 text-rr-secondary md:text-lg">
              In-depth reviews of UK competition operators — what they offer, how they price, and
              whether they’re worth your time.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-14">
        <div className="container">
          {reviews.length ? (
            <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  title={review.title}
                  slug={review.slug}
                  operatorName={review.operatorName}
                  heroImage={review.heroImage}
                  excerpt={review.excerpt}
                  rating={review.rating}
                  publishedAt={review.publishedAt}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-rr-muted">No reviews yet. Check back soon.</div>
          )}
        </div>
      </section>
    </main>
  );
}
