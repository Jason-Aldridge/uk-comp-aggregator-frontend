import { VerifyEmailForm } from "@/components/auth/verify-email-form";

type VerifyEmailPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { token } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <VerifyEmailForm token={token ?? null} />
    </div>
  );
}
