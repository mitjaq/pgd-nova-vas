import { createClient } from "@/app/_lib/supabase/server";
import type { ContactMessage } from "@/app/_lib/types";
import { Card, CardBody } from "@/app/_components/ui/Card";
import Badge from "@/app/_components/ui/Badge";
import MarkReadButton from "./MarkReadButton";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("sl-SI", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function SporocilaPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  const messages = (data ?? []) as ContactMessage[];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-pgd-gray">Sporočila</h1>
        <p className="text-gray-500 mt-1">
          {messages.filter((m) => !m.read).length} neprebrana sporočila
        </p>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <div className="text-4xl mb-3">✉️</div>
            <p className="text-gray-500">Zaenkrat ni sporočil.</p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <Card key={msg.id} className={!msg.read ? "border-pgd-red border" : ""}>
              <CardBody>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-pgd-gray">{msg.name}</span>
                      {!msg.read && <Badge label="Novo" color="red" />}
                    </div>
                    <div className="text-sm text-gray-500 flex flex-wrap items-center gap-3">
                      <a href={`mailto:${msg.email}`} className="text-blue-600 hover:underline">
                        {msg.email}
                      </a>
                      {msg.phone && <span>📞 {msg.phone}</span>}
                      <span>{formatDate(msg.created_at)}</span>
                    </div>
                  </div>
                  {!msg.read && <MarkReadButton id={msg.id} />}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-lg p-3">
                  {msg.message}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
