import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SubscribersPage() {
  const supabase = await createClient();

  const { data: subscribers } = await supabase
    .from("email_subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Email Subscribers</h1>
        <span className="text-sm text-stone-500">
          {subscribers?.length || 0} total subscribers
        </span>
      </div>

      <div className="bg-surface-raised rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50">
                <th className="text-left px-4 py-3 font-medium text-stone-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Source</th>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {subscribers?.map((sub) => (
                <tr key={sub.id} className="border-b border-stone-100 hover:bg-stone-50">
                  <td className="px-4 py-3 font-medium text-stone-900">{sub.email}</td>
                  <td className="px-4 py-3 text-stone-600">{sub.name || "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={sub.is_confirmed ? "success" : "warning"}>
                      {sub.is_confirmed ? "Confirmed" : "Pending"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-stone-500">{sub.source}</td>
                  <td className="px-4 py-3 text-stone-500 text-xs">
                    {formatDate(sub.subscribed_at)}
                  </td>
                </tr>
              ))}
              {(!subscribers || subscribers.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-stone-500">
                    No subscribers yet.
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
