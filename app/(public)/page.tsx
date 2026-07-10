import Link from "next/link";
import { createClient } from "@/app/_lib/supabase/server";
import type { Article, Intervention } from "@/app/_lib/types";
import SectionTitle from "@/app/_components/ui/SectionTitle";
import { Card, CardBody } from "@/app/_components/ui/Card";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("sl-SI", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function interventionTypeLabel(type: string) {
  const map: Record<string, string> = {
    pozar: "Požar",
    tehnicna: "Tehnična nesreča",
    poplava: "Poplava",
    iskanje: "Iskalna akcija",
    vaja: "Vaja",
    drugo: "Drugo",
  };
  return map[type] ?? type;
}

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: articles }, { data: interventions }] = await Promise.all([
    supabase
      .from("articles")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(3),
    supabase
      .from("interventions")
      .select("*")
      .order("date", { ascending: false })
      .limit(4),
  ]);

  const latestArticles = (articles ?? []) as Article[];
  const latestInterventions = (interventions ?? []) as Intervention[];

  return (
    <div>
      {/* Hero */}
      <section className="relative text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/background.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-pgd-gray via-gray-800 to-pgd-red opacity-70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-pgd-red bg-opacity-20 border border-pgd-red border-opacity-40 rounded-full px-4 py-1.5 text-sm font-medium text-red-300 mb-6">
              <span className="w-2 h-2 bg-pgd-red rounded-full animate-pulse" />
              Prostovoljno gasilsko društvo
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
              PGD Nova vas
              <span className="text-pgd-red mt-1"> pri Markovcih</span>
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Skupaj varujemo našo skupnost. Prostovoljni gasilci smo vedno pripravljeni pomagati — 24 ur na dan, 7 dni v tednu.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/o-nas"
                className="bg-pgd-red hover:bg-pgd-red-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Spoznaj nas
              </Link>
              <Link
                href="/kontakt"
                className="bg-white bg-opacity-10 hover:bg-opacity-20 text-white font-semibold px-6 py-3 rounded-lg border border-white border-opacity-30 transition-colors"
              >
                Kontaktiraj nas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-pgd-red text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: "50+", label: "Aktivnih članov" },
              { value: "1923", label: "Leto ustanovitve" },
              { value: "24/7", label: "Pripravljenost" },
              { value: "112", label: "Klic v sili" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-red-200 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-10">
          <SectionTitle title="Zadnje novice" subtitle="Aktualne informacije iz našega društva" />
          <Link href="/novice" className="text-pgd-red hover:text-pgd-red-dark font-medium text-sm hidden sm:block">
            Vse novice →
          </Link>
        </div>

        {latestArticles.length === 0 ? (
          <p className="text-gray-400 text-center py-12">Zaenkrat ni objavljenih novic.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestArticles.map((article) => (
              <Link key={article.id} href={`/novice/${article.slug}`} className="group">
                <Card className="h-full hover:shadow-md transition-shadow">
                  {article.image_url && (
                    <div className="aspect-video bg-gray-100 overflow-hidden">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
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

        <div className="text-center mt-6 sm:hidden">
          <Link href="/novice" className="text-pgd-red hover:text-pgd-red-dark font-medium text-sm">
            Vse novice →
          </Link>
        </div>
      </section>

      {/* Latest Interventions */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <SectionTitle title="Nedavne intervencije" subtitle="Pregled naših zadnjih posredovanj" />
            <Link href="/intervencije" className="text-pgd-red hover:text-pgd-red-dark font-medium text-sm hidden sm:block">
              Vse intervencije →
            </Link>
          </div>

          {latestInterventions.length === 0 ? (
            <p className="text-gray-400 text-center py-12">Zaenkrat ni zabeleženih intervencij.</p>
          ) : (
            <div className="space-y-4">
              {latestInterventions.map((item) => (
                <Card key={item.id}>
                  <CardBody className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-12 h-12 bg-pgd-red-light rounded-full flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-pgd-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-medium bg-pgd-red-light text-pgd-red px-2 py-0.5 rounded-full">
                          {interventionTypeLabel(item.type)}
                        </span>
                        <time className="text-xs text-gray-400">{formatDate(item.date)}</time>
                      </div>
                      <h3 className="font-semibold text-pgd-gray">{item.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{item.location}</p>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-pgd-gray rounded-2xl text-white text-center px-8 py-16">
          <h2 className="text-3xl font-bold mb-4">Postani prostovoljni gasilec</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
            Iščemo motivirane posameznike, ki so pripravljeni pomagati skupnosti. Pridruži se nam!
          </p>
          <Link
            href="/kontakt"
            className="bg-pgd-red hover:bg-pgd-red-dark text-white font-semibold px-8 py-3 rounded-lg transition-colors inline-block"
          >
            Kontaktiraj nas
          </Link>
        </div>
      </section>
    </div>
  );
}
