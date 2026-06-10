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
    <main>
      <h1>Competitions</h1>
      <pre>{output}</pre>
    </main>
  );
}
