import { createClient } from "@/lib/supabase/server";
import { BusinessForm } from "@/components/admin/business-form";

export const dynamic = "force-dynamic";

export default async function NewBusinessPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("display_order");

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Add Business</h1>
      <BusinessForm categories={categories || []} />
    </div>
  );
}
