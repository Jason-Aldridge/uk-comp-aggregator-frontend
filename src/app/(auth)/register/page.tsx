import { Suspense } from "react";
import { RegisterForm } from "../../../components/auth/register-form";

export default function Page() {
  return (
    <main className="py-10 sm:py-14">
      <div className="container">
        <div className="mx-auto max-w-[560px] space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-rr-primary">
              Create account
            </h1>
            <p className="text-[15px] leading-7 text-rr-secondary">
              Create your RaffleRadar account to continue.
            </p>
          </div>
          <Suspense fallback={null}>
            <RegisterForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
