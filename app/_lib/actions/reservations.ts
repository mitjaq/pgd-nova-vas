"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/app/_lib/supabase/server";

export type ReservationType = "dvorana" | "piknik";

interface State {
  success?: boolean;
  error?: string;
}

export async function createReservation(
  type: ReservationType,
  _prevState: State,
  formData: FormData
): Promise<State> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const phone = (formData.get("phone") as string | null)?.trim() ?? "";
  const date = (formData.get("date") as string | null)?.trim() ?? "";
  const purpose = (formData.get("purpose") as string | null)?.trim() ?? "";
  const notes = (formData.get("notes") as string | null)?.trim() || null;
  const time_slot =
    type === "dvorana"
      ? (formData.get("time_slot") as string | null)?.trim() ?? ""
      : null;

  if (!name || !email || !phone || !date || !purpose) {
    return { error: "Izpolnite vsa obvezna polja." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Vnesite veljaven e-poštni naslov." };
  }

  if (type === "dvorana" && !time_slot) {
    return { error: "Izberite časovni termin." };
  }

  // Validate date is in the future
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (new Date(date) < today) {
    return { error: "Izberite datum v prihodnosti." };
  }

  const supabase = await createClient();

  // Check availability
  if (type === "dvorana") {
    const { data: existing } = await supabase
      .from("reservations")
      .select("time_slot")
      .eq("type", "dvorana")
      .eq("date", date)
      .in("status", ["caka", "potrjeno"]);

    if (existing) {
      const takenSlots = existing.map((r) => r.time_slot);
      if (takenSlots.includes("celdan")) {
        return { error: "Ta datum je že v celoti zaseden." };
      }
      if (time_slot === "celdan" && takenSlots.length > 0) {
        return { error: "Na ta datum so nekateri termini že zasedeni. Rezervacija za cel dan ni mogoča." };
      }
      if (takenSlots.includes(time_slot)) {
        return { error: "Ta termin je že zaseden. Izberite drug termin ali datum." };
      }
    }
  } else {
    const { data: existing } = await supabase
      .from("reservations")
      .select("id")
      .eq("type", "piknik")
      .eq("date", date)
      .in("status", ["caka", "potrjeno"]);

    if (existing && existing.length > 0) {
      return { error: "Ta datum je že zaseden. Izberite drug datum." };
    }
  }

  const { error } = await supabase.from("reservations").insert({
    type,
    date,
    time_slot,
    name,
    email,
    phone,
    purpose,
    notes,
    status: "caka",
  });

  if (error) {
    return { error: `Napaka pri oddaji rezervacije: ${error.message}` };
  }

  revalidatePath(`/rezervacija/${type}`);
  return { success: true };
}

export async function updateReservationStatus(
  id: string,
  status: "potrjeno" | "zavrnjeno",
  admin_notes?: string
): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("reservations")
    .update({ status, admin_notes: admin_notes ?? null })
    .eq("id", id);
  revalidatePath("/admin/rezervacije");
}

export async function deleteReservation(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("reservations").delete().eq("id", id);
  revalidatePath("/admin/rezervacije");
}
