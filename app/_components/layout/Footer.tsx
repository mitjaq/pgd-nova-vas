import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-pgd-gray text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-pgd-red rounded-full flex items-center justify-center text-white font-bold text-sm">
                PGD
              </div>
              <div>
                <div className="font-bold text-white">PGD Nova vas</div>
                <div className="text-xs text-gray-400">pri Markovcih</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Prostovoljno gasilsko društvo Nova vas pri Markovcih — varujemo skupnost že desetletja.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Hitre povezave</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/o-nas", label: "O nas" },
                { href: "/novice", label: "Novice" },
                { href: "/intervencije", label: "Intervencije" },
                { href: "/galerija", label: "Galerija" },
                { href: "/kontakt", label: "Kontakt" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-pgd-red transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Kontakt</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-pgd-red shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Nova vas pri Markovcih, Slovenija
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-pgd-red shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                pgd.novava@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-pgd-red shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                112 (v sili)
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {year} PGD Nova vas pri Markovcih. Vse pravice pridržane.</p>
          <Link href="/admin" className="hover:text-pgd-red transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
