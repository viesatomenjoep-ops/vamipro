import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getContent } from '@/lib/content';
import { TIPS, getTip } from '@/lib/tips';
import { SITE_URL } from '@/lib/site-url';

export const dynamicParams = false;

export function generateStaticParams() {
  return TIPS.map((tp) => ({ slug: tp.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tp = getTip(slug);
  if (!tp) return {};
  const t = await getContent();
  const title = t(`tip_${slug}_metatitle`, tp.metaTitle);
  const description = t(`tip_${slug}_metadesc`, tp.metaDesc);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/tips/${slug}` },
    openGraph: { title, description, url: `/tips/${slug}`, type: 'article' },
  };
}

export default async function TipArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tp = getTip(slug);
  if (!tp) notFound();

  const t = await getContent();
  const title = t(`tip_${slug}_title`, tp.title);
  const excerpt = t(`tip_${slug}_excerpt`, tp.excerpt);
  const body = t(`tip_${slug}_body`, tp.body);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: excerpt,
    datePublished: tp.date,
    author: { '@type': 'Organization', name: 'Vami Pro' },
    publisher: { '@type': 'Organization', name: 'Vami Pro', logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.png` } },
    mainEntityOfPage: `${SITE_URL}/tips/${slug}`,
  };

  const others = TIPS.filter((o) => o.slug !== slug).slice(0, 3);

  return (
    <div className="wrap py-16 md:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <article className="mx-auto max-w-3xl">
        <Link href="/tips" className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-accent">
          <ArrowLeft size={15} /> Alle tips
        </Link>
        <h1 className="h-section mt-5">{title}</h1>
        <p className="mt-5 text-lg text-fg-muted">{excerpt}</p>

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

        <div className="mt-12 border-t hairline pt-8">
          <Link href="/producten" className="btn btn-primary">
            Bekijk de producten <ArrowRight size={16} />
          </Link>
        </div>

        {others.length > 0 && (
          <div className="mt-14 border-t hairline pt-8">
            <p className="eyebrow">Lees ook</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {others.map((o) => (
                <Link key={o.slug} href={`/tips/${o.slug}`} className="rounded-lg border hairline bg-panel p-4 text-sm font-medium text-fg-muted transition-colors hover:border-accent hover:text-fg">
                  {t(`tip_${o.slug}_title`, o.title)}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
