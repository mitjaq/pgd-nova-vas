import Link from "next/link";
import { createClient } from "@/app/_lib/supabase/server";
import type { Article } from "@/app/_lib/types";
import { Card, CardBody } from "@/app/_components/ui/Card";
import Badge from "@/app/_components/ui/Badge";
import DeleteArticleButton from "./DeleteArticleButton";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("sl-SI", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminNovicePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  const articles = (data ?? []) as Article[];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-pgd-gray">Novice</h1>
          <p className="text-gray-500 mt-1">{articles.length} novic skupaj</p>
        </div>
        <Link
          href="/admin/novice/nova"
          className="bg-pgd-red text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-pgd-red-dark transition-colors text-sm inline-flex items-center gap-2"
        >
          <span>+</span> Dodaj novico
        </Link>
      </div>

      {articles.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <div className="text-4xl mb-3">📰</div>
            <p className="text-gray-500">Zaenkrat ni novic. Dodajte prvo!</p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <Card key={article.id}>
              <CardBody className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Badge
                      label={article.published ? "Objavljeno" : "Osnutek"}
                      color={article.published ? "green" : "gray"}
                    />
                    <span className="text-xs text-gray-400">{formatDate(article.published_at)}</span>
                  </div>
                  <h3 className="font-semibold text-pgd-gray truncate">{article.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">{article.excerpt}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/novice/${article.id}/uredi`}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Uredi
                  </Link>
                  <DeleteArticleButton id={article.id} title={article.title} />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
