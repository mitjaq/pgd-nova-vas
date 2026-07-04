import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/app/_lib/supabase/server";
import type { Reservation } from "@/app/_lib/types";
import ReservationForm from "./ReservationForm";

export const metadata: Metadata = {
  title: "Rezervacija piknik prostora",
  description: "Rezervirajte piknik prostor PGD Nova vas pri Markovcih.",
};

export default async function PiknikPage() {
  const supabase = await createClient();

  const from = new Date();
  from.setDate(1);
  const to = new Date(from);
  to.setMonth(to.getMonth() + 3);

  const { data } = await supabase
    .from("reservations")
    .select("date")
    .eq("type", "piknik")
    .in("status", ["caka", "potrjeno"])
    .gte("date", from.toLocaleDateString("en-CA"))
    .lte("date", to.toLocaleDateString("en-CA"));

  const bookedDates = (data ?? []).map((r) => (r as Pick<Reservation, "date">).date);

  return (
    <div>
      <section className="bg-pgd-gray text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/rezervacija" className="text-gray-400 hover:text-white text-sm mb-4 inline-block transition-colors">
            ← Nazaj na rezervacije
          </Link>
          <h1 className="text-4xl font-bold mb-4">Rezervacija piknik prostora</h1>
          <p className="text-gray-300 text-lg max-w-xl">
            Izberite datum. Piknik prostor je na voljo za cel dan. Rezervacija bo potrjena po e-pošti.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ReservationForm fullyBooked={bookedDates} />
      </section>
    </div>
  );
}
