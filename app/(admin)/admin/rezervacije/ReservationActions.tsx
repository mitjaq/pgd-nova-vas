"use client";

import { useState } from "react";
import { updateReservationStatus, deleteReservation } from "@/app/_lib/actions/reservations";
import Button from "@/app/_components/ui/Button";

interface Props {
  id: string;
  currentStatus: string;
}

export default function ReservationActions({ id, currentStatus }: Props) {
  const [adminNotes, setAdminNotes] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  async function handleConfirm() {
    if (!confirm("Potrdite rezervacijo?")) return;
    setLoading("confirm");
    await updateReservationStatus(id, "potrjeno", adminNotes || undefined);
    setLoading(null);
  }

  async function handleReject() {
    if (!confirm("Zavrnete rezervacijo?")) return;
    setLoading("reject");
    await updateReservationStatus(id, "zavrnjeno", adminNotes || undefined);
    setLoading(null);
  }

  async function handleDelete() {
    if (!confirm("Trajno izbrišete rezervacijo?")) return;
    setLoading("delete");
    await deleteReservation(id);
    setLoading(null);
  }

  return (
    <div className="flex flex-col gap-2 shrink-0 min-w-[140px]">
      {currentStatus === "caka" && (
        <>
          <input
            type="text"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Admin opomba..."
            className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-pgd-red"
          />
          <Button
            size="sm"
            onClick={handleConfirm}
            loading={loading === "confirm"}
            className="text-xs"
          >
            ✓ Potrdi
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleReject}
            loading={loading === "reject"}
            className="text-xs"
          >
            ✗ Zavrni
          </Button>
        </>
      )}
      <button
        onClick={handleDelete}
        disabled={loading !== null}
        className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg px-2 py-1.5 transition-colors"
      >
        Izbriši
      </button>
    </div>
  );
}
