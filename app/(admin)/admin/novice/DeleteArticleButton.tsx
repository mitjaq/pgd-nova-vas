"use client";

import { deleteArticle } from "@/app/_lib/actions/articles";

interface Props {
  id: string;
  title: string;
}

export default function DeleteArticleButton({ id, title }: Props) {
  async function handleDelete() {
    if (!confirm(`Ste prepričani, da želite izbrisati novico "${title}"?`)) return;
    await deleteArticle(id);
  }

  return (
    <button
      onClick={handleDelete}
      className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
    >
      Izbriši
    </button>
  );
}
