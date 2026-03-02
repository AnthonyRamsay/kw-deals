import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function BusinessesPage() {
  const supabase = await createClient();

  const { data: businesses } = await supabase
    .from("businesses")
    .select("*, category:categories(name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Businesses</h1>
        <Link
          href="/admin/businesses/new"
          className="inline-flex items-center px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-[var(--radius-button)] hover:bg-brand-600 transition-colors"
        >
          Add Business
        </Link>
      </div>

      <div className="bg-surface-raised rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50">
                <th className="text-left px-4 py-3 font-medium text-stone-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Category</th>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Tier</th>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Status</th>
                <th className="text-right px-4 py-3 font-medium text-stone-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {businesses?.map((business) => (
                <tr key={business.id} className="border-b border-stone-100 hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-stone-900">{business.name}</p>
                      <p className="text-xs text-stone-500">{business.city}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{(business.category as any)?.name}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        business.subscription_tier === "spotlight"
                          ? "premium"
                          : business.subscription_tier === "featured"
                          ? "brand"
                          : "default"
                      }
                    >
                      {business.subscription_tier}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={business.is_active ? "success" : "default"}>
                      {business.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/businesses/${business.id}/edit`}
                      className="text-brand-600 hover:text-brand-700 font-medium"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {(!businesses || businesses.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-stone-500">
                    No businesses yet. Add your first one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
