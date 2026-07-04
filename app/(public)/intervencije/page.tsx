import type { Metadata } from "next";
import { createClient } from "@/app/_lib/supabase/server";
import type { Intervention } from "@/app/_lib/types";
import SectionTitle from "@/app/_components/ui/SectionTitle";
import { Card, CardBody } from "@/app/_components/ui/Card";
import Badge from "@/app/_components/ui/Badge";

export const metadata: Metadata = {
  title: "Intervencije",
  description: "Pregled intervencij Prostovoljnega gasilskega društva Nova vas.",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("sl-SI", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const typeConfig: Record<string, { label: string; color: "red" | "blue" | "yellow" | "green" | "gray"; icon: string }> = {
  pozar: { label: "Požar", color: "red", icon: "🔥" },
  tehnicna: { label: "Tehnična nesreča", color: "yellow", icon: "⚠️" },
  poplava: { label: "Poplava", color: "blue", icon: "🌊" },
  iskanje: { label: "Iskalna akcija", color: "green", icon: "🔍" },
  vaja: { label: "Vaja", color: "gray", icon: "🎯" },
  drugo: { label: "Drugo", color: "gray", icon: "📋" },
};

export default async function IntervencijePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("interventions")
    .select("*")
    .order("date", { ascending: false });

  const interventions = (data ?? []) as Intervention[];

  const byYear = interventions.reduce<Record<string, Intervention[]>>((acc, item) => {
    const year = new Date(item.date).getFullYear().toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(item);
    return acc;
  }, {});

  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div>
      <section className="bg-pgd-gray text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Intervencije</h1>
          <p className="text-gray-300 text-lg">Pregled vseh naših posredovanj.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {interventions.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🚒</div>
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Zaenkrat ni zabeleženih intervencij</h2>
            <p className="text-gray-400">Preverite znova kmalu.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
              {Object.entries(typeConfig).map(([key, cfg]) => {
                const count = interventions.filter((i) => i.type === key).length;
                return (
                  <Card key={key}>
                    <CardBody className="text-center py-4">
                      <div className="text-2xl mb-1">{cfg.icon}</div>
                      <div className="text-2xl font-bold text-pgd-gray">{count}</div>
                      <div className="text-xs text-gray-500">{cfg.label}</div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>

            <div className="space-y-12">
              {years.map((year) => (
                <div key={year}>
                  <h2 className="text-2xl font-bold text-pgd-gray mb-6 flex items-center gap-3">
                    {year}
                    <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {byYear[year].length} posredovanj
                    </span>
                  </h2>
                  <div className="space-y-4">
                    {byYear[year].map((item) => {
                      const cfg = typeConfig[item.type] ?? typeConfig.drugo;
                      return (
                        <Card key={item.id}>
                          <CardBody className="flex flex-col sm:flex-row sm:items-start gap-4">
                            <div className="w-12 h-12 bg-pgd-red-light rounded-full flex items-center justify-center text-2xl shrink-0">
                              {cfg.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <Badge label={cfg.label} color={cfg.color} />
                                <time className="text-xs text-gray-400">{formatDate(item.date)}</time>
                              </div>
                              <h3 className="font-semibold text-pgd-gray mb-1">{item.title}</h3>
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                {item.location}
                              </p>
                              {item.description && (
                                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{item.description}</p>
                              )}
                            </div>
                          </CardBody>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
