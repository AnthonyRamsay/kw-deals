import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { SubscriptionTier } from "@/types/database";

interface DealCardProps {
  deal: {
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
  };
}

export function DealCard({ deal }: DealCardProps) {
  const { business } = deal;
  const tier = business.subscription_tier;
  const imageUrl = deal.image_url || business.cover_image_url;

  return (
    <Link
      href={`/deal/${deal.slug}`}
      className={cn(
        "group block bg-surface-raised rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden transition-all duration-200 hover:shadow-[var(--shadow-card-hover)] hover:scale-[1.02]",
        tier === "spotlight" && "ring-2 ring-amber-300",
        tier === "featured" && "bg-brand-50/30"
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={deal.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-stone-400">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
            </svg>
          </div>
        )}

        {/* Discount badge */}
        {deal.discount_value && (
          <div className="absolute bottom-2 right-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-brand-500 text-white shadow-sm">
              {deal.discount_value}
            </span>
          </div>
        )}

        {/* Tier badge */}
        {tier === "spotlight" && (
          <div className="absolute top-2 left-2">
            <Badge variant="premium">Spotlight</Badge>
          </div>
        )}
        {tier === "featured" && (
          <div className="absolute top-2 left-2">
            <Badge variant="brand">Featured</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-base font-semibold text-stone-900 truncate">
            {business.name}
          </h3>
        </div>

        <Badge variant="outline" className="mb-2">
          {business.category.name}
        </Badge>

        <p className="text-sm text-stone-600 line-clamp-2 mb-3">
          {deal.title}
          {business.short_description && ` — ${business.short_description}`}
        </p>

        {/* Badges row */}
        <div className="flex items-center gap-2 flex-wrap">
          {business.is_new && <Badge variant="success">New in KW</Badge>}
          {business.is_staff_pick && <Badge variant="warning">Staff Pick</Badge>}
          {business.city && (
            <span className="text-xs text-stone-500 flex items-center gap-1">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              {business.city}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
