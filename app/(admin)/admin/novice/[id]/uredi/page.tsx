import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/app/_lib/supabase/server";
import type { Article } from "@/app/_lib/types";
import ArticleForm from "../../ArticleForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UrediNovicoPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("articles").select("*").eq("id", id).single();

  if (!data) notFound();

  const article = data as Article;

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/novice" className="text-gray-400 hover:text-gray-600 transition-colors">
          ← Nazaj
        </Link>
        <h1 className="text-2xl font-bold text-pgd-gray">Uredi novico</h1>
      </div>
      <ArticleForm article={article} />
    </div>
  );
}
