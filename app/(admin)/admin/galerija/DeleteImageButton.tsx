"use client";

import { deleteGalleryImage } from "@/app/_lib/actions/gallery";

export default function DeleteImageButton({ id }: { id: string }) {
  async function handleDelete() {
    if (!confirm("Izbrišem fotografijo?")) return;
    await deleteGalleryImage(id);
  }

  return (
    <button
      onClick={handleDelete}
      className="w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors text-sm font-bold shadow"
      aria-label="Izbriši"
    >
      ×
    </button>
  );
}
