import type { Metadata } from "next";
import { FeaturedPostCard } from "@/components/sanity/FeaturedPostCard";
import { PostCard } from "@/components/sanity/PostCard";
import { sanityClient } from "@/sanity/client";
import { ALL_POSTS } from "@/sanity/queries";

export const revalidate = 60;

type PostSlug = {
  current: string;
};

type PostListItem = {
  _id: string;
  title: string;
  slug: PostSlug;
  heroImage?: unknown;
  excerpt: string;
  category?: string | null;
  publishedAt: string;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog — RaffleRadar",
    description: "Analysis, industry news, and tips on UK competitions.",
  };
}

export default async function BlogPage() {
  const posts = await sanityClient.fetch<PostListItem[]>(ALL_POSTS);
  const [featuredPost, ...previousPosts] = posts;

  return (
    <main className="bg-rr-bg">
      <section className="bg-gradient-to-b from-rr-surface to-rr-bg">
        <div className="container py-16 md:py-20">
          <div className="max-w-[760px]">
            <p className="mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-rr-green">
              <span className="h-px w-8 bg-rr-green" />
              The RaffleRadar Blog
            </p>
            <h1 className="text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-rr-primary md:text-6xl">
              Read the <span className="text-rr-green">small print</span> before you buy a ticket.
            </h1>
            <p className="mt-6 max-w-[600px] text-base leading-7 text-rr-secondary md:text-lg">
              Honest analysis, industry news and practical tips on UK prize competitions — so you
              know which draws are worth entering, and which to walk past.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 pt-12">
        <div className="container">
          {!posts.length ? (
            <div className="py-20 text-center text-rr-muted">No posts yet. Check back soon.</div>
          ) : (
            <div className="mx-auto max-w-[1100px]">
              {featuredPost ? (
                <div>
                  <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-rr-green">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-rr-green" />
                    Latest
                  </p>
                  <FeaturedPostCard
                    title={featuredPost.title}
                    slug={featuredPost.slug}
                    heroImage={featuredPost.heroImage}
                    excerpt={featuredPost.excerpt}
                    category={featuredPost.category}
                    publishedAt={featuredPost.publishedAt}
                  />
                </div>
              ) : null}

              {previousPosts.length ? (
                <section className="mt-14">
                  <h2 className="mb-6 text-2xl font-medium tracking-[-0.02em] text-rr-primary">
                    Previous articles
                  </h2>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {previousPosts.map((post) => (
                      <PostCard
                        key={post._id}
                        title={post.title}
                        slug={post.slug}
                        heroImage={post.heroImage}
                        excerpt={post.excerpt}
                        category={post.category}
                        publishedAt={post.publishedAt}
                      />
                    ))}
                  </div>
                </section>
              ) : null}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
