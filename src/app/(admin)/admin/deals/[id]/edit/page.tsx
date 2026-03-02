import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DealForm } from "@/components/admin/deal-form";

export const dynamic = "force-dynamic";

interface EditDealPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDealPage({ params }: EditDealPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: deal }, { data: businesses }] = await Promise.all([
    supabase.from("deals").select("*").eq("id", id).single(),
    supabase.from("businesses").select("id, name").eq("is_active", true).order("name"),
  ]);

  if (!deal) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">
        Edit: {deal.title}
      </h1>
      <DealForm deal={deal} businesses={businesses || []} />
    </div>
  );
}
