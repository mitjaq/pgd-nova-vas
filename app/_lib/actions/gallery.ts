"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/app/_lib/supabase/server";

interface State {
  error?: string;
  success?: boolean;
}

export async function addGalleryImage(
  _prevState: State,
  formData: FormData
): Promise<State> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Niste prijavljeni." };

  const url = (formData.get("url") as string).trim();
  const caption = (formData.get("caption") as string).trim() || null;
  const category = (formData.get("category") as string).trim() || null;

  if (!url) {
    return { error: "URL slike je obvezen." };
  }

  const { error } = await supabase.from("gallery_images").insert({ url, caption, category });

  if (error) {
    return { error: `Napaka: ${error.message}` };
  }

  revalidatePath("/galerija");
  return { success: true };
}

export async function deleteGalleryImage(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("gallery_images").delete().eq("id", id);
  revalidatePath("/galerija");
}
