import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import { CATEGORIES } from '@/lib/categories';
import ProductCard from '@/components/shop/ProductCard';
import Reveal from '@/components/shop/Reveal';
import { ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';
import { isMock, getMockProducts } from '@/lib/mock-data';

export const revalidate = 60;

export default async function HomePage() {
  const supabase = createServiceClient();
  const { data: featured } = isMock 
    ? getMockProducts({ featured: true, limit: 4 }) as any
    : await supabase.from('products').select('*').eq('is_active', true).eq('is_featured', true).limit(4);

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        {/* ambient gloss reflection */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full"
               style={{ background: 'radial-gradient(circle, var(--accent-glow), transparent 65%)', filter: 'blur(30px)' }} />
          <div className="absolute left-1/2 top-0 h-px w-full -translate-x-1/2"
               style={{ background: 'linear-gradient(90deg, transparent, var(--accent-glow), transparent)' }} />
        </div>

        <div className="wrap relative grid gap-6 pt-6 pb-12 md:gap-10 md:grid-cols-[1.1fr_.9fr] md:py-20">
          <div>
            <p className="eyebrow">Car detailing · NL &amp; BE</p>
            <h1 className="h-hero mt-5">
              Een finish die<br />
              <span className="gloss-text">het licht vangt.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-fg-muted">
              Professionele detailingproducten, ontwikkeld voor liefhebbers en pro&apos;s.
              Van veilig wassen tot keramische coatings met jarenlange bescherming.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
              <Link href="/producten" className="btn btn-primary">Shop alle producten</Link>
              <Link href="/categorie/coating" className="btn btn-ghost">Ontdek coatings</Link>
            </div>
            <dl className="mt-8 grid max-w-md grid-cols-3 gap-4 md:mt-12 md:gap-6">
              {[['3 jaar', 'bescherming'], ['1–2 dagen', 'levering NL'], ['9H', 'coating hardheid']].map(([n, l]) => (
                <div key={l}>
                  <dt className="font-display text-2xl font-semibold text-fg">{n}</dt>
                  <dd className="text-xs uppercase tracking-wider text-fg-faint">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* product-forward visual panel */}
          <div className="relative">
            <div className="card relative aspect-square overflow-hidden md:aspect-[4/5]">
              <div className="absolute inset-0"
                   style={{ background: 'linear-gradient(160deg, var(--accent-soft), var(--panel) 70%)' }} />
              <div aria-hidden className="absolute -left-10 top-10 h-40 w-[140%] -rotate-12"
                   style={{ background: 'linear-gradient(90deg, transparent, rgba(91,42,134,.14), transparent)' }} />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="eyebrow">Signature</p>
                <p className="mt-2 font-display text-xl font-medium">Vami Ceramic Coating 9H</p>
                <p className="text-sm text-fg-muted">Extreme glans · hydrofoob · tot 3 jaar</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== USP STRIP ===== */}
      <section className="border-y hairline bg-panel">
        <div className="wrap grid grid-cols-2 gap-px md:grid-cols-4">
          {[
            [Truck, 'Voor 16:00 besteld', 'vandaag verzonden'],
            [ShieldCheck, 'Veilig betalen', 'iDEAL & Bancontact'],
            [Sparkles, 'Gratis verzending', 'vanaf € 75'],
            [RotateCcw, '14 dagen', 'bedenktijd'],
          ].map(([Icon, t, s]: any, i) => (
            <div key={i} className="flex items-center gap-3 py-6">
              <Icon size={20} className="text-accent" strokeWidth={1.6} />
              <div>
                <p className="text-sm font-medium text-fg">{t}</p>
                <p className="text-xs text-fg-muted">{s}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CATEGORIES = THE PROCESS ===== */}
      <section className="wrap py-12 md:py-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Het proces</p>
            <h2 className="h-section mt-3">Zes stappen naar perfectie</h2>
          </div>
          <Link href="/producten" className="hidden text-sm text-accent hover:underline sm:inline">Alles bekijken →</Link>
        </div>
        <div className="mt-8 grid gap-px overflow-hidden rounded border hairline grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.slug} delay={i * 60}>
              <Link href={`/categorie/${c.slug}`}
                className="group flex h-full flex-col justify-between bg-panel p-4 transition-colors hover:bg-panel-2 sm:p-7">
                <span className="font-display text-xs text-accent sm:text-sm">{c.step}</span>
                <div className="mt-6 sm:mt-10">
                  <h3 className="font-display text-base font-medium sm:text-xl">{c.name}</h3>
                  <p className="mt-1 text-xs text-fg-muted sm:mt-2 sm:text-sm">{c.tagline}</p>
                  <span className="mt-3 inline-block text-xs text-fg-faint transition-colors group-hover:text-accent sm:mt-4 sm:text-sm">
                    Bekijk producten →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== FEATURED ===== */}
      {featured && featured.length > 0 && (
        <section className="wrap pb-12 md:pb-20">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Aanraders</p>
              <h2 className="h-section mt-3">Onze bestsellers</h2>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {featured.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>
      )}

      {/* ===== CLOSING CTA ===== */}
      <section className="wrap pb-12 md:pb-24">
        <div className="card relative overflow-hidden p-8 text-center md:p-12">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40"
               style={{ background: 'radial-gradient(ellipse at top, var(--accent-glow), transparent 70%)' }} />
          <p className="eyebrow relative">Advies nodig?</p>
          <h2 className="h-section relative mx-auto mt-3 max-w-xl">Niet zeker welk product bij jouw auto past?</h2>
          <p className="relative mx-auto mt-3 max-w-md text-fg-muted">
            Stuur ons je vraag — we helpen je met de juiste keuze voor lak, velgen of interieur.
          </p>
          <Link href="/contact" className="btn btn-primary relative mt-7">Stel je vraag</Link>
        </div>
      </section>
    </>
  );
}
