"use client";

import { useActionState, useState } from "react";
import { createReservation } from "@/app/_lib/actions/reservations";
import Calendar from "@/app/_components/ui/Calendar";
import Button from "@/app/_components/ui/Button";

interface Props {
  fullyBooked: string[];
}

const action = createReservation.bind(null, "piknik");
const initialState = { success: false, error: "" };

export default function ReservationForm({ fullyBooked }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  if (state.success) {
    return (
      <div className="max-w-lg mx-auto bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-green-800 mb-2">Rezervacija oddana!</h2>
        <p className="text-green-700 text-sm leading-relaxed">
          Vaša rezervacija piknik prostora je bila uspešno oddana. Potrditev boste prejeli na navedeni e-poštni naslov v najkrajšem možnem času.
        </p>
      </div>
    );
  }

  const formatDateSl = (dateStr: string) => {
    return new Date(dateStr + "T12:00:00").toLocaleDateString("sl-SI", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Left: Calendar */}
      <div>
        <h2 className="font-bold text-pgd-gray mb-4 text-lg">1. Izberite datum</h2>
        <Calendar
          selected={selectedDate}
          onSelect={setSelectedDate}
          fullyBooked={fullyBooked}
        />

        <div className="mt-4 bg-green-50 rounded-xl p-4 text-sm text-gray-600">
          <p className="font-semibold text-gray-700 mb-2">🌿 Piknik prostor vključuje:</p>
          <ul className="space-y-1 text-gray-500">
            <li>• Zunanji prostor z mizo in klopmi za do 40 oseb</li>
            <li>• Žar in osnovna orodja</li>
            <li>• Dostop do sanitarij</li>
            <li>• Parkirišče</li>
          </ul>
        </div>
      </div>

      {/* Right: Form */}
      <div>
        {!selectedDate ? (
          <div className="flex items-center justify-center h-full text-center text-gray-400 py-16">
            <div>
              <div className="text-4xl mb-3">📅</div>
              <p>Najprej izberite datum na koledarju.</p>
            </div>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="date" value={selectedDate} />

            {state.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                {state.error}
              </div>
            )}

            <div className="bg-pgd-red-light rounded-xl px-4 py-3 text-sm">
              <p className="text-pgd-gray font-semibold">
                Izbran datum: {formatDateSl(selectedDate)}
              </p>
              <p className="text-gray-500 text-xs mt-0.5">Rezervacija za cel dan (8:00 – 20:00)</p>
            </div>

            <h2 className="font-bold text-pgd-gray text-lg">2. Vaši podatki</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ime in priimek <span className="text-pgd-red">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Janez Novak"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pgd-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon <span className="text-pgd-red">*</span>
                </label>
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="+386 41 123 456"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pgd-red"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-pošta <span className="text-pgd-red">*</span>
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="janez@example.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pgd-red"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Namen / prireditev <span className="text-pgd-red">*</span>
              </label>
              <input
                name="purpose"
                type="text"
                required
                placeholder="Npr. rojstni dan, piknik, žur..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pgd-red"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opombe (število oseb, posebne zahteve)
              </label>
              <textarea
                name="notes"
                rows={3}
                placeholder="Npr. 20 oseb, alergije na dim..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pgd-red resize-none"
              />
            </div>

            <Button type="submit" loading={pending} className="w-full">
              Oddaj rezervacijo
            </Button>

            <p className="text-xs text-gray-400 text-center">
              Rezervacija bo potrjena po e-pošti. Cena po dogovoru.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
