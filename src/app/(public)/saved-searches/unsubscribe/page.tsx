import { SavedSearchUnsubscribeCard } from "@/components/saved-searches/saved-search-unsubscribe-card";

export const metadata = {
  title: "Turn Off Saved Search Alerts",
  description: "Turn off alerts for one saved search.",
};

type SavedSearchUnsubscribePageSearchParams = {
  token?: string | string[];
};

export default async function SavedSearchUnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<SavedSearchUnsubscribePageSearchParams>;
}) {
  const params = await searchParams;
  const token = Array.isArray(params.token) ? params.token[0] : params.token;

  return <SavedSearchUnsubscribeCard token={token} />;
}
