import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the KW Deals team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-6">
        Get in Touch
      </h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-stone-900 mb-2">For Businesses</h2>
          <p className="text-stone-600 mb-4">
            Want to feature your business on KW Deals? Check out our plans or reach out directly.
          </p>
          <div className="flex gap-3">
            <Link
              href="/pricing"
              className="inline-flex items-center px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-[var(--radius-button)] hover:bg-brand-600 transition-colors"
            >
              View Plans
            </Link>
            <a
              href="mailto:hello@kwrising.ca"
              className="inline-flex items-center px-4 py-2 border border-stone-300 text-stone-700 text-sm font-medium rounded-[var(--radius-button)] hover:bg-stone-50 transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-stone-900 mb-2">General Inquiries</h2>
          <p className="text-stone-600">
            For general questions, partnerships, or press inquiries, email us at{" "}
            <a href="mailto:hello@kwrising.ca" className="text-brand-600 hover:text-brand-700 font-medium">
              hello@kwrising.ca
            </a>
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-stone-900 mb-2">Follow KW Rising</h2>
          <p className="text-stone-600">
            Stay updated with the latest from Kitchener-Waterloo on our Instagram{" "}
            <a
              href="https://instagram.com/kwrising"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 hover:text-brand-700 font-medium"
            >
              @kwrising
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
