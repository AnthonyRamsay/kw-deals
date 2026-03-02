import { createAdminClient } from "@/lib/supabase/admin";

interface ConfirmPageProps {
  params: Promise<{ token: string }>;
}

export default async function ConfirmPage({ params }: ConfirmPageProps) {
  const { token } = await params;
  const supabase = createAdminClient();

  const { data: subscriber } = await supabase
    .from("email_subscribers")
    .select("id, is_confirmed")
    .eq("confirmation_token", token)
    .single();

  if (!subscriber) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-stone-900 mb-2">Invalid Link</h1>
        <p className="text-stone-600">This confirmation link is invalid or has expired.</p>
      </div>
    );
  }

  if (!subscriber.is_confirmed) {
    await supabase
      .from("email_subscribers")
      .update({ is_confirmed: true })
      .eq("id", subscriber.id);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
        <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-stone-900 mb-2">You&apos;re Confirmed!</h1>
      <p className="text-stone-600">
        Thanks for subscribing to KW Deals. You&apos;ll receive the best deals in
        Kitchener-Waterloo in your inbox every week.
      </p>
    </div>
  );
}
