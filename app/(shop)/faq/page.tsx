import type { Metadata } from 'next';
import { getContent } from '@/lib/content';
import { FAQ_DEFAULTS } from '@/lib/content-fields';

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

export default async function FaqPage() {
  const t = await getContent();

  // Vragen + antwoorden komen uit de bewerkbare content (admin), met de
  // SEO-rijke standaardteksten als fallback. Lege items worden overgeslagen.
  const items = FAQ_DEFAULTS
    .map((d, i) => ({ q: t(`faq_${i + 1}_q`, d.q).trim(), a: t(`faq_${i + 1}_a`, d.a).trim() }))
    .filter((x) => x.q && x.a);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((x) => ({
      '@type': 'Question',
      name: x.q,
      acceptedAnswer: { '@type': 'Answer', text: x.a },
    })),
  };

  return (
    <div className="wrap py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <p className="eyebrow">Hulp</p>
      <h1 className="h-section mt-3">Veelgestelde vragen</h1>
      <p className="mt-4 max-w-2xl text-fg-muted">
        Antwoorden over onze car-detailingproducten, bestellen, betalen met iDEAL &amp; Bancontact,
        verzending en retour — voor Nederland en België.
      </p>

      <div className="mt-10 max-w-3xl divide-y divide-[var(--line)] overflow-hidden rounded border hairline">
        {items.map((x, i) => (
          <details key={i} className="group bg-panel p-5 open:bg-panel-2">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display font-medium">
              {x.q}
              <span className="shrink-0 text-accent transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-fg-muted">{x.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
