import Link from "next/link";
import { createClient } from "@/app/_lib/supabase/server";
import type { Intervention } from "@/app/_lib/types";
import { Card, CardBody } from "@/app/_components/ui/Card";
import Badge from "@/app/_components/ui/Badge";
import DeleteInterventionButton from "./DeleteInterventionButton";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("sl-SI", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const typeLabels: Record<string, string> = {
  pozar: "Požar",
  tehnicna: "Tehnična nesreča",
  poplava: "Poplava",
  iskanje: "Iskalna akcija",
  vaja: "Vaja",
  drugo: "Drugo",
};

export default async function AdminIntervencijePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("interventions")
    .select("*")
    .order("date", { ascending: false });

  const interventions = (data ?? []) as Intervention[];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-pgd-gray">Intervencije</h1>
          <p className="text-gray-500 mt-1">{interventions.length} intervencij skupaj</p>
        </div>
        <Link
          href="/admin/intervencije/nova"
          className="bg-pgd-red text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-pgd-red-dark transition-colors text-sm inline-flex items-center gap-2"
        >
          <span>+</span> Dodaj intervencijo
        </Link>
      </div>

      {interventions.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <div className="text-4xl mb-3">🔥</div>
            <p className="text-gray-500">Zaenkrat ni intervencij.</p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {interventions.map((item) => (
            <Card key={item.id}>
              <CardBody className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Badge label={typeLabels[item.type] ?? item.type} color="red" />
                    <span className="text-xs text-gray-400">{formatDate(item.date)}</span>
                    <span className="text-xs text-gray-400">📍 {item.location}</span>
                  </div>
                  <h3 className="font-semibold text-pgd-gray">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">{item.description}</p>
                  )}
                </div>
                <DeleteInterventionButton id={item.id} title={item.title} />
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
