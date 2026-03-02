"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createDeal, updateDeal } from "@/actions/deals";
import type { Database } from "@/types/database";

type Deal = Database["public"]["Tables"]["deals"]["Row"];

interface DealFormProps {
  deal?: Deal;
  businesses: { id: string; name: string }[];
}

export function DealForm({ deal, businesses }: DealFormProps) {
  const action = deal ? updateDeal.bind(null, deal.id) : createDeal;

  const [state, formAction, pending] = useActionState(
    async (_prev: any, formData: FormData) => {
      const result = await action(formData);
      return result;
    },
    null
  );

  const businessOptions = businesses.map((b) => ({
    value: b.id,
    label: b.name,
  }));

  const dealTypeOptions = [
    { value: "percentage", label: "Percentage Off" },
    { value: "bogo", label: "Buy One Get One" },
    { value: "fixed", label: "Fixed Amount Off" },
    { value: "freebie", label: "Freebie" },
    { value: "special", label: "Special Offer" },
  ];

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "expired", label: "Expired" },
    { value: "archived", label: "Archived" },
  ];

  return (
    <form action={formAction} className="space-y-8 max-w-2xl">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[var(--radius-button)] text-sm">
          {state.error}
        </div>
      )}

      {/* Deal info */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-stone-900">Deal Information</legend>
        <Input
          name="title"
          label="Deal Title"
          required
          defaultValue={deal?.title}
          placeholder="e.g., 20% off all lattes this week"
        />
        <Select
          name="business_id"
          label="Business"
          required
          options={businessOptions}
          placeholder="Select a business"
          defaultValue={deal?.business_id}
        />
        <Textarea
          name="description"
          label="Description"
          defaultValue={deal?.description || ""}
          placeholder="Describe the deal in detail..."
        />
        <div className="grid grid-cols-2 gap-4">
          <Select
            name="deal_type"
            label="Deal Type"
            options={dealTypeOptions}
            placeholder="Select type"
            defaultValue={deal?.deal_type || ""}
          />
          <Input
            name="discount_value"
            label="Discount Value"
            defaultValue={deal?.discount_value || ""}
            placeholder="e.g., 20% OFF, BOGO, $5 OFF"
          />
        </div>
        <Textarea
          name="terms"
          label="Terms & Conditions"
          defaultValue={deal?.terms || ""}
          placeholder="Any fine print or conditions..."
        />
      </fieldset>

      {/* Status & dates */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-stone-900">Status & Schedule</legend>
        <Select
          name="status"
          label="Status"
          options={statusOptions}
          defaultValue={deal?.status || "draft"}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            name="starts_at"
            label="Start Date"
            type="datetime-local"
            defaultValue={deal?.starts_at?.slice(0, 16) || ""}
          />
          <Input
            name="expires_at"
            label="Expiry Date"
            type="datetime-local"
            defaultValue={deal?.expires_at?.slice(0, 16) || ""}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="is_featured"
            value="true"
            defaultChecked={deal?.is_featured ?? false}
            className="rounded border-stone-300 text-brand-500 focus:ring-brand-500"
          />
          Featured deal (shows in carousel)
        </label>
      </fieldset>

      {/* Media */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-stone-900">Media</legend>
        <Input
          name="image_url"
          label="Deal Image URL"
          defaultValue={deal?.image_url || ""}
          placeholder="https://..."
          helperText="Optional. Falls back to business cover image."
        />
      </fieldset>

      <div className="flex gap-3">
        <Button type="submit" loading={pending}>
          {deal ? "Update Deal" : "Create Deal"}
        </Button>
      </div>
    </form>
  );
}
