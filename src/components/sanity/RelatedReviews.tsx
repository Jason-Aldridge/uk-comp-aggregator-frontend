import { ReviewCard } from "@/components/sanity/ReviewCard";

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

export function RelatedReviews({ reviews }: { reviews: ReviewListItem[] }) {
  if (!reviews.length) {
    return null;
  }

  return (
    <section className="pt-10">
      <h2 className="text-2xl font-medium tracking-[-0.02em] text-rr-primary">More reviews</h2>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
    </section>
  );
}