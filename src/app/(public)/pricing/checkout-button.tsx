"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { TierKey } from "@/lib/stripe/config";

interface CheckoutButtonProps {
  tier: TierKey;
  popular: boolean;
}

export function CheckoutButton({ tier, popular }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleCheckout}
      loading={loading}
      variant={popular ? "primary" : "outline"}
      size="lg"
      className="w-full"
    >
      Get Started
    </Button>
  );
}
