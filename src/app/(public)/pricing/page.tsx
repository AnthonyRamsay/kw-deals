import type { Metadata } from "next";
import { TIERS } from "@/lib/stripe/config";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CheckoutButton } from "./checkout-button";

export const metadata: Metadata = {
  title: "Pricing — Get Your Business on KW Deals",
  description:
    "Feature your business on KW Deals. Plans from $49/month. Reach thousands of KW locals.",
};

export default function PricingPage() {
  const tiers = [
    { key: "basic" as const, ...TIERS.basic, popular: false },
    { key: "featured" as const, ...TIERS.featured, popular: true },
    { key: "spotlight" as const, ...TIERS.spotlight, popular: false },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
          Get your business in front of KW locals
        </h1>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto">
          Join dozens of local businesses already using KW Deals to reach new customers.
          Simple monthly plans, cancel anytime.
        </p>
      </div>

      {/* Pricing grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {tiers.map((tier) => (
          <div
            key={tier.key}
            className={cn(
              "relative bg-surface-raised rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-6 sm:p-8 flex flex-col",
              tier.popular && "ring-2 ring-brand-500 shadow-lg scale-[1.02]"
            )}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="brand" className="bg-brand-500 text-white border-0 px-3 py-1">
                  Most Popular
                </Badge>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-xl font-bold text-stone-900">{tier.name}</h2>
              <p className="text-sm text-stone-500 mt-1">{tier.description}</p>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-stone-900">${tier.price}</span>
              <span className="text-stone-500">/month</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-stone-600">
                  <svg className="h-5 w-5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <CheckoutButton
              tier={tier.key}
              popular={tier.popular}
            />
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="mt-16 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-stone-900 text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-stone-900">How does it work?</h3>
            <p className="text-stone-600 text-sm mt-1">
              Pick a plan, and we&apos;ll create your business profile and deal listing.
              Your deal gets featured on our website and promoted to our audience of 17K+ KW locals through Instagram and our weekly email digest.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Can I change or cancel my plan?</h3>
            <p className="text-stone-600 text-sm mt-1">
              Yes! You can upgrade, downgrade, or cancel anytime. No long-term contracts.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">What kind of deals can I list?</h3>
            <p className="text-stone-600 text-sm mt-1">
              Anything that brings customers through your door: percentage discounts, BOGO offers,
              free items with purchase, special menus, or just a spotlight on what makes your business special.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">How do I get started?</h3>
            <p className="text-stone-600 text-sm mt-1">
              Choose a plan and complete checkout. We&apos;ll reach out within 24 hours to set up your listing
              and get your first deal live.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
