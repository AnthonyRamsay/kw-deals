import { createClient } from "@/lib/supabase/server";
import { DealForm } from "@/components/admin/deal-form";

export const dynamic = "force-dynamic";

export default async function NewDealPage() {
  const supabase = await createClient();
  const { data: businesses } = await supabase
    .from("businesses")
    .select("id, name")
    .eq("is_active", true)
    .order("name");

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Create Deal</h1>
      <DealForm businesses={businesses || []} />
    </div>
  );
}
