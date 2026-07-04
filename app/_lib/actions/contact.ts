"use server";

import { createClient } from "@/app/_lib/supabase/server";

interface State {
  success: boolean;
  error: string;
}

export async function submitContactForm(
  _prevState: State,
  formData: FormData
): Promise<State> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const phone = (formData.get("phone") as string | null)?.trim() || null;
  const message = (formData.get("message") as string | null)?.trim() ?? "";

  if (!name || !email || !message) {
    return { success: false, error: "Izpolnite vsa obvezna polja." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Vnesite veljavni e-poštni naslov." };
  }

  if (message.length < 10) {
    return { success: false, error: "Sporočilo mora vsebovati vsaj 10 znakov." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    phone,
    message,
  });

  if (error) {
    return { success: false, error: "Napaka pri pošiljanju. Poskusite znova." };
  }

  return { success: true, error: "" };
}
