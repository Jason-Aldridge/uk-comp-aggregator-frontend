import { Suspense } from "react";
import { LoginForm } from "../../../components/auth/login-form";

export default function Page() {
  return (
    <main className="py-10 sm:py-14">
      <div className="container">
        <div className="mx-auto max-w-[560px] space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-rr-primary">
              Log in
            </h1>
            <p className="text-[15px] leading-7 text-rr-secondary">
              Access your RaffleRadar account.
            </p>
          </div>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
