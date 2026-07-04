import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/app/_lib/supabase/server";
import type { Reservation } from "@/app/_lib/types";
import ReservationForm from "./ReservationForm";

export const metadata: Metadata = {
  title: "Rezervacija dvorane",
  description: "Rezervirajte dvorano PGD Nova vas pri Markovcih.",
};

export type SlotAvailability = {
  date: string;
  slots: string[]; // taken slots
};

export default async function DvoranaPage() {
  const supabase = await createClient();

  // Fetch next 3 months of reservations
  const from = new Date();
  from.setDate(1);
  const to = new Date(from);
  to.setMonth(to.getMonth() + 3);

  const { data } = await supabase
    .from("reservations")
    .select("date, time_slot")
    .eq("type", "dvorana")
    .in("status", ["caka", "potrjeno"])
    .gte("date", from.toLocaleDateString("en-CA"))
    .lte("date", to.toLocaleDateString("en-CA"));

  const reservations = (data ?? []) as Pick<Reservation, "date" | "time_slot">[];

  // Group by date
  const byDate: Record<string, string[]> = {};
  for (const r of reservations) {
    if (!byDate[r.date]) byDate[r.date] = [];
    if (r.time_slot) byDate[r.date].push(r.time_slot);
  }

  // Classify dates
  const allSlots = ["dopoldne", "popoldne", "vecer"];
  const fullyBooked: string[] = [];
  const partiallyBooked: string[] = [];

  for (const [date, slots] of Object.entries(byDate)) {
    if (
      slots.includes("celdan") ||
      allSlots.every((s) => slots.includes(s))
    ) {
      fullyBooked.push(date);
    } else {
      partiallyBooked.push(date);
    }
  }

  return (
    <div>
      <section className="bg-pgd-gray text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/rezervacija" className="text-gray-400 hover:text-white text-sm mb-4 inline-block transition-colors">
            ← Nazaj na rezervacije
          </Link>
          <h1 className="text-4xl font-bold mb-4">Rezervacija dvorane</h1>
          <p className="text-gray-300 text-lg max-w-xl">
            Izberite datum in termin. Rezervacija bo potrjena po e-pošti.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ReservationForm
          fullyBooked={fullyBooked}
          partiallyBooked={partiallyBooked}
          takenSlotsByDate={byDate}
        />
      </section>
    </div>
  );
}
