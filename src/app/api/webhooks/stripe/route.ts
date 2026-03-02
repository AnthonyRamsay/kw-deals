import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SubscriptionTier } from "@/types/database";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const tier = session.metadata?.tier as SubscriptionTier;
        const businessId = session.metadata?.businessId;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (businessId && tier) {
          await supabase
            .from("businesses")
            .update({
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              subscription_tier: tier,
            })
            .eq("id", businessId);
        }

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;
          await supabase.from("subscriptions").upsert({
            id: subscriptionId,
            business_id: businessId || "00000000-0000-0000-0000-000000000000",
            status: subscription.status,
            price_id: subscription.items.data[0].price.id,
            tier: tier || "basic",
            current_period_start: new Date((subscription.current_period_start || 0) * 1000).toISOString(),
            current_period_end: new Date((subscription.current_period_end || 0) * 1000).toISOString(),
          });
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as any;
        const subscriptionId = invoice.subscription as string;
        if (subscriptionId) {
          await supabase
            .from("subscriptions")
            .update({ status: "active" })
            .eq("id", subscriptionId);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as any;
        const subscriptionId = invoice.subscription as string;
        if (subscriptionId) {
          await supabase
            .from("subscriptions")
            .update({ status: "past_due" })
            .eq("id", subscriptionId);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as any;
        const tier = subscription.metadata?.tier as SubscriptionTier;

        await supabase.from("subscriptions").upsert({
          id: subscription.id,
          business_id: subscription.metadata?.businessId || "00000000-0000-0000-0000-000000000000",
          status: subscription.status,
          price_id: subscription.items.data[0].price.id,
          tier: tier || "basic",
          cancel_at_period_end: subscription.cancel_at_period_end,
          current_period_start: new Date((subscription.current_period_start || 0) * 1000).toISOString(),
          current_period_end: new Date((subscription.current_period_end || 0) * 1000).toISOString(),
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        await supabase
          .from("subscriptions")
          .update({
            status: "canceled",
            ended_at: new Date().toISOString(),
          })
          .eq("id", subscription.id);

        const businessId = subscription.metadata?.businessId;
        if (businessId) {
          await supabase
            .from("businesses")
            .update({
              subscription_tier: "basic",
              stripe_subscription_id: null,
            })
            .eq("id", businessId);
        }
        break;
      }
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
