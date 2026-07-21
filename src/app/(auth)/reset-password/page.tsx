import { ResetPasswordForm } from "../../../components/auth/reset-password-form";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token.trim() : "";

  return (
    <main className="py-10 sm:py-14">
      <div className="container">
        <div className="mx-auto max-w-[560px] space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-rr-primary">
              Reset password
            </h1>
            <p className="text-[15px] leading-7 text-rr-secondary">
              Choose a new password to get back into your account.
            </p>
          </div>
          <ResetPasswordForm token={token} />
        </div>
      </div>
    </main>
  );
}
