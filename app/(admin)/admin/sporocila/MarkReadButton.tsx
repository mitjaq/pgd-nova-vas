"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/app/_lib/supabase/client";

export default function MarkReadButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleMarkRead() {
    const supabase = createClient();
    await supabase.from("contact_messages").update({ read: true }).eq("id", id);
    router.refresh();
  }

  return (
    <button
      onClick={handleMarkRead}
      className="text-sm text-gray-500 hover:text-gray-700 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
    >
      Označi kot prebrano
    </button>
  );
}
