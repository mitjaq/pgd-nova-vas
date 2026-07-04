"use client";

import { deleteIntervention } from "@/app/_lib/actions/interventions";

interface Props {
  id: string;
  title: string;
}

export default function DeleteInterventionButton({ id, title }: Props) {
  async function handleDelete() {
    if (!confirm(`Izbrišem intervencijo "${title}"?`)) return;
    await deleteIntervention(id);
  }

  return (
    <button
      onClick={handleDelete}
      className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors shrink-0"
    >
      Izbriši
    </button>
  );
}
