import { PostCard } from "@/components/sanity/PostCard";

type PostSlug = {
  current: string;
};

type PostListItem = {
  _id: string;
  title: string;
  richTitle?: unknown[] | null;
  titleColor?: string | null;
  slug: PostSlug;
  heroImage?: unknown;
  excerpt: string;
  category?: string | null;
  publishedAt: string;
};

export function RelatedPosts({ posts }: { posts: PostListItem[] }) {
  if (!posts.length) {
    return null;
  }

  return (
    <section className="pt-10">
      <h2 className="text-2xl font-medium tracking-[-0.02em] text-rr-primary">More articles</h2>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard
            key={post._id}
            title={post.title}
            richTitle={post.richTitle}
            titleColor={post.titleColor}
            slug={post.slug}
            heroImage={post.heroImage}
            excerpt={post.excerpt}
            category={post.category}
            publishedAt={post.publishedAt}
          />
        ))}
      </div>
    </section>
  );
}
