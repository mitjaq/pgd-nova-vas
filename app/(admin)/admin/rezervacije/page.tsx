import { createClient } from "@/app/_lib/supabase/server";
import type { Reservation } from "@/app/_lib/types";
import { Card, CardBody } from "@/app/_components/ui/Card";
import Badge from "@/app/_components/ui/Badge";
import ReservationActions from "./ReservationActions";

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("sl-SI", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTs(ts: string) {
  return new Date(ts).toLocaleDateString("sl-SI", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const statusConfig: Record<string, { label: string; color: "gray" | "green" | "red" | "yellow" }> = {
  caka: { label: "Čaka potrditev", color: "yellow" },
  potrjeno: { label: "Potrjeno", color: "green" },
  zavrnjeno: { label: "Zavrnjeno", color: "red" },
};

const timeSlotLabels: Record<string, string> = {
  dopoldne: "Dopoldne (8–13)",
  popoldne: "Popoldne (13–18)",
  vecer: "Večer (18–23)",
  celdan: "Cel dan (8–23)",
};

const typeLabels: Record<string, string> = {
  dvorana: "🏛️ Dvorana",
  piknik: "🌿 Piknik",
};

export default async function AdminRezervacijePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reservations")
    .select("*")
    .order("date", { ascending: true })
    .order("created_at", { ascending: false });

  const reservations = (data ?? []) as Reservation[];

  const pending = reservations.filter((r) => r.status === "caka");
  const confirmed = reservations.filter((r) => r.status === "potrjeno");
  const rejected = reservations.filter((r) => r.status === "zavrnjeno");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-pgd-gray">Rezervacije</h1>
        <p className="text-gray-500 mt-1">
          {pending.length} čaka na potrditev · {confirmed.length} potrjenih · {rejected.length} zavrnjenih
        </p>
      </div>

      {reservations.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <div className="text-4xl mb-3">📅</div>
            <p className="text-gray-500">Zaenkrat ni rezervacij.</p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {/* Pending first */}
          {[...pending, ...confirmed, ...rejected].map((r) => {
            const st = statusConfig[r.status] ?? statusConfig.caka;
            return (
              <Card key={r.id} className={r.status === "caka" ? "border-yellow-300 border" : ""}>
                <CardBody>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge label={st.label} color={st.color} />
                        <span className="text-xs font-medium text-gray-500">{typeLabels[r.type]}</span>
                        <span className="text-xs text-gray-400">
                          Oddano: {formatTs(r.created_at)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                        <div>
                          <span className="text-gray-400">Datum:</span>{" "}
                          <strong className="text-pgd-gray">{formatDate(r.date)}</strong>
                        </div>
                        {r.time_slot && (
                          <div>
                            <span className="text-gray-400">Termin:</span>{" "}
                            <strong className="text-pgd-gray">{timeSlotLabels[r.time_slot] ?? r.time_slot}</strong>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-400">Ime:</span>{" "}
                          <span className="text-pgd-gray">{r.name}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Tel:</span>{" "}
                          <a href={`tel:${r.phone}`} className="text-pgd-gray hover:text-pgd-red">
                            {r.phone}
                          </a>
                        </div>
                        <div>
                          <span className="text-gray-400">E-pošta:</span>{" "}
                          <a href={`mailto:${r.email}`} className="text-blue-600 hover:underline break-all">
                            {r.email}
                          </a>
                        </div>
                        <div>
                          <span className="text-gray-400">Namen:</span>{" "}
                          <span className="text-pgd-gray">{r.purpose}</span>
                        </div>
                        {r.notes && (
                          <div className="sm:col-span-2">
                            <span className="text-gray-400">Opomba:</span>{" "}
                            <span className="text-gray-600">{r.notes}</span>
                          </div>
                        )}
                        {r.admin_notes && (
                          <div className="sm:col-span-2">
                            <span className="text-gray-400">Admin opomba:</span>{" "}
                            <span className="text-gray-600 italic">{r.admin_notes}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <ReservationActions
                      id={r.id}
                      currentStatus={r.status}
                    />
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
