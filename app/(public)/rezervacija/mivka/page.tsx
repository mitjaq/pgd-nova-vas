import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/app/_lib/supabase/server";
import type { Reservation } from "@/app/_lib/types";
import ReservationForm from "./ReservationForm";

export const metadata: Metadata = {
  title: "Rezervacija odbojke na mivki",
  description: "Rezervirajte igrišče za odbojko na mivki PGD Nova vas pri Markovcih.",
};

export default async function MivkaPage() {
  const supabase = await createClient();

  const from = new Date();
  from.setDate(1);
  const to = new Date(from);
  to.setMonth(to.getMonth() + 3);

  const { data } = await supabase
    .from("reservations")
    .select("date, time_slot")
    .eq("type", "mivka")
    .in("status", ["caka", "potrjeno"])
    .gte("date", from.toLocaleDateString("en-CA"))
    .lte("date", to.toLocaleDateString("en-CA"));

  const reservations = data ?? [] as Reservation[];

  const fullyBooked: string[] = [];
  const partiallyBooked: string[] = [];
  const takenSlotsByDate: Record<string, string[]> = {};

  // All possible hours for mivka: 8-23 (15 hours)
  const allHours = Array.from({ length: 15 }, (_, i) => 8 + i);

  for (const r of reservations) {
    const date = r.date;
    if (!takenSlotsByDate[date]) {
      takenSlotsByDate[date] = [];
    }
    if (r.time_slot) {
      // time_slot can be comma-separated: "10-11,11-12,12-13"
      const slots = r.time_slot.split(",").map((s) => s.trim());
      for (const slot of slots) {
        if (!takenSlotsByDate[date].includes(slot)) {
          takenSlotsByDate[date].push(slot);
        }
      }
    }
  }

  // Determine fully/partially booked based on individual hours
  for (const [date, slots] of Object.entries(takenSlotsByDate)) {
    // Parse all taken hours
    const takenHours = new Set<number>();
    for (const slot of slots) {
      const parts = slot.split("-");
      if (parts.length === 2) {
        const startHour = parseInt(parts[0], 10);
        if (!isNaN(startHour) && startHour >= 8 && startHour < 23) {
          takenHours.add(startHour);
        }
      }
    }
    
    if (takenHours.size >= allHours.length) {
      fullyBooked.push(date);
    } else if (takenHours.size > 0) {
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
          <h1 className="text-4xl font-bold mb-4">Rezervacija odbojke na mivki</h1>
          <p className="text-gray-300 text-lg max-w-xl">
            Izberite datum in časovni termin. Igrišče za odbojko na mivki je na voljo po urah. Rezervacija bo potrjena po e-pošti.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ReservationForm
          fullyBooked={fullyBooked}
          partiallyBooked={partiallyBooked}
          takenSlotsByDate={takenSlotsByDate}
        />
      </section>
    </div>
  );
}
