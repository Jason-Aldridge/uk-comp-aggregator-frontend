import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container py-12">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-rr-secondary">
        The page you’re looking for doesn’t exist.
      </p>
      <Link href="/" className="mt-4 inline-block text-rr-green underline">
        Go home
      </Link>
    </main>
  );
}
