import { NewsletterTokenActionCard } from "@/components/newsletter/newsletter-token-action-card";

export const metadata = {
  title: "Confirm Newsletter Subscription",
  description: "Confirm your RaffleRadar newsletter subscription.",
};

type NewsletterConfirmPageSearchParams = {
  token?: string | string[];
};

export default async function NewsletterConfirmPage({
  searchParams,
}: {
  searchParams: Promise<NewsletterConfirmPageSearchParams>;
}) {
  const params = await searchParams;
  const token = Array.isArray(params.token) ? params.token[0] : params.token;

  return <NewsletterTokenActionCard action="confirm" token={token} />;
}
