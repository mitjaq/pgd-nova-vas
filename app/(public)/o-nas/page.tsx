import type { Metadata } from "next";
import SectionTitle from "@/app/_components/ui/SectionTitle";
import { Card, CardBody } from "@/app/_components/ui/Card";

export const metadata: Metadata = {
  title: "O nas",
  description: "Spoznajte Prostovoljno gasilsko društvo Nova vas pri Markovcih.",
};

const leadership = [
  { name: "Janez Novak", role: "Predsednik" },
  { name: "Marija Kovač", role: "Tajnica" },
  { name: "Peter Žagar", role: "Poveljnik" },
  { name: "Ana Kos", role: "Blagajničarka" },
];

const milestones = [
  { year: "1960", text: "Ustanovitev PGD Nova vas" },
  { year: "1975", text: "Pridobitev prve gasilske brizgalne" },
  { year: "1990", text: "Izgradnja gasilskega doma" },
  { year: "2005", text: "Nabava novega gasilskega vozila GVC" },
  { year: "2015", text: "Rekonstrukcija gasilskega doma" },
  { year: "2024", text: "Modernizacija opreme in voznega parka" },
];

export default function AboutPage() {
  return (
    <div>
      <section className="bg-pgd-gray text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">O nas</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            PGD Nova vas pri Markovcih — skupaj varujemo skupnost že od leta 1960.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionTitle title="Naše poslanstvo" />
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Prostovoljno gasilsko društvo Nova vas pri Markovcih je organizacija prostovoljnih gasilcev, ki že več kot 60 let skrbimo za varnost naše skupnosti. Naši člani se redno usposabljajo in so vedno pripravljeni posredovati ob požarih, poplavah in drugih nesrečah.
              </p>
              <p>
                Gasilstvo je za nas več kot le dolžnost — je poklic srca. Vsak prostovoljni gasilec prispeva dragocen čas in znanje za skupno dobro. Ponosni smo na našo tradicijo in stremimo k temu, da bi bili vedno na višini nalog, ki nam jih nalaga sodobna civilna zaščita.
              </p>
              <p>
                Poleg intervencijskega dela se aktivno ukvarjamo z izobraževanjem mlajših generacij, organiziramo gasilske tekmovanje in sodelujemo na vseh ravneh gasilske organizacije.
              </p>
            </div>
          </div>
          <div className="bg-pgd-red-light rounded-2xl p-8">
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: "👥", value: "50+", label: "Aktivnih članov" },
                { icon: "🚒", value: "3", label: "Gasilska vozila" },
                { icon: "🏆", value: "60+", label: "Let delovanja" },
                { icon: "🌟", value: "100+", label: "Intervencij letno" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl mb-1">{stat.icon}</div>
                  <div className="text-2xl font-bold text-pgd-red">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Naša zgodovina" subtitle="Ključni mejniki v razvoju društva" centered />
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-pgd-red opacity-30" />
              <div className="space-y-8">
                {milestones.map((milestone) => (
                  <div key={milestone.year} className="flex gap-6 relative">
                    <div className="w-8 h-8 bg-pgd-red rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 z-10">
                      ●
                    </div>
                    <div className="pb-2">
                      <div className="font-bold text-pgd-red text-sm">{milestone.year}</div>
                      <p className="text-gray-700">{milestone.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionTitle title="Vodstvo društva" subtitle="Spoznajte naše vodstvo" centered />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {leadership.map((person) => (
            <Card key={person.name} className="text-center">
              <CardBody>
                <div className="w-16 h-16 bg-pgd-gray rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                  {person.name[0]}
                </div>
                <div className="font-semibold text-pgd-gray text-sm">{person.name}</div>
                <div className="text-pgd-red text-xs mt-1">{person.role}</div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Equipment */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Naša oprema" subtitle="Sodobna oprema za učinkovito posredovanje" centered />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: "GVC 16/25",
                desc: "Glavno gasilsko vozilo za gašenje požarov z 1600 litrov vode.",
                icon: "🚒",
              },
              {
                title: "TLV",
                desc: "Terensko lahkomotorno vozilo za hitro posredovanje v zahtevnem terenu.",
                icon: "🚙",
              },
              {
                title: "Reševalna oprema",
                desc: "Hidravlično reševalno orodje, ščiti in polna zaščitna osebna oprema.",
                icon: "🔧",
              },
            ].map((item) => (
              <Card key={item.title}>
                <CardBody>
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-pgd-gray mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
