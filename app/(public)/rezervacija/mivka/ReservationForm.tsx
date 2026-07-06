"use client";

import { useActionState, useState, useMemo } from "react";
import { createReservation } from "@/app/_lib/actions/reservations";
import Calendar from "@/app/_components/ui/Calendar";
import Button from "@/app/_components/ui/Button";

// Generate hourly slots from 8:00 to 23:00
const HOURLY_SLOTS = Array.from({ length: 15 }, (_, i) => {
  const startHour = 8 + i;
  const endHour = startHour + 1;
  return {
    id: `${startHour}-${endHour}`,
    label: `${startHour}:00 – ${endHour}:00`,
    startHour,
    endHour,
  };
});

// Slovenian plural of "ura" (hour): 1 ura, 2 uri, 3–4 ure, 5+ ur (by last two digits).
function pluralUre(n: number): string {
  const mod100 = n % 100;
  if (mod100 === 1) return "ura";
  if (mod100 === 2) return "uri";
  if (mod100 === 3 || mod100 === 4) return "ure";
  return "ur";
}

// Quick select groups
const QUICK_GROUPS = [
  { id: "dopoldne", label: "Dopoldne", hours: [8, 9, 10, 11, 12] },
  { id: "popoldne", label: "Popoldne", hours: [13, 14, 15, 16, 17] },
  { id: "vecer", label: "Večer", hours: [18, 19, 20, 21, 22] },
  { id: "celdan", label: "Cel dan", hours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22] },
];

interface Props {
  fullyBooked: string[];
  partiallyBooked: string[];
  takenSlotsByDate: Record<string, string[]>;
}

const action = createReservation.bind(null, "mivka");
const initialState = { success: false, error: "" };

export default function ReservationForm({
  fullyBooked,
  partiallyBooked,
  takenSlotsByDate,
}: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedHours, setSelectedHours] = useState<number[]>([]);

  const takenOnSelected = selectedDate ? (takenSlotsByDate[selectedDate] ?? []) : [];

  // Parse taken hours from stored time_slot (can be single hour like "10-11" or comma-separated like "10-11,11-12").
  // NOTE: this hook must run on every render, so it stays above the early return below (Rules of Hooks).
  const takenHours = useMemo(() => {
    const hours = new Set<number>();
    for (const slot of takenOnSelected) {
      // Both single ("10-11") and comma-separated ("10-11,11-12") forms split the same way.
      slot.split(",").forEach((s) => {
        const parts = s.trim().split("-");
        if (parts.length === 2) {
          const start = parseInt(parts[0], 10);
          if (!Number.isNaN(start)) hours.add(start);
        }
      });
    }
    return hours;
  }, [takenOnSelected]);

  if (state.success) {
    return (
      <div className="max-w-lg mx-auto bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-green-800 mb-2">Rezervacija oddana!</h2>
        <p className="text-green-700 text-sm leading-relaxed">
          Vaša rezervacija igrišča za odbojko na mivki je bila uspešno oddana. Potrditev boste prejeli na navedeni e-poštni naslov v najkrajšem možnem času.
        </p>
      </div>
    );
  }

  function isHourTaken(hour: number) {
    return takenHours.has(hour);
  }

  function handleDateSelect(date: string) {
    setSelectedDate(date);
    setSelectedHours([]);
  }

  function toggleHour(hour: number) {
    if (isHourTaken(hour)) return;
    setSelectedHours((prev) => {
      if (prev.includes(hour)) {
        return prev.filter((h) => h !== hour);
      }
      return [...prev, hour].sort((a, b) => a - b);
    });
  }

  function handleQuickSelect(group: typeof QUICK_GROUPS[0]) {
    const allAvailable = group.hours.every((h) => !isHourTaken(h));
    if (!allAvailable) return;
    setSelectedHours([...group.hours]);
  }

  function handleClearSelection() {
    setSelectedHours([]);
  }

  const formatDateSl = (dateStr: string) => {
    return new Date(dateStr + "T12:00:00").toLocaleDateString("sl-SI", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatHours = (hours: number[]) => {
    if (hours.length === 0) return "";
    if (hours.length === 15) return "Cel dan (8:00 – 23:00)";
    if (hours.length === 1) {
      return `${hours[0]}:00 – ${hours[0] + 1}:00`;
    }
    // Group consecutive hours
    const groups: number[][] = [];
    let currentGroup = [hours[0]];
    for (let i = 1; i < hours.length; i++) {
      if (hours[i] === hours[i - 1] + 1) {
        currentGroup.push(hours[i]);
      } else {
        groups.push(currentGroup);
        currentGroup = [hours[i]];
      }
    }
    groups.push(currentGroup);

    return groups
      .map((g) => `${g[0]}:00 – ${g[g.length - 1] + 1}:00`)
      .join(", ");
  };

  const selectedHoursStr = selectedHours.length > 0 ? selectedHours.map((h) => `${h}-${h + 1}`).join(",") : "";

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

        <div className="mt-4 bg-orange-50 rounded-xl p-4 text-sm text-gray-600">
          <p className="font-semibold text-gray-700 mb-2">🏐 Odbojka na mivki vključuje:</p>
          <ul className="space-y-1 text-gray-500">
            <li>• Označeno igrišče za odbojko na mivki</li>
            <li>• Mreža in stebri v uporabi</li>
            <li>• Parkirišče</li>
            <li>• Dostop do sanitarij</li>
          </ul>
        </div>
      </div>

      {/* Right: Hours + Form */}
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
            <input type="hidden" name="time_slot" value={selectedHoursStr} />

            {state.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                {state.error}
              </div>
            )}

            {/* Quick select groups */}
            <div>
              <h2 className="font-bold text-pgd-gray mb-3 text-lg">2. Izberite termin</h2>
              <p className="text-sm text-gray-500 mb-3">
                Datum: <strong>{formatDateSl(selectedDate)}</strong>
              </p>
              <p className="text-xs text-gray-400 mb-2">Hitra izbira:</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {QUICK_GROUPS.map((group) => {
                  const allAvailable = group.hours.every((h) => !isHourTaken(h));
                  const isActive = selectedHours.length > 0 && selectedHours.every((h) => group.hours.includes(h)) && group.hours.every((h) => selectedHours.includes(h));
                  return (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => allAvailable && handleQuickSelect(group)}
                      disabled={!allAvailable}
                      className={`rounded-xl border-2 p-2.5 text-left transition-all text-sm ${
                        !allAvailable
                          ? "border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed"
                          : isActive
                          ? "border-pgd-red bg-pgd-red-light text-pgd-red font-semibold"
                          : "border-gray-200 hover:border-pgd-red hover:bg-pgd-red-light cursor-pointer"
                      }`}
                    >
                      <div className="font-semibold">{group.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Individual hours */}
            <div>
              <p className="text-xs text-gray-400 mb-2">Izbira po urah (kliknite za izbiro):</p>
              <div className="grid grid-cols-5 gap-1.5">
                {HOURLY_SLOTS.map((slot) => {
                  const taken = isHourTaken(slot.startHour);
                  const selected = selectedHours.includes(slot.startHour);
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => toggleHour(slot.startHour)}
                      disabled={taken}
                      className={`rounded-lg border p-2 text-center transition-all text-xs ${
                        taken
                          ? "border-gray-200 bg-gray-100 text-gray-300 cursor-not-allowed line-through"
                          : selected
                          ? "border-pgd-red bg-pgd-red text-white font-semibold"
                          : "border-gray-200 hover:border-pgd-red hover:bg-pgd-red-light cursor-pointer"
                      }`}
                    >
                      <div>{slot.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected hours summary */}
            {selectedHours.length > 0 && (
              <div className="bg-pgd-red-light rounded-xl px-4 py-3 text-sm flex items-center justify-between">
                <div>
                  <p className="text-pgd-gray font-semibold">
                    Izbrani termini: {formatHours(selectedHours)}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {selectedHours.length} {pluralUre(selectedHours.length)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="text-red-500 hover:text-red-700 text-xs font-medium whitespace-nowrap ml-4"
                >
                  ✗ Počisti
                </button>
              </div>
            )}

            {/* User data form */}
            {selectedHours.length > 0 && (
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
                    placeholder="Npr. turnir, prireditev, praznovanje..."
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
                    placeholder="Število igralcev, posebne zahteve..."
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
