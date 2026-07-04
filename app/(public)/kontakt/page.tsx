import type { Metadata } from "next";
import SectionTitle from "@/app/_components/ui/SectionTitle";
import { Card, CardBody } from "@/app/_components/ui/Card";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Stopite v stik s Prostovoljnim gasilskim društvom Nova vas pri Markovcih.",
};

const contactInfo = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Naslov",
    value: "Nova vas pri Markovcih, Slovenija",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "E-pošta",
    value: "pgd.novava@gmail.com",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    title: "Klic v sili",
    value: "112",
  },
];

export default function KontaktPage() {
  return (
    <div>
      <section className="bg-pgd-gray text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Kontakt</h1>
          <p className="text-gray-300 text-lg">Stopite z nami v stik.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <SectionTitle title="Pišite nam" subtitle="Odgovorili vam bomo v najkrajšem možnem času." />
            <ContactForm />
          </div>

          <div>
            <SectionTitle title="Kontaktni podatki" />
            <div className="space-y-4 mb-8">
              {contactInfo.map((info) => (
                <Card key={info.title}>
                  <CardBody className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-pgd-red-light rounded-full flex items-center justify-center text-pgd-red shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">
                        {info.title}
                      </div>
                      <div className="font-semibold text-pgd-gray">{info.value}</div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            <div className="bg-pgd-red-light rounded-xl p-6">
              <h3 className="font-bold text-pgd-red mb-2 flex items-center gap-2">
                <span className="text-2xl">🚨</span> V primeru nesreče
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                V primeru požara ali druge nesreče takoj pokličite <strong>112</strong>. To je enotna evropska telefonska številka za klic v sili, ki je dostopna brezplačno 24 ur na dan.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
