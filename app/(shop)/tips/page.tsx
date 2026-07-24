import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getContent } from '@/lib/content';
import { TIPS } from '@/lib/tips';

export const metadata: Metadata = {
  title: 'Detailing tips & gids',
  description: 'Praktische car-detailing tips: auto wassen zonder krassen, streeploos drogen, snow foam, velgen reinigen, interieur detailen en lakbescherming.',
  alternates: { canonical: '/tips' },
  openGraph: {
    title: 'Detailing tips & gids',
    description: 'Praktische car-detailing tips van Vami Pro: wassen, drogen, snow foam, velgen, interieur en lakbescherming.',
    url: '/tips',
    type: 'website',
  },
};

export default async function TipsPage() {
  const t = await getContent();

  return (
    <div className="wrap py-16 md:py-24">
      <div className="max-w-3xl">
        <p className="eyebrow">Kennisbank</p>
        <h1 className="h-section mt-3">Detailing tips &amp; gidsen</h1>
        <p className="mt-4 text-lg text-fg-muted">
          Praktische uitleg om je auto krasvrij te wassen, streeploos te drogen en langer mooi te houden —
          geschreven voor liefhebbers én professionals.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TIPS.map((tp) => (
          <Link
            key={tp.slug}
            href={`/tips/${tp.slug}`}
            className="group flex flex-col rounded-xl border hairline bg-panel p-6 transition-colors hover:border-accent"
          >
            <h2 className="font-display text-lg font-semibold leading-snug text-fg">
              {t(`tip_${tp.slug}_title`, tp.title)}
            </h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-muted">
              {t(`tip_${tp.slug}_excerpt`, tp.excerpt)}
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
              Lees de tip <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
