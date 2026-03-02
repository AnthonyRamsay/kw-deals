import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-brand-500 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Page Not Found</h2>
        <p className="text-stone-600 mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-brand-500 text-white font-medium rounded-[var(--radius-button)] hover:bg-brand-600 transition-colors"
        >
          Back to Deals
        </Link>
      </div>
    </div>
  );
}
