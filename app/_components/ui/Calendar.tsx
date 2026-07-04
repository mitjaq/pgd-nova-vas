"use client";

import { useState } from "react";

const DAYS_SL = ["Pon", "Tor", "Sre", "Čet", "Pet", "Sob", "Ned"];
const MONTHS_SL = [
  "Januar", "Februar", "Marec", "April", "Maj", "Junij",
  "Julij", "Avgust", "September", "Oktober", "November", "December",
];

export interface CalendarProps {
  selected: string | null; // YYYY-MM-DD
  onSelect: (date: string) => void;
  fullyBooked?: string[]; // YYYY-MM-DD — disabled
  partiallyBooked?: string[]; // YYYY-MM-DD — selectable but marked
}

function toDateStr(d: Date): string {
  return d.toLocaleDateString("en-CA"); // YYYY-MM-DD
}

export default function Calendar({
  selected,
  onSelect,
  fullyBooked = [],
  partiallyBooked = [],
}: CalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [view, setView] = useState(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const year = view.getFullYear();
  const month = view.getMonth();

  function prevMonth() {
    const d = new Date(year, month - 1, 1);
    if (d >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setView(d);
    }
  }

  function nextMonth() {
    setView(new Date(year, month + 1, 1));
  }

  // Build grid (Monday-first)
  const firstDow = new Date(year, month, 1).getDay();
  const startPad = firstDow === 0 ? 6 : firstDow - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(startPad).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const isPrevDisabled =
    year === today.getFullYear() && month === today.getMonth();

  return (
    <div className="bg-white rounded-xl border border-gray-200 select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <button
          onClick={prevMonth}
          disabled={isPrevDisabled}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Prejšnji mesec"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-semibold text-pgd-gray text-sm">
          {MONTHS_SL[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Naslednji mesec"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="p-3">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS_SL.map((d) => (
            <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-0.5">
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;

            const date = new Date(year, month, day);
            date.setHours(0, 0, 0, 0);
            const dateStr = toDateStr(date);

            const isPast = date < today;
            const isFullyBooked = fullyBooked.includes(dateStr);
            const isPartial = partiallyBooked.includes(dateStr);
            const isSelected = selected === dateStr;
            const isToday = dateStr === toDateStr(today);
            const isDisabled = isPast || isFullyBooked;

            let cls =
              "aspect-square flex items-center justify-center text-sm rounded-lg font-medium transition-colors relative ";

            if (isSelected) {
              cls += "bg-pgd-red text-white";
            } else if (isFullyBooked) {
              cls += "bg-red-50 text-red-300 cursor-not-allowed line-through";
            } else if (isPast) {
              cls += "text-gray-300 cursor-not-allowed";
            } else if (isPartial) {
              cls += "bg-yellow-50 text-yellow-700 cursor-pointer hover:bg-yellow-100";
            } else {
              cls += "text-gray-700 cursor-pointer hover:bg-pgd-red-light hover:text-pgd-red";
            }

            return (
              <button
                key={i}
                type="button"
                onClick={() => !isDisabled && onSelect(dateStr)}
                disabled={isDisabled}
                className={cls}
              >
                {day}
                {isToday && !isSelected && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-pgd-red" />
                )}
                {isPartial && !isSelected && (
                  <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-yellow-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 py-3 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-pgd-red shrink-0" /> Izbran datum
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-yellow-100 border border-yellow-300 shrink-0" /> Delno zasedeno
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-50 shrink-0" /> Zasedeno
        </span>
      </div>
    </div>
  );
}
