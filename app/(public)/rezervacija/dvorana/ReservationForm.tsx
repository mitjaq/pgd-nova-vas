"use client";

import { useActionState, useState } from "react";
import { createReservation } from "@/app/_lib/actions/reservations";
import Calendar from "@/app/_components/ui/Calendar";
import Button from "@/app/_components/ui/Button";

const TIME_SLOTS = [
  { id: "dopoldne", label: "Dopoldne", time: "8:00 – 13:00" },
  { id: "popoldne", label: "Popoldne", time: "13:00 – 18:00" },
  { id: "vecer", label: "Večer", time: "18:00 – 23:00" },
  { id: "celdan", label: "Cel dan", time: "8:00 – 23:00" },
];

interface Props {
  fullyBooked: string[];
  partiallyBooked: string[];
  takenSlotsByDate: Record<string, string[]>;
}

const action = createReservation.bind(null, "dvorana");
const initialState = { success: false, error: "" };

export default function ReservationForm({
  fullyBooked,
  partiallyBooked,
  takenSlotsByDate,
}: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  if (state.success) {
    return (
      <div className="max-w-lg mx-auto bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-green-800 mb-2">Rezervacija oddana!</h2>
        <p className="text-green-700 text-sm leading-relaxed">
          Vaša rezervacija dvorane je bila uspešno oddana. Potrditev boste prejeli na navedeni e-poštni naslov v najkrajšem možnem času.
        </p>
      </div>
    );
  }

  const takenOnSelected = selectedDate ? (takenSlotsByDate[selectedDate] ?? []) : [];

  function isSlotTaken(slotId: string) {
    if (takenOnSelected.includes("celdan")) return true;
    if (slotId === "celdan" && takenOnSelected.length > 0) return true;
    return takenOnSelected.includes(slotId);
  }

  function handleDateSelect(date: string) {
    setSelectedDate(date);
    setSelectedSlot(null);
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
          onSelect={handleDateSelect}
          fullyBooked={fullyBooked}
          partiallyBooked={partiallyBooked}
        />
      </div>

      {/* Right: Slots + Form */}
      <div>
        {!selectedDate ? (
          <div className="flex items-center justify-center h-full text-center text-gray-400 py-16">
            <div>
              <div className="text-4xl mb-3">📅</div>
              <p>Najprej izberite datum na koledarju.</p>
            </div>
          </div>
        ) : (
          <form action={formAction} className="space-y-5">
            <input type="hidden" name="date" value={selectedDate} />
            <input type="hidden" name="time_slot" value={selectedSlot ?? ""} />

            {state.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                {state.error}
              </div>
            )}

            <div>
              <h2 className="font-bold text-pgd-gray mb-3 text-lg">2. Izberite termin</h2>
              <p className="text-sm text-gray-500 mb-3">
                Datum: <strong>{formatDateSl(selectedDate)}</strong>
              </p>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const taken = isSlotTaken(slot.id);
                  const active = selectedSlot === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => !taken && setSelectedSlot(slot.id)}
                      disabled={taken}
                      className={`rounded-xl border-2 p-3 text-left transition-all ${
                        taken
                          ? "border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed"
                          : active
                          ? "border-pgd-red bg-pgd-red-light text-pgd-red"
                          : "border-gray-200 hover:border-pgd-red hover:bg-pgd-red-light cursor-pointer"
                      }`}
                    >
                      <div className="font-semibold text-sm">{slot.label}</div>
                      <div className="text-xs mt-0.5 opacity-70">{slot.time}</div>
                      {taken && <div className="text-xs text-red-400 mt-0.5">Zasedeno</div>}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedSlot && (
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <h2 className="font-bold text-pgd-gray text-lg pt-1">3. Vaši podatki</h2>

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
                    Namen rezervacije <span className="text-pgd-red">*</span>
                  </label>
                  <input
                    name="purpose"
                    type="text"
                    required
                    placeholder="Npr. rojstni dan, sestanek, prireditev..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pgd-red"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dodatne opombe
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    placeholder="Posebne zahteve, število gostov..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pgd-red resize-none"
                  />
                </div>

                <Button type="submit" loading={pending} className="w-full">
                  Oddaj rezervacijo
                </Button>

                <p className="text-xs text-gray-400 text-center">
                  Rezervacija bo potrjena po e-pošti. Cena po dogovoru.
                </p>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
