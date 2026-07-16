import { NewsletterTokenActionCard } from "@/components/newsletter/newsletter-token-action-card";

export const metadata = {
  title: "Unsubscribe From Newsletter",
  description: "Unsubscribe from the RaffleRadar newsletter.",
};

type NewsletterUnsubscribePageSearchParams = {
  token?: string | string[];
};

export default async function NewsletterUnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<NewsletterUnsubscribePageSearchParams>;
}) {
  const params = await searchParams;
  const token = Array.isArray(params.token) ? params.token[0] : params.token;

  return <NewsletterTokenActionCard action="unsubscribe" token={token} />;
}
