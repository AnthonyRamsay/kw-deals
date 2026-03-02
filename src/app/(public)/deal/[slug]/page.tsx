import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BusinessMap } from "@/components/business/business-map";
import { BusinessHours } from "@/components/business/business-hours";
import { EmailSignupBanner } from "@/components/email/email-signup-banner";

interface DealPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DealPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: deal } = await supabase
    .from("deals")
    .select("title, description, image_url, business:businesses!inner(name, short_description, cover_image_url)")
    .eq("slug", slug)
    .single();

  if (!deal) return { title: "Deal Not Found" };

  const business = deal.business as any;

  return {
    title: `${business.name} — ${deal.title}`,
    description: business.short_description || deal.description || `Check out this deal from ${business.name}`,
    openGraph: {
      images: deal.image_url || business.cover_image_url
        ? [{ url: deal.image_url || business.cover_image_url }]
        : undefined,
    },
  };
}

export const revalidate = 600;

export default async function DealPage({ params }: DealPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: deal } = await supabase
    .from("deals")
    .select(`
      *,
      business:businesses!inner(
        *, category:categories!inner(name, slug)
      )
    `)
    .eq("slug", slug)
    .single();

  if (!deal) notFound();

  const business = deal.business as any;
  const imageUrl = deal.image_url || business.cover_image_url;

  return (
    <>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-stone-500 mb-6">
          <Link href="/" className="hover:text-stone-700">Home</Link>
          <span>/</span>
          <Link href={`/category/${business.category.slug}`} className="hover:text-stone-700">
            {business.category.name}
          </Link>
          <span>/</span>
          <span className="text-stone-900">{business.name}</span>
        </nav>

        {/* Hero image */}
        {imageUrl && (
          <div className="relative aspect-[16/9] rounded-[var(--radius-card)] overflow-hidden bg-stone-100 mb-8">
            <Image
              src={imageUrl}
              alt={deal.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and badges */}
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                {business.subscription_tier === "spotlight" && (
                  <Badge variant="premium">Spotlight</Badge>
                )}
                {business.is_new && <Badge variant="success">New in KW</Badge>}
                {business.is_staff_pick && <Badge variant="warning">Staff Pick</Badge>}
                <Badge variant="outline">{business.category.name}</Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
                {business.name}
              </h1>
            </div>

            {/* Deal highlight */}
            <div className="bg-brand-50 border border-brand-200 rounded-[var(--radius-card)] p-5">
              <div className="flex items-start gap-4">
                {deal.discount_value && (
                  <span className="shrink-0 inline-flex items-center justify-center w-16 h-16 bg-brand-500 text-white font-bold text-lg rounded-[var(--radius-card)]">
                    {deal.discount_value}
                  </span>
                )}
                <div>
                  <h2 className="text-lg font-semibold text-stone-900">{deal.title}</h2>
                  {deal.description && (
                    <p className="text-stone-600 mt-1">{deal.description}</p>
                  )}
                  {deal.terms && (
                    <p className="text-xs text-stone-500 mt-2">Terms: {deal.terms}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Business description */}
            {business.description && (
              <div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">About</h3>
                <p className="text-stone-600 leading-relaxed whitespace-pre-line">
                  {business.description}
                </p>
              </div>
            )}

            {/* Photo gallery */}
            {business.photos && business.photos.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-stone-900 mb-3">Photos</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {business.photos.map((photo: string, i: number) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-stone-100">
                      <Image
                        src={photo}
                        alt={`${business.name} photo ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 200px"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <BusinessMap
              latitude={business.latitude}
              longitude={business.longitude}
              name={business.name}
              address={business.address}
              googleMapsUrl={business.google_maps_url}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action buttons */}
            <div className="bg-surface-raised rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-5 space-y-3">
              {business.website_url && (
                <a
                  href={business.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full px-4 py-2.5 bg-brand-500 text-white font-medium rounded-[var(--radius-button)] hover:bg-brand-600 transition-colors text-sm"
                >
                  Visit Website
                </a>
              )}
              {business.booking_url && (
                <a
                  href={business.booking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full px-4 py-2.5 border border-brand-500 text-brand-600 font-medium rounded-[var(--radius-button)] hover:bg-brand-50 transition-colors text-sm"
                >
                  Book Now
                </a>
              )}
              {business.phone && (
                <a
                  href={`tel:${business.phone}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-stone-300 text-stone-700 font-medium rounded-[var(--radius-button)] hover:bg-stone-50 transition-colors text-sm"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  {business.phone}
                </a>
              )}
              {business.google_maps_url && (
                <a
                  href={business.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-stone-300 text-stone-700 font-medium rounded-[var(--radius-button)] hover:bg-stone-50 transition-colors text-sm"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  Get Directions
                </a>
              )}
            </div>

            {/* Hours */}
            <div className="bg-surface-raised rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-5">
              <BusinessHours hours={business.hours} />
            </div>

            {/* Address */}
            {business.address && (
              <div className="bg-surface-raised rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-5">
                <h3 className="text-sm font-semibold text-stone-900 mb-2">Location</h3>
                <p className="text-sm text-stone-600">{business.address}</p>
                {business.city && (
                  <p className="text-sm text-stone-500">{business.city}, ON</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <EmailSignupBanner />
      </div>
    </>
  );
}
