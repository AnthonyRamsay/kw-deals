"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createBusiness, updateBusiness } from "@/actions/businesses";
import type { Database } from "@/types/database";

type Business = Database["public"]["Tables"]["businesses"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];

interface BusinessFormProps {
  business?: Business;
  categories: Category[];
}

export function BusinessForm({ business, categories }: BusinessFormProps) {
  const action = business
    ? updateBusiness.bind(null, business.id)
    : createBusiness;

  const [state, formAction, pending] = useActionState(
    async (_prev: any, formData: FormData) => {
      const result = await action(formData);
      return result;
    },
    null
  );

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const tierOptions = [
    { value: "basic", label: "Basic ($49/mo)" },
    { value: "featured", label: "Featured ($99/mo)" },
    { value: "spotlight", label: "Spotlight ($199/mo)" },
  ];

  return (
    <form action={formAction} className="space-y-8 max-w-2xl">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[var(--radius-button)] text-sm">
          {state.error}
        </div>
      )}

      {/* Basic info */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-stone-900">Basic Information</legend>
        <Input
          name="name"
          label="Business Name"
          required
          defaultValue={business?.name}
          placeholder="e.g., The Good Bean Cafe"
        />
        <Textarea
          name="short_description"
          label="Short Description"
          defaultValue={business?.short_description || ""}
          placeholder="One-liner for deal cards (120 chars max)"
        />
        <Textarea
          name="description"
          label="Full Description"
          defaultValue={business?.description || ""}
          placeholder="Tell customers about this business..."
        />
        <Select
          name="category_id"
          label="Category"
          required
          options={categoryOptions}
          placeholder="Select a category"
          defaultValue={business?.category_id}
        />
      </fieldset>

      {/* Location */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-stone-900">Location</legend>
        <Input
          name="address"
          label="Address"
          defaultValue={business?.address || ""}
          placeholder="123 King St"
        />
        <Input
          name="city"
          label="City"
          defaultValue={business?.city || "Kitchener"}
          placeholder="Kitchener"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            name="latitude"
            label="Latitude"
            type="number"
            step="any"
            defaultValue={business?.latitude?.toString() || ""}
            placeholder="43.4516"
          />
          <Input
            name="longitude"
            label="Longitude"
            type="number"
            step="any"
            defaultValue={business?.longitude?.toString() || ""}
            placeholder="-80.4925"
          />
        </div>
        <Input
          name="google_maps_url"
          label="Google Maps URL"
          defaultValue={business?.google_maps_url || ""}
          placeholder="https://maps.google.com/..."
        />
      </fieldset>

      {/* Contact */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-stone-900">Contact</legend>
        <Input
          name="phone"
          label="Phone"
          defaultValue={business?.phone || ""}
          placeholder="(519) 555-0123"
        />
        <Input
          name="email"
          label="Email"
          type="email"
          defaultValue={business?.email || ""}
          placeholder="hello@business.com"
        />
        <Input
          name="website_url"
          label="Website"
          defaultValue={business?.website_url || ""}
          placeholder="https://www.business.com"
        />
        <Input
          name="booking_url"
          label="Booking URL"
          defaultValue={business?.booking_url || ""}
          placeholder="https://booking.com/..."
        />
      </fieldset>

      {/* Media */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-stone-900">Media</legend>
        <Input
          name="cover_image_url"
          label="Cover Image URL"
          defaultValue={business?.cover_image_url || ""}
          placeholder="https://..."
          helperText="Paste an image URL (Supabase storage upload coming soon)"
        />
        <Input
          name="logo_url"
          label="Logo URL"
          defaultValue={business?.logo_url || ""}
          placeholder="https://..."
        />
      </fieldset>

      {/* Subscription & Badges */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-stone-900">Subscription & Badges</legend>
        <Select
          name="subscription_tier"
          label="Subscription Tier"
          options={tierOptions}
          defaultValue={business?.subscription_tier || "basic"}
        />
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_active"
              value="true"
              defaultChecked={business?.is_active ?? true}
              className="rounded border-stone-300 text-brand-500 focus:ring-brand-500"
            />
            Active
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_new"
              value="true"
              defaultChecked={business?.is_new ?? false}
              className="rounded border-stone-300 text-brand-500 focus:ring-brand-500"
            />
            New in KW
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_staff_pick"
              value="true"
              defaultChecked={business?.is_staff_pick ?? false}
              className="rounded border-stone-300 text-brand-500 focus:ring-brand-500"
            />
            Staff Pick
          </label>
        </div>
      </fieldset>

      <div className="flex gap-3">
        <Button type="submit" loading={pending}>
          {business ? "Update Business" : "Create Business"}
        </Button>
      </div>
    </form>
  );
}
