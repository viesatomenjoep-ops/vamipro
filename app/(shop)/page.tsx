import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import { CATEGORIES } from '@/lib/categories';
import ProductCard from '@/components/shop/ProductCard';
import Reveal from '@/components/shop/Reveal';
import CountdownTimer from '@/components/shop/CountdownTimer';
import ImageGallery from '@/components/shop/ImageGallery';
import LiveSearchBar from '@/components/shop/LiveSearchBar';
import CategoryCarousel from '@/components/shop/CategoryCarousel';
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
      {/* ===== HERO SPLIT ===== */}
      <section className="relative w-full overflow-hidden bg-black pt-[104px] -mt-[104px] md:-mt-[108px]">
        <div className="flex flex-col lg:flex-row min-h-[70vh] lg:min-h-[85vh]">
          {/* LEFT: HERO IMAGE & TEXT */}
          <div className="relative flex-1 flex flex-col justify-center items-center p-6 lg:p-12 overflow-hidden min-h-[50vh] lg:min-h-full">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img 
                src="/images/hero-audi.jpg" 
                alt="Audi Q3 Detailing by VaMiPro" 
                className="h-full w-full object-cover object-[center_20%] lg:object-center opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
            </div>
            
            {/* Hero Text */}
            <div className="relative z-10 w-full max-w-xl text-center mt-auto lg:mt-16 mb-8 lg:mb-0">
              <h1 className="h-hero text-white text-[2rem] leading-[1.1] sm:text-[2.5rem] lg:text-[3rem] drop-shadow-lg">
                Ultieme glans en bescherming<br />
                <span className="gloss-text">voor de échte liefhebber.</span>
              </h1>
              <div className="w-full mt-8 md:mt-10 relative z-30 px-2 sm:px-0 drop-shadow-xl">
                <LiveSearchBar />
              </div>
            </div>
          </div>

          {/* RIGHT: PROMO ACTION */}
          <div className="relative lg:w-[35%] xl:w-[30%] flex flex-col justify-center bg-panel lg:border-l hairline p-6 md:p-8 xl:p-10">
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40"
                 style={{ background: 'radial-gradient(ellipse at top, var(--accent-glow), transparent 70%)' }} />
            <div className="relative z-10 w-full max-w-[340px] mx-auto">
              <p className="eyebrow text-accent text-xs">Tijdelijke Actie</p>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-semibold leading-tight">
                Showroom pakket XXL
              </h2>
              <p className="mt-2 text-sm text-fg-muted">
                Alles wat je nodig hebt voor de perfecte wasbeurt en detailing.
              </p>
              
              <div className="mt-4 flex items-center gap-3">
                <span className="text-2xl font-bold text-fg">€ 189,95</span>
                <span className="text-base text-fg-muted line-through decoration-red-500">€ 207,20</span>
              </div>
              
              <div className="mt-4 transform scale-90 origin-left">
                <CountdownTimer targetDate="2026-07-31T00:00:00+02:00" />
              </div>

              <div className="mt-5 aspect-[4/3] overflow-hidden rounded-xl shadow-lg border hairline bg-black">
                <img 
                  src="https://res.cloudinary.com/dxcohla4k/image/upload/v1782069195/vamipro/promos/ecqreng4ydhi5ej7lram.jpg" 
                  alt="Showroom pakket XXL" 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              
              <div className="mt-6">
                <Link href="/producten/volledig-pakket-xxl" className="btn btn-primary w-full py-3 text-base justify-center shadow-lg">
                  Profiteer Nu
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== USP STRIP (Subtle narrow bar) ===== */}
      <section className="border-b hairline bg-panel/80 backdrop-blur-md text-xs sm:text-sm">
        <div className="wrap py-3 md:py-4">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:justify-between opacity-90">
            {[
              [Truck, 'Voor 16:00 besteld', 'vandaag verzonden'],
              [ShieldCheck, 'Veilig betalen', 'iDEAL & Bancontact'],
              [Sparkles, 'Gratis verzending', 'vanaf € 75'],
              [RotateCcw, '14 dagen', 'bedenktijd'],
            ].map(([Icon, t, s]: any, i) => (
              <div key={i} className="flex items-center gap-2">
                <Icon size={18} className="text-accent" strokeWidth={1.8} />
                <div className="flex sm:flex-col sm:gap-0 gap-1 items-center sm:items-start">
                  <span className="font-medium text-fg whitespace-nowrap">{t}</span>
                  <span className="text-fg-muted whitespace-nowrap hidden sm:inline">{s}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INTRO & SHOP BUTTON ===== */}
      <section className="bg-panel py-10 md:py-16 border-b hairline relative z-20 shadow-sm mt-0">
        <div className="wrap max-w-3xl mx-auto flex flex-col items-center text-center">
          <p className="max-w-2xl text-base sm:text-lg text-fg-muted mb-6">
            Professionele detailingproducten, ontwikkeld voor liefhebbers en pro&apos;s.
            Van veilig wassen tot keramische coatings met jarenlange bescherming.
          </p>
          <div className="mb-2 flex flex-wrap justify-center gap-3">
            <Link href="/producten" className="btn btn-primary shadow-xl text-base px-8 py-3.5 md:text-sm md:px-6 md:py-3 rounded-full font-semibold">
              Shop alle producten
            </Link>
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
