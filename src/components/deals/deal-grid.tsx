import { DealCard } from "./deal-card";
import { DealCardSkeleton } from "@/components/ui/skeleton";
import type { SubscriptionTier } from "@/types/database";

interface DealWithBusiness {
  slug: string;
  title: string;
  discount_value: string | null;
  deal_type: string | null;
  image_url: string | null;
  business: {
    name: string;
    slug: string;
    short_description: string | null;
    cover_image_url: string | null;
    city: string | null;
    subscription_tier: SubscriptionTier;
    is_new: boolean;
    is_staff_pick: boolean;
    category: {
      name: string;
      slug: string;
    };
  };
}

interface DealGridProps {
  deals: DealWithBusiness[];
  loading?: boolean;
}

export function DealGrid({ deals, loading }: DealGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <DealCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-stone-500 text-lg">No deals found.</p>
        <p className="text-stone-400 text-sm mt-1">Check back soon for new deals!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {deals.map((deal) => (
        <DealCard key={deal.slug} deal={deal} />
      ))}
    </div>
  );
}
