import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CategoryNav } from "@/components/category/category-nav";
import { DealGrid } from "@/components/deals/deal-grid";
import { EmailSignupBanner } from "@/components/email/email-signup-banner";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("name, description")
    .eq("slug", slug)
    .single();

  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} Deals in Kitchener-Waterloo`,
    description: category.description || `Browse ${category.name} deals in KW.`,
  };
}

export async function generateStaticParams() {
  // Return known category slugs for static generation
  return [
    { slug: "food-and-drink" },
    { slug: "retail" },
    { slug: "services" },
    { slug: "entertainment" },
    { slug: "new-openings" },
  ];
}

export const revalidate = 300;

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const [{ data: category }, { data: categories }, { data: deals }] = await Promise.all([
    supabase.from("categories").select("*").eq("slug", slug).single(),
    supabase.from("categories").select("name, slug, icon").order("display_order"),
    supabase
      .from("deals")
      .select(`
        slug, title, discount_value, deal_type, image_url,
        business:businesses!inner(
          name, slug, short_description, cover_image_url, city,
          subscription_tier, is_new, is_staff_pick, category_id,
          category:categories!inner(name, slug)
        )
      `)
      .eq("status", "active")
      .order("created_at", { ascending: false }),
  ]);

  if (!category) notFound();

  // Filter deals by category
  const categoryDeals = (deals || []).filter(
    (d) => (d.business as any)?.category?.slug === slug
  );

  // Sort by tier
  const tierOrder = { spotlight: 0, featured: 1, basic: 2 };
  const sortedDeals = categoryDeals.sort((a, b) => {
    const aTier = (a.business as any)?.subscription_tier || "basic";
    const bTier = (b.business as any)?.subscription_tier || "basic";
    return (tierOrder[aTier as keyof typeof tierOrder] || 2) -
      (tierOrder[bTier as keyof typeof tierOrder] || 2);
  });

  const formattedDeals = sortedDeals.map((d) => ({
    slug: d.slug,
    title: d.title,
    discount_value: d.discount_value,
    deal_type: d.deal_type,
    image_url: d.image_url,
    business: d.business as any,
  }));

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Category header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-stone-600">{category.description}</p>
          )}
        </div>

        {/* Category nav */}
        <CategoryNav categories={categories || []} />

        {/* Deals */}
        <DealGrid deals={formattedDeals} />
      </div>

      <EmailSignupBanner />
    </>
  );
}
