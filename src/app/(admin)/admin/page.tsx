import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: businessCount },
    { count: dealCount },
    { count: subscriberCount },
  ] = await Promise.all([
    supabase.from("businesses").select("*", { count: "exact", head: true }),
    supabase.from("deals").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("email_subscribers").select("*", { count: "exact", head: true }).eq("is_confirmed", true),
  ]);

  const stats = [
    { label: "Total Businesses", value: businessCount || 0, href: "/admin/businesses" },
    { label: "Active Deals", value: dealCount || 0, href: "/admin/deals" },
    { label: "Email Subscribers", value: subscriberCount || 0, href: "/admin/subscribers" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/businesses/new"
            className="inline-flex items-center px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-[var(--radius-button)] hover:bg-brand-600 transition-colors"
          >
            Add Business
          </Link>
          <Link
            href="/admin/deals/new"
            className="inline-flex items-center px-4 py-2 border border-stone-300 text-stone-700 text-sm font-medium rounded-[var(--radius-button)] hover:bg-stone-50 transition-colors"
          >
            Add Deal
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-surface-raised rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-6 hover:shadow-[var(--shadow-card-hover)] transition-shadow"
          >
            <p className="text-sm font-medium text-stone-500">{stat.label}</p>
            <p className="text-3xl font-bold text-stone-900 mt-1">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-surface-raised rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-6">
        <h2 className="text-lg font-semibold text-stone-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/admin/businesses/new"
            className="flex items-center gap-3 p-4 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
          >
            <div className="p-2 bg-brand-50 rounded-lg">
              <svg className="h-5 w-5 text-brand-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-stone-900">Add a Business</p>
              <p className="text-xs text-stone-500">Create a new business listing</p>
            </div>
          </Link>
          <Link
            href="/admin/deals/new"
            className="flex items-center gap-3 p-4 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
          >
            <div className="p-2 bg-emerald-50 rounded-lg">
              <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-stone-900">Create a Deal</p>
              <p className="text-xs text-stone-500">Add a new deal for a business</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
