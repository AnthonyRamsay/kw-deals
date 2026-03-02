"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import slugify from "slugify";
import { createAdminClient } from "@/lib/supabase/admin";

const businessSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  short_description: z.string().optional(),
  category_id: z.string().uuid("Select a category"),
  address: z.string().optional(),
  city: z.string().optional(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  website_url: z.string().url().optional().or(z.literal("")),
  booking_url: z.string().url().optional().or(z.literal("")),
  google_maps_url: z.string().url().optional().or(z.literal("")),
  subscription_tier: z.enum(["basic", "featured", "spotlight"]).default("basic"),
  is_active: z.coerce.boolean().default(true),
  is_new: z.coerce.boolean().default(false),
  is_staff_pick: z.coerce.boolean().default(false),
  cover_image_url: z.string().optional(),
  logo_url: z.string().optional(),
});

export async function createBusiness(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = businessSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const data = parsed.data;
  const slug = slugify(data.name, { lower: true, strict: true });
  const supabase = createAdminClient();

  const { error } = await supabase.from("businesses").insert({
    ...data,
    slug,
    email: data.email || null,
    website_url: data.website_url || null,
    booking_url: data.booking_url || null,
    google_maps_url: data.google_maps_url || null,
    latitude: data.latitude || null,
    longitude: data.longitude || null,
    cover_image_url: data.cover_image_url || null,
    logo_url: data.logo_url || null,
  });

  if (error) {
    console.error("Create business error:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/businesses");
  redirect("/admin/businesses");
}

export async function updateBusiness(id: string, formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = businessSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const data = parsed.data;
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("businesses")
    .update({
      ...data,
      email: data.email || null,
      website_url: data.website_url || null,
      booking_url: data.booking_url || null,
      google_maps_url: data.google_maps_url || null,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      cover_image_url: data.cover_image_url || null,
      logo_url: data.logo_url || null,
    })
    .eq("id", id);

  if (error) {
    console.error("Update business error:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/businesses");
  redirect("/admin/businesses");
}

export async function deleteBusiness(id: string) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("businesses")
    .update({ is_active: false })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/businesses");
}

export async function toggleBusinessActive(id: string, isActive: boolean) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("businesses")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/businesses");
}
