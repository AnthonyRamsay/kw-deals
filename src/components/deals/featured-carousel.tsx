import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { SubscriptionTier } from "@/types/database";

interface FeaturedDeal {
  slug: string;
  title: string;
  discount_value: string | null;
  image_url: string | null;
  business: {
    name: string;
    cover_image_url: string | null;
    subscription_tier: SubscriptionTier;
    is_staff_pick: boolean;
    is_new: boolean;
  };
}

interface FeaturedCarouselProps {
  deals: FeaturedDeal[];
}

export function FeaturedCarousel({ deals }: FeaturedCarouselProps) {
  if (deals.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-bold text-stone-900 mb-4">Featured Deals</h2>
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4">
        {deals.map((deal) => {
          const imageUrl = deal.image_url || deal.business.cover_image_url;

          return (
            <Link
              key={deal.slug}
              href={`/deal/${deal.slug}`}
              className="snap-start shrink-0 w-[85vw] sm:w-[400px] group"
            >
              <div className="relative aspect-[16/9] rounded-[var(--radius-card)] overflow-hidden bg-stone-100">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={deal.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 85vw, 400px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-brand-400 to-brand-600">
                    <span className="text-white text-2xl font-bold">{deal.business.name}</span>
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    {deal.discount_value && (
                      <Badge variant="brand" className="bg-brand-500 text-white border-0">
                        {deal.discount_value}
                      </Badge>
                    )}
                    {deal.business.is_staff_pick && (
                      <Badge variant="warning">Staff Pick</Badge>
                    )}
                  </div>
                  <h3 className="text-white font-semibold text-lg">{deal.business.name}</h3>
                  <p className="text-white/80 text-sm truncate">{deal.title}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
