"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import slugify from "slugify";
import { createAdminClient } from "@/lib/supabase/admin";

const dealSchema = z.object({
  title: z.string().min(1, "Title is required"),
  business_id: z.string().uuid("Select a business"),
  description: z.string().optional(),
  deal_type: z.enum(["percentage", "bogo", "fixed", "freebie", "special"]).optional(),
  discount_value: z.string().optional(),
  terms: z.string().optional(),
  image_url: z.string().optional(),
  status: z.enum(["draft", "active", "expired", "archived"]).default("draft"),
  starts_at: z.string().optional().nullable(),
  expires_at: z.string().optional().nullable(),
  is_featured: z.coerce.boolean().default(false),
});

export async function createDeal(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = dealSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const data = parsed.data;
  const slug = slugify(data.title, { lower: true, strict: true }) + "-" + Date.now().toString(36);
  const supabase = createAdminClient();

  const { error } = await supabase.from("deals").insert({
    ...data,
    slug,
    starts_at: data.starts_at || null,
    expires_at: data.expires_at || null,
    image_url: data.image_url || null,
  });

  if (error) {
    console.error("Create deal error:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/deals");
  redirect("/admin/deals");
}

export async function updateDeal(id: string, formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = dealSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const data = parsed.data;
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("deals")
    .update({
      ...data,
      starts_at: data.starts_at || null,
      expires_at: data.expires_at || null,
      image_url: data.image_url || null,
    })
    .eq("id", id);

  if (error) {
    console.error("Update deal error:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/deals");
  redirect("/admin/deals");
}

export async function deleteDeal(id: string) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("deals").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/deals");
}
