"use client";

import { useActionState } from "react";
import { addGalleryImage } from "@/app/_lib/actions/gallery";
import Button from "@/app/_components/ui/Button";

const initialState = { error: undefined, success: false };

export default function AddImageForm() {
  const [state, action, pending] = useActionState(addGalleryImage, initialState);

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-sm">
          Fotografija je bila dodana!
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL slike <span className="text-pgd-red">*</span>
        </label>
        <input
          name="url"
          type="url"
          required
          placeholder="https://..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pgd-red"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Opis</label>
        <input
          name="caption"
          type="text"
          placeholder="Kratki opis..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pgd-red"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Kategorija</label>
        <input
          name="category"
          type="text"
          placeholder="Npr. Vaje, Tekmovanja..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pgd-red"
        />
      </div>

      <Button type="submit" loading={pending} className="w-full">
        Dodaj fotografijo
      </Button>
    </form>
  );
}
