import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import ProductCard from '@/components/shop/ProductCard';
import Reveal from '@/components/shop/Reveal';
import CountUp from '@/components/shop/CountUp';
import Marquee from '@/components/shop/Marquee';
import Preloader from '@/components/shop/Preloader';
import FoamLayer from '@/components/shop/FoamLayer';
import Tilt from '@/components/shop/Tilt';
import Magnetic from '@/components/shop/Magnetic';
import Cursor from '@/components/shop/Cursor';
import ParallaxImg from '@/components/shop/ParallaxImg';
import GiantCounter from '@/components/shop/GiantCounter';
import LiveSearchBar from '@/components/shop/LiveSearchBar';
import ImageGallery from '@/components/shop/ImageGallery';
import { ArrowRight } from 'lucide-react';
import { isMock, getMockProducts } from '@/lib/mock-data';
import { cldUrl } from '@/lib/cloudinary';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export const revalidate = 60;

// Echte foto's per categorie-slug (fallback: hero)
const CAT_IMAGES: Record<string, string> = {
  'exterieur': '/images/audi_q3_detailing.png',
  'exterieur-wassen': '/images/audi_q3_detailing.png',
  'droogdoeken': '/images/drying_towel.jpg',
  'washandschoenen': '/images/wash_mitt_chenille.jpg',
  'interieur': 'https://res.cloudinary.com/dxcohla4k/image/upload/v1782070137/vamipro/products/oxbmsyomx1wa8ui9hlib.jpg',
  'accessoires': '/images/washing_tools_detailing.png',
  'accessoires-washulpmiddelen': '/images/washing_tools_detailing.png',
  'combinatiedeals': 'https://res.cloudinary.com/dxcohla4k/image/upload/vamipro/wvdx3jkdkbvlsc9jc5vh',
};
const CAT_DESC: Record<string, string> = {
  'exterieur': 'Wassen, reinigen en beschermen — alles voor lak, velgen en glas.',
  'droogdoeken': 'Van 500 tot 1200 GSM — streeploos en krasvrij drogen.',
  'washandschoenen': 'Coral fleece & chenille — houdt vuil vast, niet op je lak.',
  'interieur': 'Microvezel en verzorging voor dashboard, leer en stof.',
  'accessoires': 'Emmers, borstels, sponzen — de tools van de pro.',
  'combinatiedeals': 'Complete pakketten met bundelvoordeel.',
};

export default async function HomePage() {
  const supabase = createServiceClient();
  const { data: featured } = isMock
    ? getMockProducts({ featured: true, limit: 8 }) as any
    : await supabase.from('products').select('*, categories(name, slug)')
        .eq('is_active', true).eq('is_featured', true).limit(8);

  const { data: categories } = await supabase.from('categories')
    .select('*').is('parent_id', null).order('sort_order');

  // Droogdoek-feature: probeer beide bekende slugs
  let { data: towel } = await supabase.from('products').select('*')
    .eq('slug', 'vami-drying-towel-xl').maybeSingle();
  if (!towel) {
    const { data: alt } = await supabase.from('products').select('*')
      .eq('slug', 'drooghandoek-xxl-1200-gsm').maybeSingle();
    towel = alt;
  }
  const { data: pakket } = await supabase.from('products').select('*')
    .eq('slug', 'volledig-pakket-xxl').maybeSingle();

  const euro = (c: number) => `\u20ac ${(c / 100).toFixed(2).replace('.', ',')}`;

  return (
    <>
      <Preloader />
      <Cursor />

      {/* ===== HERO ===== */}
      <section className="relative -mt-[104px] flex min-h-[100svh] flex-col justify-end overflow-hidden bg-black pt-[104px] md:-mt-[108px]">
        <div className="absolute inset-0 overflow-hidden">
          <ParallaxImg strength={7} className="h-[112%]">
            <img src="/images/hero-audi.jpg" alt="Audi gedetaild met VamiPro producten"
              className="h-full w-full object-cover object-[center_26%] opacity-85" />
          </ParallaxImg>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/30" />
        </div>
        <div className="beam" aria-hidden="true" />
        <FoamLayer count={16} />

        <div className="wrap relative z-10 w-full pb-8 pt-40 md:pb-12">
          <div className="fade-up flex items-center gap-4" style={{ '--d': '1500ms' } as React.CSSProperties}>
            <span className="h-px w-12 bg-accent-bright" />
            <span className="eyebrow !text-accent-bright">Car detailing · NL &amp; BE</span>
          </div>
          <h1 className="h-hero mt-6 text-white drop-shadow-lg">
            <span className="mask-line"><span style={{ '--d': '1600ms' } as React.CSSProperties}>Ultieme glans</span></span>
            <span className="mask-line"><span style={{ '--d': '1710ms' } as React.CSSProperties}>&amp; bescherming voor</span></span>
            <span className="mask-line"><span className="gloss-text" style={{ '--d': '1820ms' } as React.CSSProperties}>de échte liefhebber.</span></span>
          </h1>
          <p className="fade-up mt-7 max-w-xl text-lg text-zinc-300" style={{ '--d': '2050ms' } as React.CSSProperties}>
            Professionele detailingproducten — van veilig wassen tot showroomglans.
            Ontwikkeld voor liefhebbers en pro&apos;s.
          </p>
          <div className="fade-up mt-9 flex max-w-xl flex-wrap items-center gap-4" style={{ '--d': '2250ms' } as React.CSSProperties}>
            <Magnetic><Link href="/producten" className="btn btn-primary">Shop de collectie <ArrowRight size={16} /></Link></Magnetic>
            <Magnetic><a href="#collectie" className="btn btn-ghost">Bekijk categorieën</a></Magnetic>
          </div>
          <div className="fade-up mt-9 max-w-xl drop-shadow-xl" style={{ '--d': '2400ms' } as React.CSSProperties}>
            <LiveSearchBar />
          </div>
        </div>

        {/* Stats-balk */}
        <div className="fade-up relative z-10 border-t border-white/10 bg-black/35 backdrop-blur-md" style={{ '--d': '2550ms' } as React.CSSProperties}>
          <div className="wrap flex flex-wrap items-center justify-between gap-x-10 gap-y-4 py-5">
            {[
              { v: 1200, suf: ' GSM', label: 'Dikste droogdoek' },
              { v: 75, pre: '€ ', suf: '+', label: 'Gratis verzending' },
              { v: 14, label: 'Dagen bedenktijd' },
              { v: 16, suf: ':00', label: 'Besteld = vandaag verzonden' },
            ].map((s, i) => (
              <div key={i}>
                <div className="disp text-xl text-white md:text-2xl">
                  {s.pre}<CountUp to={s.v} duration={1400} /><span className="text-accent-bright">{s.suf}</span>
                </div>
                <div className="mono mt-0.5 text-[9px] uppercase tracking-[0.22em] text-zinc-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <Marquee items={['Showroomglans', 'Swirl-vrij wassen', '1200 GSM', 'Krasvrij drogen', 'Voor 16:00 = vandaag verzonden']} />

      {/* ===== COLLECTIE — alle categorieën ===== */}
      <section id="collectie" className="wrap py-20 md:py-32">
        <div className="mb-10 flex items-end justify-between gap-6 md:mb-14">
          <Reveal>
            <p className="eyebrow">De collectie</p>
            <h2 className="h-section mt-4">Kies je categorie.<br />Direct naar de juiste tools.</h2>
          </Reveal>
          <Reveal delay={120}>
            <Link href="/producten" className="mono hidden text-[11px] uppercase tracking-[0.2em] text-fg-muted transition-colors hover:text-accent-bright md:block">
              Alle producten →
            </Link>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-6">
          {(categories || []).map((c: any, i: number) => {
            const img = CAT_IMAGES[c.slug] || '/images/hero-audi.jpg';
            const big = i < 2;
            const isExterieur = c.slug.startsWith('exterieur');
            return (
              <Reveal key={c.id} delay={i * 90}
                className={big ? 'lg:col-span-3' : 'lg:col-span-2'}>
                <Link href={`/categorie/${c.slug}`}
                  className={`tile block ${big ? 'min-h-[320px]' : 'min-h-[240px]'}`}>
                  <div className="t-bg"><img src={img} alt={c.name} loading="lazy" /></div>
                  <div className="t-scrim" />
                  <div className="t-sheen" />
                  {isExterieur && (
                    <div className="t-foam" aria-hidden="true">
                      <i style={{ left: '12%', width: 26, height: 26 }} />
                      <i style={{ left: '34%', width: 14, height: 14, animationDelay: '1.1s' }} />
                      <i style={{ left: '58%', width: 20, height: 20, animationDelay: '.5s' }} />
                      <i style={{ left: '82%', width: 18, height: 18, animationDelay: '1.8s' }} />
                    </div>
                  )}
                  <div className="t-go">→</div>
                  <div className="t-inner">
                    <div className="t-idx">{String(i + 1).padStart(2, '0')} — {c.name}</div>
                    <h3>{c.name}</h3>
                    <p className="t-desc">{c.description || CAT_DESC[c.slug] || 'Bekijk het assortiment.'}</p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ===== BESTSELLERS ===== */}
      {featured && featured.length > 0 && (
        <section id="bestsellers" className="wrap pb-20 md:pb-32">
          <div className="mb-10 flex items-end justify-between gap-6 md:mb-14">
            <Reveal>
              <p className="eyebrow">Bestsellers</p>
              <h2 className="h-section mt-4">Waar liefhebbers<br />mee thuiskomen.</h2>
            </Reveal>
            <Reveal delay={120}>
              <Link href="/producten" className="mono hidden text-[11px] uppercase tracking-[0.2em] text-fg-muted transition-colors hover:text-accent-bright md:block">
                Alle producten →
              </Link>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
            {featured.map((p: any, i: number) => (
              <Reveal key={p.id} delay={(i % 4) * 90}>
                <Tilt className="h-full"><ProductCard p={p} /></Tilt>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ===== DROOGDOEK 1200 GSM ===== */}
      {towel && (
        <section className="relative overflow-hidden border-y hairline bg-[color:var(--panel)]/40">
          <div className="relative flex min-h-[92svh] items-center py-20">
            <div className="absolute right-[-1vw] top-1/2" style={{ transform: 'translateY(-50%)' }}>
              <GiantCounter to={1200} />
            </div>
            <div className="wrap relative z-10 grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <Reveal variant="left">
                <div className="img-sheen overflow-hidden rounded-3xl border hairline shadow-2xl">
                  {towel.cloudinary_images?.length
                    ? <ImageGallery images={towel.cloudinary_images} productName={towel.name} />
                    : <ParallaxImg strength={5}><img src="/images/drying_towel.jpg" alt={towel.name} className="h-full w-full object-cover" /></ParallaxImg>}
                </div>
              </Reveal>
              <div>
                <Reveal variant="right">
                  <p className="eyebrow">Bestseller</p>
                  <h2 className="h-section mt-4">De dikste droogdoek<br />die we verkopen.</h2>
                  <p className="mt-5 max-w-xl text-lg text-fg-muted">
                    1200 gram per vierkante meter twisted-loop microvezel.
                    Eén doek, één auto, nul strepen — zonder ooit de lak te raken.
                  </p>
                </Reveal>
                <ul className="mt-7 space-y-3">
                  {[
                    ['60×90 cm', 'droogt een hele auto in één keer'],
                    ['100% veilig', 'voor alle lakken en coatings'],
                    ['Duurzaam', 'en honderden keren wasbaar'],
                  ].map(([b, t], i) => (
                    <Reveal key={i} variant="right" delay={140 + i * 100}>
                      <li className="flex items-baseline gap-3 text-fg-muted">
                        <span className="mono text-accent-bright">—</span>
                        <span><b className="font-semibold text-fg">{b}</b> {t}</span>
                      </li>
                    </Reveal>
                  ))}
                </ul>
                <Reveal variant="right" delay={480}>
                  <div className="mt-9 flex flex-wrap items-center gap-5">
                    <Magnetic>
                      <Link href={`/producten/${towel.slug}`} className="btn btn-primary">
                        Shop de droogdoek <ArrowRight size={16} />
                      </Link>
                    </Magnetic>
                    <span className="disp text-2xl">{euro(towel.price_cents)}</span>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== PAKKET XXL ===== */}
      <section className="wrap py-20 md:py-32">
        <Reveal>
          <div className="card grid overflow-hidden !rounded-3xl md:grid-cols-2">
            <div className="relative flex flex-col justify-center gap-4 p-8 md:p-14">
              <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40"
                style={{ background: 'radial-gradient(ellipse at top, var(--accent-glow), transparent 70%)' }} />
              <span className="mono relative inline-flex self-start rounded-full border border-accent/40 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.2em] text-accent-bright">
                Tijdelijke actie · Bespaar € 17,25
              </span>
              <h2 className="h-section relative">Showroom pakket XXL</h2>
              <p className="relative text-fg-muted">
                Alles wat je nodig hebt voor de perfecte wasbeurt en detailing — in één doos.
                Inclusief droogdoek, washandschoen, emmer met grit guard en meer.
              </p>
              <div className="relative flex items-baseline gap-4">
                <span className="disp text-4xl md:text-5xl">{pakket ? euro(pakket.price_cents) : '€ 189,95'}</span>
                <span className="text-fg-faint line-through decoration-bad/70">€ 207,20</span>
              </div>
              <div className="relative mt-2">
                <Magnetic>
                  <Link href="/producten/volledig-pakket-xxl" className="btn btn-primary">
                    Profiteer nu <ArrowRight size={16} />
                  </Link>
                </Magnetic>
              </div>
            </div>
            <div className="img-sheen relative min-h-[340px] overflow-hidden bg-black">
              <img
                src={pakket?.cloudinary_images?.[0] ? cldUrl(pakket.cloudinary_images[0], { w: 1000 }) : 'https://res.cloudinary.com/dxcohla4k/image/upload/vamipro/wvdx3jkdkbvlsc9jc5vh'}
                alt="Showroom pakket XXL"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out hover:scale-105"
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ===== HET RITUEEL ===== */}
      <section className="wrap pb-20 md:pb-32">
        <div className="mb-10 md:mb-14">
          <Reveal>
            <p className="eyebrow">Het ritueel</p>
            <h2 className="h-section mt-4">Drie fases.<br />Eén showroomresultaat.</h2>
          </Reveal>
        </div>
        <div className="grid gap-3.5 md:grid-cols-3">
          {[
            ['Wassen', 'Snow foam weekt het vuil los, de grit guard houdt je washandschoen schoon. Contactloos waar het kan, veilig waar het moet.'],
            ['Drogen', 'De 1200 GSM droogdoek neemt alles in één beweging op. Geen strepen, geen swirls — de lak blijft onaangeraakt.'],
            ['Detailen', 'Borstels, sponzen en microvezel voor velgen, naden en interieur. De details maken het verschil tussen schoon en showroom.'],
          ].map(([t, d], i) => (
            <Reveal key={i} delay={i * 110}>
              <div className="card card-hover relative h-full overflow-hidden p-8 pb-10">
                <span className="mono block text-[10px] tracking-[0.25em] text-accent-bright">0{i + 1}</span>
                <h3 className="disp mt-9 text-xl">{t}</h3>
                <p className="mt-3 text-sm text-fg-muted">{d}</p>
                <span aria-hidden className="disp pointer-events-none absolute -bottom-8 right-0 select-none text-[7rem] leading-none text-transparent"
                  style={{ WebkitTextStroke: '1px var(--line)' }}>{i + 1}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== BANNER ===== */}
      <section className="relative flex min-h-[64vh] items-end overflow-hidden border-t hairline">
        <div className="absolute inset-0">
          <ParallaxImg strength={9} className="h-[118%]">
            <img src="/images/washing_tools_detailing.png" alt="Professionele detailing tools" className="h-full w-full object-cover" />
          </ParallaxImg>
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/25 to-black/40" />
        </div>
        <div className="wrap relative z-10 w-full py-16 text-center md:py-20">
          <Reveal variant="blur">
            <p className="eyebrow !text-accent-bright drop-shadow-md">Professional grade</p>
            <h2 className="disp mt-4 text-4xl leading-[0.98] text-white drop-shadow-lg md:text-6xl">
              Alles voor de<br />perfecte wasbeurt.
            </h2>
          </Reveal>
        </div>
      </section>

      {/* ===== QUOTE ===== */}
      <section className="border-b hairline bg-[color:var(--panel)]/40">
        <div className="wrap py-20 md:py-28">
          <Reveal>
            <div className="disp text-7xl leading-[0.5] text-accent-bright">"</div>
            <blockquote className="disp mt-7 max-w-3xl text-2xl leading-[1.28] md:text-4xl" style={{ textTransform: 'none', fontStretch: '108%' }}>
              Mijn zwarte lak heeft nog nooit zo diep gestaan. De droogdoek alleen al is z&apos;n geld dubbel waard.
            </blockquote>
            <div className="mt-8 flex items-center gap-4">
              <span className="disp grid h-11 w-11 place-items-center rounded-full border hairline bg-gradient-to-br from-accent to-[#0E1524] text-sm text-white">MV</span>
              <span><b className="block text-sm">Mark V.</b><span className="text-xs text-fg-faint">BMW M4 · Antwerpen</span></span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 opacity-60"
          style={{ background: 'radial-gradient(ellipse at top, var(--accent-glow), transparent 70%)' }} />
        <div className="wrap relative flex flex-col items-center py-24 text-center md:py-40">
          <Reveal><p className="eyebrow">Klaar om te beginnen?</p></Reveal>
          <Reveal delay={100} variant="blur">
            <h2 className="h-hero mt-6">Showroomglans<br /><span className="gloss-text">begint hier.</span></h2>
          </Reveal>
          <Reveal delay={220}>
            <p className="mx-auto mt-6 max-w-md text-lg text-fg-muted">
              Voor 16:00 besteld, vandaag verzonden. Gratis verzending vanaf € 75 in NL &amp; BE.
            </p>
          </Reveal>
          <Reveal delay={340}>
            <div className="mt-10">
              <Magnetic>
                <Link href="/producten" className="btn btn-primary !px-9 !py-4 !text-base">
                  Shop de collectie <ArrowRight size={18} />
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
