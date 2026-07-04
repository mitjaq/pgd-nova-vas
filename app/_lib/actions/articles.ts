"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/app/_lib/supabase/server";

interface State {
  error?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createArticle(
  _prevState: State,
  formData: FormData
): Promise<State> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Niste prijavljeni." };

  const title = (formData.get("title") as string).trim();
  const excerpt = (formData.get("excerpt") as string).trim();
  const content = (formData.get("content") as string).trim();
  const image_url = (formData.get("image_url") as string).trim() || null;
  const published = formData.get("published") === "true";

  if (!title || !excerpt || !content) {
    return { error: "Izpolnite vsa obvezna polja." };
  }

  const slug = slugify(title);

  const { error } = await supabase.from("articles").insert({
    title,
    slug,
    excerpt,
    content,
    image_url,
    published,
    author: user.email ?? "Admin",
    published_at: new Date().toISOString(),
  });

  if (error) {
    return { error: `Napaka: ${error.message}` };
  }

  revalidatePath("/novice");
  revalidatePath("/");
  redirect("/admin/novice");
}

export async function updateArticle(
  id: string,
  _prevState: State,
  formData: FormData
): Promise<State> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Niste prijavljeni." };

  const title = (formData.get("title") as string).trim();
  const excerpt = (formData.get("excerpt") as string).trim();
  const content = (formData.get("content") as string).trim();
  const image_url = (formData.get("image_url") as string).trim() || null;
  const published = formData.get("published") === "true";

  if (!title || !excerpt || !content) {
    return { error: "Izpolnite vsa obvezna polja." };
  }

  const { error } = await supabase
    .from("articles")
    .update({ title, excerpt, content, image_url, published })
    .eq("id", id);

  if (error) {
    return { error: `Napaka: ${error.message}` };
  }

  revalidatePath("/novice");
  revalidatePath("/");
  redirect("/admin/novice");
}

export async function deleteArticle(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("articles").delete().eq("id", id);
  revalidatePath("/novice");
  revalidatePath("/");
}

export async function toggleArticlePublished(id: string, published: boolean): Promise<void> {
  const supabase = await createClient();
  await supabase.from("articles").update({ published }).eq("id", id);
  revalidatePath("/novice");
  revalidatePath("/");
}
