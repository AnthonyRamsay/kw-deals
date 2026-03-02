import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().optional(),
  source: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, name, source } = parsed.data;
    const supabase = createAdminClient();

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("email_subscribers")
      .select("id, unsubscribed_at")
      .eq("email", email)
      .single();

    if (existing && !existing.unsubscribed_at) {
      return NextResponse.json({ message: "You're already subscribed!" });
    }

    if (existing && existing.unsubscribed_at) {
      // Re-subscribe
      await supabase
        .from("email_subscribers")
        .update({ unsubscribed_at: null, is_confirmed: true })
        .eq("id", existing.id);
      return NextResponse.json({ message: "Welcome back! You're re-subscribed." });
    }

    // New subscriber
    const confirmationToken = crypto.randomUUID();
    const { error } = await supabase.from("email_subscribers").insert({
      email,
      name,
      source: source || "website",
      confirmation_token: confirmationToken,
      is_confirmed: true, // Skip double opt-in for MVP
    });

    if (error) {
      console.error("Email subscribe error:", error);
      return NextResponse.json(
        { error: "Failed to subscribe. Try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "You're subscribed! We'll send you the best KW deals every week.",
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
