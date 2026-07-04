"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/app/_lib/supabase/server";

interface State {
  error?: string;
}

export async function createIntervention(
  _prevState: State,
  formData: FormData
): Promise<State> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Niste prijavljeni." };

  const title = (formData.get("title") as string).trim();
  const description = (formData.get("description") as string).trim();
  const date = (formData.get("date") as string).trim();
  const location = (formData.get("location") as string).trim();
  const type = (formData.get("type") as string).trim();

  if (!title || !date || !location || !type) {
    return { error: "Izpolnite vsa obvezna polja." };
  }

  const { error } = await supabase.from("interventions").insert({
    title,
    description,
    date,
    location,
    type,
  });

  if (error) {
    return { error: `Napaka: ${error.message}` };
  }

  revalidatePath("/intervencije");
  revalidatePath("/");
  redirect("/admin/intervencije");
}

export async function deleteIntervention(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("interventions").delete().eq("id", id);
  revalidatePath("/intervencije");
  revalidatePath("/");
}
