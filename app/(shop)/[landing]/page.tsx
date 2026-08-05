import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { getContent } from '@/lib/content';
import { LANDING_PAGES, getLandingPage } from '@/lib/landing-pages';

// Alleen de gedefinieerde landingspagina's bestaan; al het andere → 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return LANDING_PAGES.map((p) => ({ landing: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ landing: string }> }): Promise<Metadata> {
  const { landing } = await params;
  const p = getLandingPage(landing);
  if (!p) return {};
  const t = await getContent();
  const title = t(`landing_${p.slug}_metatitle`, p.metaTitle);
  const description = t(`landing_${p.slug}_metadesc`, p.metaDesc);
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `/${p.slug}`,
      languages: { 'nl-NL': `/${p.slug}`, 'nl-BE': `/${p.slug}`, 'x-default': `/${p.slug}` },
    },
    openGraph: { title, description, url: `/${p.slug}`, type: 'website' },
  };
}

export default async function LandingPage({ params }: { params: Promise<{ landing: string }> }) {
  const { landing } = await params;
  const p = getLandingPage(landing);
  if (!p) notFound();

  const t = await getContent();
  const g = (field: string, def: string) => t(`landing_${p.slug}_${field}`, def);
  const body = g('body', p.body);

  return (
    <div className="wrap py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">{g('eyebrow', p.eyebrow)}</p>
        <h1 className="h-section mt-3">{g('h1', p.h1)}</h1>
        <p className="mt-5 text-lg text-fg-muted">{g('intro', p.intro)}</p>

        <div className="mt-10 space-y-6">
          {body.split(/\n\s*\n/).filter(Boolean).map((block, i) => {
            const [head, ...rest] = block.split('\n');
            const text = rest.join('\n').trim();
            return (
              <div key={i}>
                <h2 className="font-display text-lg font-semibold text-fg">{head}</h2>
                {text && <p className="mt-2 whitespace-pre-line leading-relaxed text-fg-muted">{text}</p>}
              </div>
            );
          })}
        </div>

        <div className="mt-12">
          <Link href={g('ctalink', p.ctaLink)} className="btn btn-primary">
            {g('ctatext', p.ctaText)} <ArrowRight size={16} />
          </Link>
        </div>

        {/* Interne links naar de andere gidsen — goed voor SEO en navigatie. */}
        <div className="mt-14 border-t hairline pt-8">
          <p className="eyebrow">Meer lezen</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {LANDING_PAGES.filter((o) => o.slug !== p.slug).map((o) => (
              <Link key={o.slug} href={`/${o.slug}`} className="rounded-full border hairline bg-panel px-4 py-2 text-sm text-fg-muted transition-colors hover:border-accent hover:text-fg">
                {t(`landing_${o.slug}_eyebrow`, o.eyebrow)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
