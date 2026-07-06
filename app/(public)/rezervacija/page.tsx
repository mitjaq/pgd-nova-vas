import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardBody } from "@/app/_components/ui/Card";

export const metadata: Metadata = {
  title: "Rezervacija",
  description: "Rezervirajte dvorano ali piknik prostor PGD Nova vas pri Markovcih.",
};

const options = [
  {
    href: "/rezervacija/dvorana",
    title: "Rezervacija dvorane",
    description:
      "Naša dvorana je primerna za praznovanja, sestanke, predavanja in kulturne prireditve. Kapaciteta do 80 oseb.",
    icon: "🏛️",
    details: [
      "Kapaciteta: do 80 oseb",
      "Termini: dopoldne, popoldne, večer ali cel dan",
      "Opremljena kuhinja",
      "Klimatizirana",
    ],
  },
  {
    href: "/rezervacija/mivka",
    title: "Rezervacija odbojke na mivki",
    description:
      "Igrišče za odbojko na mivki z mrežo in stebri. Idealno za turnirje, uritve in športne prireditve.",
    icon: "🏐",
    details: [
      "Oznjeno igrišče za odbojko na mivki",
      "Termini: 1-urna granulacija (8:00 – 23:00)",
      "Mreža in stebri v uporabi",
      "Parkirišče",
    ],
  },
  {
    href: "/rezervacija/piknik",
    title: "Rezervacija piknik prostora",
    description:
      "Zunanji piknik prostor z žarom, mizami in klopmi. Idealen za manjša praznovanja in družinske prireditve.",
    icon: "🌿",
    details: [
      "Kapaciteta: do 40 oseb",
      "Rezervacija za cel dan",
      "Žar in mize v uporabi",
      "Parkirišče ob objektu",
    ],
  },
];

export default function RezervacijaPage() {
  return (
    <div>
      <section className="bg-pgd-gray text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Rezervacija prostorov</h1>
          <p className="text-gray-300 text-lg max-w-xl">
            Izberite prostor, ki ga želite rezervirati, in preverite razpoložljivost.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {options.map((opt) => (
            <Card key={opt.href} className="hover:shadow-lg transition-shadow">
              <CardBody className="p-8">
                <div className="text-5xl mb-4">{opt.icon}</div>
                <h2 className="text-xl font-bold text-pgd-gray mb-3">{opt.title}</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{opt.description}</p>
                <ul className="space-y-2 mb-6">
                  {opt.details.map((d) => (
                    <li key={d} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-pgd-red shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {d}
                    </li>
                  ))}
                </ul>
                <Link
                  href={opt.href}
                  className="inline-block bg-pgd-red text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-pgd-red-dark transition-colors text-sm"
                >
                  Rezerviraj →
                </Link>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="mt-10 bg-pgd-red-light rounded-xl p-6 text-sm text-gray-600">
          <p className="font-semibold text-pgd-gray mb-2">ℹ️ Informacije o rezervacijah</p>
          <ul className="space-y-1">
            <li>• Rezervacija je potrjena šele po e-poštni potrditvi s strani društva.</li>
            <li>• Za informacije o cenah nas kontaktirajte na <a href="mailto:pgd.novava@gmail.com" className="text-pgd-red underline">pgd.novava@gmail.com</a>.</li>
            <li>• V primeru odpovedi prosimo za obvestilo vsaj 48 ur vnaprej.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
