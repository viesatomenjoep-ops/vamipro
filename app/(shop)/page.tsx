import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import { CATEGORIES } from '@/lib/categories';
import ProductCard from '@/components/shop/ProductCard';
import Reveal from '@/components/shop/Reveal';
import CountdownTimer from '@/components/shop/CountdownTimer';
import ImageGallery from '@/components/shop/ImageGallery';
import { ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';
import { isMock, getMockProducts } from '@/lib/mock-data';

export const revalidate = 60;

export default async function HomePage() {
  const supabase = createServiceClient();
  const { data: featured } = isMock 
    ? getMockProducts({ featured: true, limit: 4 }) as any
    : await supabase.from('products').select('*').eq('is_active', true).eq('is_featured', true).limit(4);
    
  const { data: settings } = await supabase.from('store_settings').select('*').eq('id', 1).single();
  const { data: categories } = await supabase.from('categories').select('*').is('parent_id', null).order('sort_order');
  const { data: droogdoekXxl } = await supabase.from('products').select('*').eq('slug', 'drooghandoek-xxl-1200-gsm').single();

  return (
    <>
      {/* ===== HERO WITH AUDI Q3 BACKGROUND ===== */}
      <section className="relative flex min-h-[100vh] w-full flex-col overflow-hidden pt-32 pb-8 md:pt-36 md:pb-12 -mt-[104px] md:-mt-[108px]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-audi.jpg" 
            alt="Audi Q3 Detailing by VaMiPro" 
            className="h-full w-full object-cover object-center"
          />
          {/* Gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
        </div>

        {/* Hero Content Wrap */}
        <div className="wrap relative z-10 flex flex-1 w-full flex-col justify-between">
          
          {/* Top Part: Title */}
          <div className="max-w-3xl">
            <p className="eyebrow text-base md:text-xs">Car detailing · NL &amp; BE</p>
            <h1 className="h-hero mt-6 text-[3.5rem] leading-[1.05] md:text-[4rem] lg:text-[4.5rem] md:mt-5">
              Een finish die<br />
              <span className="gloss-text">het licht vangt.</span>
            </h1>
          </div>

          {/* Bottom Part: Text & Button */}
          <div className="max-w-3xl mt-auto pt-16">
            <p className="max-w-xl text-xl text-fg-muted md:text-lg drop-shadow-md">
              Professionele detailingproducten, ontwikkeld voor liefhebbers en pro&apos;s.
              Van veilig wassen tot keramische coatings met jarenlange bescherming.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 md:mt-6">
              <Link href="/producten" className="btn btn-primary shadow-2xl text-lg px-8 py-4 md:text-sm md:px-5 md:py-2.5">
                Shop alle producten
              </Link>
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

      {/* ===== CATEGORIES ===== */}
      <section className="wrap py-12 md:py-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Aanbod</p>
            <h2 className="h-section mt-3">Ons assortiment</h2>
          </div>
          <Link prefetch={true} href="/producten" className="hidden text-sm text-accent hover:underline sm:inline">Alles bekijken →</Link>
        </div>
        <div className="mt-8 grid gap-px overflow-hidden rounded border hairline grid-cols-2 lg:grid-cols-3">
          {categories?.map((c, i) => (
            <Reveal key={c.slug} delay={i * 60}>
              <Link prefetch={true} href={`/categorie/${c.slug}`}
                className="group flex h-full flex-col justify-between bg-panel p-4 transition-all duration-300 hover:bg-panel-2 hover:-translate-y-1 hover:shadow-lg sm:p-7">
                <span className="font-display text-xs text-accent transition-transform duration-300 group-hover:scale-110 group-hover:translate-x-1 sm:text-sm">0{i + 1}</span>
                <div className="mt-6 sm:mt-10">
                  <h3 className="font-display text-base font-medium transition-colors duration-300 group-hover:text-accent-bright sm:text-xl">{c.name}</h3>
                  {c.description && <p className="mt-1 text-xs text-fg-muted sm:mt-2 sm:text-sm">{c.description}</p>}
                  <span className="mt-3 inline-block text-xs text-fg-faint transition-all duration-300 group-hover:text-accent group-hover:translate-x-1 sm:mt-4 sm:text-sm">
                    Bekijk categorie →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== PROMO ACTION ===== */}
      <section className="wrap py-12 md:py-20 border-t hairline">
        <div className="flex flex-col lg:flex-row items-center gap-12 bg-panel rounded-2xl border hairline p-8 md:p-12 shadow-lg relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40"
               style={{ background: 'radial-gradient(ellipse at top, var(--accent-glow), transparent 70%)' }} />
          <div className="flex-1 relative z-10">
            <p className="eyebrow text-accent">Tijdelijke Actie</p>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-semibold">
              Volledig pakket XXL
            </h2>
            <p className="mt-4 text-fg-muted max-w-xl text-lg">
              Alles wat je nodig hebt voor de perfecte wasbeurt en detailing. 
              Haal alles in huis voor een schitterende glans.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <span className="text-4xl font-bold text-fg">€ 189,95</span>
              <span className="text-xl text-fg-muted line-through decoration-red-500">€ 207,20</span>
            </div>
            
            <CountdownTimer targetDate="2026-07-31T00:00:00+02:00" />
            
            <div className="mt-8">
              <Link href="/producten/volledig-pakket-xxl" className="btn btn-primary px-8 py-3 text-lg">
                Profiteer Nu
              </Link>
            </div>
          </div>
          <div className="flex-1 relative z-10 w-full max-w-lg lg:max-w-xl">
            <img 
              src="https://res.cloudinary.com/dxcohla4k/image/upload/v1782069195/vamipro/promos/ecqreng4ydhi5ej7lram.jpg" 
              alt="Volledig Pakket XXL" 
              className="w-full h-auto rounded-xl shadow-2xl object-cover"
            />
          </div>
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
            {featured.map((p: any) => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>
      )}

      {/* ===== DROOGDOEK XXL FEATURE ===== */}
      {droogdoekXxl && (
        <section className="wrap py-12 md:py-20">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="w-full lg:w-[55%] order-2 lg:order-1">
              <ImageGallery images={droogdoekXxl.cloudinary_images || []} productName="Droogdoek XXL" />
            </div>
            <div className="w-full lg:w-[45%] order-1 lg:order-2">
              <p className="eyebrow text-accent">Nieuw in assortiment</p>
              <h2 className="mt-3 font-display text-3xl md:text-5xl font-semibold">
                Drooghandoek XXL 1200 GSM
              </h2>
              <p className="mt-4 text-fg-muted max-w-xl text-lg">
                Super absorberende, mega dikke droogdoek van 1200 GSM. 
                Droog je auto moeiteloos en streeploos in recordtijd af zonder krassen te maken.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <span className="text-4xl font-bold text-fg">€ 17,95</span>
              </div>
              <ul className="mt-6 space-y-2 text-fg-muted">
                <li className="flex items-center gap-2"><Sparkles size={16} className="text-accent" /> Extra groot en super absorberend</li>
                <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-accent" /> 100% veilig voor alle lakken</li>
                <li className="flex items-center gap-2"><RotateCcw size={16} className="text-accent" /> Duurzaam en wasbaar</li>
              </ul>
              <div className="mt-8">
                <Link href={`/producten/${droogdoekXxl.slug}`} className="btn btn-primary px-8 py-3 text-lg">
                  Shop Droogdoek XXL
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== WASHING TOOLS AI BANNER ===== */}
      <section className="relative h-[60vh] min-h-[400px] w-full mt-4 mb-16 overflow-hidden">
        <img 
          src="/images/washing_tools_detailing.png" 
          alt="Premium Car Detailing Washing Tools" 
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-center">
          <p className="eyebrow text-accent-bright drop-shadow-md">Professional Grade</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-semibold text-white drop-shadow-lg">
            Alles voor de <br className="md:hidden" />perfecte wasbeurt.
          </h2>
        </div>
      </section>

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
