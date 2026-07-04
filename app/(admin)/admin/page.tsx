import { createClient } from "@/app/_lib/supabase/server";
import { Card, CardBody } from "@/app/_components/ui/Card";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: articleCount },
    { count: interventionCount },
    { count: galleryCount },
    { count: messageCount },
    { count: reservationCount },
  ] = await Promise.all([
    supabase.from("articles").select("*", { count: "exact", head: true }),
    supabase.from("interventions").select("*", { count: "exact", head: true }),
    supabase.from("gallery_images").select("*", { count: "exact", head: true }),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("read", false),
    supabase.from("reservations").select("*", { count: "exact", head: true }).eq("status", "caka"),
  ]);

  const stats = [
    { label: "Objavljene novice", value: articleCount ?? 0, href: "/admin/novice", color: "text-blue-600", bg: "bg-blue-50", icon: "📰" },
    { label: "Intervencije", value: interventionCount ?? 0, href: "/admin/intervencije", color: "text-pgd-red", bg: "bg-pgd-red-light", icon: "🔥" },
    { label: "Fotografije", value: galleryCount ?? 0, href: "/admin/galerija", color: "text-green-600", bg: "bg-green-50", icon: "🖼️" },
    { label: "Nova sporočila", value: messageCount ?? 0, href: "/admin/sporocila", color: "text-yellow-600", bg: "bg-yellow-50", icon: "✉️" },
    { label: "Čakajoče rezervacije", value: reservationCount ?? 0, href: "/admin/rezervacije", color: "text-purple-600", bg: "bg-purple-50", icon: "📅" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-pgd-gray">Nadzorna plošča</h1>
        <p className="text-gray-500 mt-1">Dobrodošli v admin panelu PGD Nova vas.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="group">
            <Card className="hover:shadow-md transition-shadow">
              <CardBody>
                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center text-2xl mb-3`}>
                  {stat.icon}
                </div>
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { href: "/admin/novice/nova", label: "Dodaj novico", icon: "+" },
          { href: "/admin/intervencije/nova", label: "Dodaj intervencijo", icon: "+" },
          { href: "/admin/galerija", label: "Upravljaj galerijo", icon: "🖼️" },
        ].map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardBody className="flex items-center gap-4">
                <div className="w-10 h-10 bg-pgd-red rounded-full flex items-center justify-center text-white font-bold">
                  {action.icon}
                </div>
                <span className="font-medium text-pgd-gray">{action.label}</span>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
