import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About KW Deals",
  description: "KW Deals is a hyperlocal deals platform for Kitchener-Waterloo, powered by KW Rising.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-6">
        About KW Deals
      </h1>

      <div className="prose prose-stone max-w-none space-y-6 text-stone-600 leading-relaxed">
        <p className="text-lg">
          KW Deals is the go-to place for discovering the best deals, discounts, and new businesses
          in Kitchener-Waterloo. We help residents save money while supporting the local businesses
          that make our community great.
        </p>

        <h2 className="text-xl font-semibold text-stone-900">Powered by KW Rising</h2>
        <p>
          KW Deals is built by KW Rising, the region&apos;s most trusted local content platform.
          With over 17,000 followers and millions of monthly views, KW Rising has been connecting
          locals with the best of Kitchener-Waterloo for over 6 years.
        </p>

        <h2 className="text-xl font-semibold text-stone-900">For Residents</h2>
        <p>
          Browse deals by category, discover new businesses, and never miss a great offer.
          Sign up for our weekly email digest to get the best deals delivered straight to your inbox.
        </p>

        <h2 className="text-xl font-semibold text-stone-900">For Businesses</h2>
        <p>
          Get your business in front of thousands of local customers who are actively looking
          to discover and support local. Our affordable monthly plans make it easy for any
          business to get started.
        </p>
      </div>
    </div>
  );
}
