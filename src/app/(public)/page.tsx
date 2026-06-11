import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { apiFetch } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function Page() {
  let output: string;

  try {
    const data = await apiFetch<unknown>("/competitions");
    output = JSON.stringify(data, null, 2).slice(0, 200);
  } catch (e) {
    output = e instanceof Error ? e.message : "Unknown error";
  }

  return (
    <main className="p-6 space-y-6">
      <section className="space-y-2">
        <h1 className="text-sm font-medium">UI smoke test</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="operator">RevComps</Badge>
          <Badge variant="red">Ends today</Badge>
          <Badge variant="amber">2 days</Badge>
          <Badge variant="green">Value 8.9</Badge>
          <Badge variant="neutral">Neutral</Badge>
        </div>
        <div className="space-y-2 max-w-sm">
          <ProgressBar value={18} />
          <ProgressBar value={55} />
          <ProgressBar value={78} />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">Log in</Button>
          <Button variant="primary">Sign up</Button>
          <Button variant="icon" aria-label="Icon">
            i
          </Button>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium">API preview</h2>
        <pre className="text-xs whitespace-pre-wrap break-words">{output}</pre>
      </section>
    </main>
  );
}
