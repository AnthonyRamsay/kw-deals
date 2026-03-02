import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BusinessForm } from "@/components/admin/business-form";

export const dynamic = "force-dynamic";

interface EditBusinessPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBusinessPage({ params }: EditBusinessPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: business }, { data: categories }] = await Promise.all([
    supabase.from("businesses").select("*").eq("id", id).single(),
    supabase.from("categories").select("*").order("display_order"),
  ]);

  if (!business) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">
        Edit: {business.name}
      </h1>
      <BusinessForm business={business} categories={categories || []} />
    </div>
  );
}
