import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/app/_lib/supabase/server";
import type { Article } from "@/app/_lib/types";
import SectionTitle from "@/app/_components/ui/SectionTitle";
import { Card, CardBody } from "@/app/_components/ui/Card";

export const metadata: Metadata = {
  title: "Novice",
  description: "Aktualne novice in obvestila Prostovoljnega gasilskega društva Nova vas.",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("sl-SI", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function NovicePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  const articles = (data ?? []) as Article[];

  return (
    <div>
      <section className="bg-pgd-gray text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Novice</h1>
          <p className="text-gray-300 text-lg">Aktualne novice in obvestila iz našega društva.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {articles.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">📰</div>
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Zaenkrat ni novic</h2>
            <p className="text-gray-400">Preverite znova kmalu.</p>
          </div>
        ) : (
          <>
            {/* Featured article */}
            <Link href={`/novice/${articles[0].slug}`} className="group block mb-10">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {articles[0].image_url ? (
                    <div className="aspect-video md:aspect-auto overflow-hidden">
                      <img
                        src={articles[0].image_url}
                        alt={articles[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video md:aspect-auto bg-pgd-red-light flex items-center justify-center">
                      <span className="text-6xl">🔥</span>
                    </div>
                  )}
                  <CardBody className="flex flex-col justify-center p-8">
                    <div className="inline-block bg-pgd-red text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 self-start">
                      Izpostavljeno
                    </div>
                    <time className="text-xs text-gray-400 mb-2">{formatDate(articles[0].published_at)}</time>
                    <h2 className="text-2xl font-bold text-pgd-gray mb-3 group-hover:text-pgd-red transition-colors">
                      {articles[0].title}
                    </h2>
                    <p className="text-gray-500 leading-relaxed mb-4">{articles[0].excerpt}</p>
                    <span className="text-pgd-red font-semibold">Preberi več →</span>
                  </CardBody>
                </div>
              </Card>
            </Link>

            {/* Rest of articles */}
            {articles.length > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.slice(1).map((article) => (
                  <Link key={article.id} href={`/novice/${article.slug}`} className="group">
                    <Card className="h-full hover:shadow-md transition-shadow">
                      {article.image_url ? (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-pgd-red-light flex items-center justify-center">
                          <span className="text-4xl">📰</span>
                        </div>
                      )}
                      <CardBody>
                        <time className="text-xs text-gray-400">{formatDate(article.published_at)}</time>
                        <h3 className="font-bold text-pgd-gray mt-1 mb-2 group-hover:text-pgd-red transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-3">{article.excerpt}</p>
                        <div className="mt-3 text-pgd-red text-sm font-medium">Preberi več →</div>
                      </CardBody>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
