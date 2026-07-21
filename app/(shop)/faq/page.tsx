import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Veelgestelde vragen',
  description: 'Antwoorden over bestellen, betalen met iDEAL & Bancontact, verzending en retour van je car-detailingproducten in Nederland en België.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'Veelgestelde vragen',
    description: 'Antwoorden over bestellen, betalen met iDEAL & Bancontact, verzending en retour van je car-detailingproducten in Nederland en België.',
    url: '/faq',
    type: 'website',
  },
};

const groups: [string, [string, string][]][] = [
  ['Bestellen & betalen', [
    ['Welke betaalmethodes accepteren jullie?', 'iDEAL (Nederland) en Bancontact (België), beide via Mollie. Je betaalt veilig in je eigen bankomgeving.'],
    ['Is online betalen veilig?', 'Ja. Betalingen lopen via Mollie, een gecertificeerde Payment Service Provider. Wij ontvangen of bewaren geen betaalgegevens.'],
    ['Kan ik op factuur betalen?', 'Voor zakelijke klanten is dit op aanvraag mogelijk. Neem contact op via info@vamipro.nl.'],
  ]],
  ['Verzending', [
    ['Wat zijn de verzendkosten?', 'De kosten worden in de checkout berekend op basis van je land en bestelgewicht. Vanaf € 75 verzenden we gratis binnen NL en BE.'],
    ['Hoe snel wordt mijn bestelling verzonden?', 'Vóór 16:00 op werkdagen besteld en betaald = dezelfde dag verzonden. Levering doorgaans 1–2 werkdagen (NL) en 2–3 werkdagen (BE).'],
    ['Kan ik mijn pakket volgen?', 'Ja, je ontvangt een track & trace-link per e-mail zodra je pakket is aangemeld.'],
  ]],
  ['Retour & advies', [
    ['Kan ik mijn bestelling retourneren?', 'Ja, je hebt 14 dagen bedenktijd. Ongeopende producten kun je retourneren. Zie ons retourbeleid.'],
    ['Zijn de producten geschikt voor coatings/wax?', 'Onze shampoos en reinigers zijn pH-neutraal en veilig voor gecoate en gewaxte lak, tenzij anders vermeld.'],
    ['Geven jullie advies?', 'Zeker. Mail je vraag naar info@vamipro.nl en we helpen je met de juiste keuze.'],
  ]],
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: groups.flatMap(([, items]) =>
    items.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    }))
  ),
};

export default function FaqPage() {
  return (
    <div className="wrap py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <p className="eyebrow">Hulp</p>
      <h1 className="h-section mt-3">Veelgestelde vragen</h1>
      <div className="mt-10 grid gap-12 lg:grid-cols-[240px_1fr]">
        <nav className="hidden text-sm lg:block">
          <ul className="sticky top-24 space-y-2 text-fg-muted">
            {groups.map(([g]) => <li key={g}><a href={`#${g}`} className="hover:text-accent">{g}</a></li>)}
          </ul>
        </nav>
        <div className="space-y-12">
          {groups.map(([g, items]) => (
            <section key={g} id={g}>
              <h2 className="font-display text-xl font-semibold">{g}</h2>
              <div className="mt-4 divide-y divide-[var(--line)] overflow-hidden rounded border hairline">
                {items.map(([q, a]) => (
                  <details key={q} className="group bg-panel p-5 open:bg-panel-2">
                    <summary className="flex cursor-pointer list-none items-center justify-between font-display font-medium">
                      {q}<span className="text-accent transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-fg-muted">{a}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
