import { NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe/server";
import { TIERS, type TierKey } from "@/lib/stripe/config";
import { getBaseUrl } from "@/lib/utils";

const schema = z.object({
  tier: z.enum(["basic", "featured", "spotlight"]),
  businessEmail: z.string().email().optional(),
  businessId: z.string().uuid().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const { tier, businessEmail, businessId } = parsed.data;
    const tierConfig = TIERS[tier as TierKey];

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: tierConfig.priceId,
          quantity: 1,
        },
      ],
      success_url: `${getBaseUrl()}/pricing?success=true`,
      cancel_url: `${getBaseUrl()}/pricing?canceled=true`,
      metadata: {
        tier,
        ...(businessId && { businessId }),
      },
      ...(businessEmail && { customer_email: businessEmail }),
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 }
    );
  }
}
