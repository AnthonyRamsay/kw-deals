import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CategoryNav } from "@/components/category/category-nav";
import { DealGrid } from "@/components/deals/deal-grid";
import { FeaturedCarousel } from "@/components/deals/featured-carousel";
import { EmailSignupForm } from "@/components/email/email-signup-form";
import { EmailSignupBanner } from "@/components/email/email-signup-banner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const revalidate = 300;

async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("name, slug, icon")
    .order("display_order");
  return data || [];
}

async function getDeals() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("deals")
    .select(`
      slug, title, discount_value, deal_type, image_url,
      business:businesses!inner(
        name, slug, short_description, cover_image_url, city,
        subscription_tier, is_new, is_staff_pick,
        category:categories!inner(name, slug)
      )
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false });
  return data || [];
}

export default async function HomePage() {
  const [categories, deals] = await Promise.all([getCategories(), getDeals()]);

  const tierOrder = { spotlight: 0, featured: 1, basic: 2 };
  const sortedDeals = [...deals].sort((a, b) => {
    const aTier = (a.business as any)?.subscription_tier || "basic";
    const bTier = (b.business as any)?.subscription_tier || "basic";
    return (tierOrder[aTier as keyof typeof tierOrder] || 2) -
      (tierOrder[bTier as keyof typeof tierOrder] || 2);
  });

  const featuredDeals = sortedDeals.filter((d) => {
    const tier = (d.business as any)?.subscription_tier;
    return tier === "featured" || tier === "spotlight";
  });

  const formattedDeals = sortedDeals.map((d) => ({
    slug: d.slug,
    title: d.title,
    discount_value: d.discount_value,
    deal_type: d.deal_type,
    image_url: d.image_url,
    business: d.business as any,
  }));

  const formattedFeatured = featuredDeals.map((d) => ({
    slug: d.slug,
    title: d.title,
    discount_value: d.discount_value,
    image_url: d.image_url,
    business: d.business as any,
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-50 via-white to-brand-50/50 py-12 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-3xl sm:text-5xl font-bold text-stone-900 mb-4">
              Discover the best deals in{" "}
              <span className="text-brand-500">Kitchener-Waterloo</span>
            </h1>
            <p className="text-lg text-stone-600 mb-8 max-w-2xl mx-auto">
              Exclusive deals from local restaurants, shops, and businesses. Updated weekly, curated by KW Rising.
            </p>
            <div className="max-w-md mx-auto">
              <EmailSignupForm />
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          {/* Category navigation */}
          <CategoryNav categories={categories} />

          {/* Featured carousel */}
          {formattedFeatured.length > 0 && (
            <FeaturedCarousel deals={formattedFeatured} />
          )}

          {/* All deals */}
          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-4">All Deals</h2>
            <DealGrid deals={formattedDeals} />
          </section>
        </div>

        {/* Email signup banner */}
        <EmailSignupBanner />

        {/* Business CTA */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-3">
              Are you a local business?
            </h2>
            <p className="text-stone-600 mb-6">
              Get your deals in front of thousands of KW locals. Plans start at $49/month.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center px-6 py-3 bg-brand-500 text-white font-medium rounded-[var(--radius-button)] hover:bg-brand-600 transition-colors shadow-sm"
            >
              View Plans
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
