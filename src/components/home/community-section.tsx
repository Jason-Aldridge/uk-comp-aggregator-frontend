import Link from "next/link";

const communityItems = [
  {
    type: "Discussion",
    replies: 12,
    title: "Anyone entered the RevComps VW? Thoughts on the odds?",
    author: "uk_comp_fan",
    time: "2h ago",
  },
  {
    type: "Winner report",
    replies: 4,
    title: "WON the Rolex last week from 7Days — proof in comments 🎉",
    author: "lucky_dave_uk",
    time: "5h ago",
  },
  {
    type: "Tip",
    replies: 7,
    title: "Best time to enter for maximum value — a guide",
    author: "comp_strategist",
    time: "1d ago",
  },
];

export function CommunitySection() {
  return (
    <section className="pb-8 pt-1 md:pb-10">
      <div className="container">
        <div className="rounded-[10px] border border-rr-border bg-rr-surface p-4 md:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-rr-primary">
                Community <span className="text-rr-green">discussions</span>
              </h2>
            </div>

            <Link
              href="#"
              className="shrink-0 text-sm font-medium text-rr-green no-underline transition-opacity hover:opacity-80"
            >
              View forum →
            </Link>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
            {communityItems.map((item) => (
              <article
                key={`${item.type}-${item.author}-${item.time}`}
                className="rounded-lg border border-rr-border bg-rr-elevated p-3"
              >
                <p className="text-[10px] text-rr-muted">
                  {item.type} · {item.replies} replies
                </p>
                <p className="mt-1 text-sm leading-5 text-rr-secondary">
                  {item.title}
                </p>
                <p className="mt-2 text-[10px] text-rr-muted">
                  by <span className="text-rr-secondary">{item.author}</span> · {item.time}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

