import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/app/_lib/supabase/server";
import type { Article } from "@/app/_lib/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!data) return { title: "Novica ni najdena" };

  return {
    title: `${data.title} | PGD Nova vas`,
    description: data.excerpt,
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("sl-SI", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!data) notFound();

  const article = data as Article;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/novice" className="inline-flex items-center gap-1 text-gray-500 hover:text-pgd-red text-sm mb-8 transition-colors">
        ← Nazaj na novice
      </Link>

      <article>
        <header className="mb-8">
          <time className="text-sm text-gray-400 block mb-3">{formatDate(article.published_at)}</time>
          <h1 className="text-3xl sm:text-4xl font-bold text-pgd-gray mb-4 leading-tight">
            {article.title}
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed border-l-4 border-pgd-red pl-4">
            {article.excerpt}
          </p>
          {article.author && (
            <p className="text-sm text-gray-400 mt-3">Avtor: {article.author}</p>
          )}
        </header>

        {article.image_url && (
          <div className="rounded-xl overflow-hidden mb-8 aspect-video">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div
          className="prose prose-gray max-w-none text-gray-700 leading-relaxed space-y-4"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {article.content}
        </div>
      </article>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <Link
          href="/novice"
          className="inline-flex items-center gap-2 bg-pgd-red text-white px-5 py-2.5 rounded-lg hover:bg-pgd-red-dark transition-colors font-medium"
        >
          ← Vse novice
        </Link>
      </div>
    </div>
  );
}
