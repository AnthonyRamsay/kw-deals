export const TIERS = {
  basic: {
    name: "Basic",
    price: 49,
    priceId: process.env.STRIPE_BASIC_PRICE_ID!,
    description: "Get discovered by KW locals",
    features: [
      "Business profile page",
      "One active deal at a time",
      "Category page placement",
      "Included in weekly email digest",
    ],
  },
  featured: {
    name: "Featured",
    price: 99,
    priceId: process.env.STRIPE_FEATURED_PRICE_ID!,
    description: "Stand out from the crowd",
    features: [
      "Everything in Basic",
      "Homepage deal rotation",
      "Top of category listings",
      "1 Instagram Story mention/month",
      "Views & clicks analytics",
    ],
  },
  spotlight: {
    name: "Spotlight",
    price: 199,
    priceId: process.env.STRIPE_SPOTLIGHT_PRICE_ID!,
    description: "Maximum visibility in KW",
    features: [
      "Everything in Featured",
      "Priority placement everywhere",
      "1 Instagram carousel post/month",
      '"New in KW" or "Staff Pick" badge',
      "Premium card design",
      "Quarterly performance report",
    ],
  },
} as const;

export type TierKey = keyof typeof TIERS;
