import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DealsPage() {
  const supabase = await createClient();

  const { data: deals } = await supabase
    .from("deals")
    .select("*, business:businesses(name)")
    .order("created_at", { ascending: false });

  const statusVariant = (status: string) => {
    switch (status) {
      case "active": return "success" as const;
      case "draft": return "default" as const;
      case "expired": return "warning" as const;
      case "archived": return "outline" as const;
      default: return "default" as const;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Deals</h1>
        <Link
          href="/admin/deals/new"
          className="inline-flex items-center px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-[var(--radius-button)] hover:bg-brand-600 transition-colors"
        >
          Add Deal
        </Link>
      </div>

      <div className="bg-surface-raised rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50">
                <th className="text-left px-4 py-3 font-medium text-stone-600">Deal</th>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Business</th>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Clicks</th>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Created</th>
                <th className="text-right px-4 py-3 font-medium text-stone-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deals?.map((deal) => (
                <tr key={deal.id} className="border-b border-stone-100 hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-stone-900">{deal.title}</p>
                      {deal.discount_value && (
                        <p className="text-xs text-brand-600">{deal.discount_value}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {(deal.business as any)?.name}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant(deal.status)}>{deal.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-stone-600">{deal.click_count}</td>
                  <td className="px-4 py-3 text-stone-500 text-xs">
                    {formatDate(deal.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/deals/${deal.id}/edit`}
                      className="text-brand-600 hover:text-brand-700 font-medium"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {(!deals || deals.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-stone-500">
                    No deals yet. Create your first one!
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
