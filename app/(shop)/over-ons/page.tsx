import { ShieldCheck, Target, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Over Ons',
  description: 'Ontdek het verhaal achter Vami Pro. Wij leveren professionele detailingproducten voor de ultieme glans en bescherming.',
};

export default function OverOnsPage() {
  return (
    <>
      <div className="wrap py-12 md:py-24 max-w-3xl">
        <h1 className="h-section">Over Vami Pro</h1>
        <p className="mt-6 text-lg text-fg-muted leading-relaxed">
          Welkom bij Vami Pro, dé plek voor professionele car detailing producten. 
          Wij geloven dat elke auto, van een trouwe gezinswagen tot een exclusieve supercar, de best mogelijke verzorging verdient.
          Daarom hebben wij een premium assortiment samengesteld dat zowel door enthousiaste liefhebbers als doorgewinterde professionals wordt gebruikt.
        </p>

        <h2 className="mt-16 font-display text-2xl font-semibold">Onze Missie</h2>
        <p className="mt-4 text-fg-muted leading-relaxed">
          Onze missie is simpel: we willen de hoogste kwaliteit detailingproducten toegankelijk maken voor iedereen in Nederland en België. 
          Of je nu op zoek bent naar de perfecte veilige shampoo voor je wekelijkse wasbeurt, of een geavanceerde keramische coating met jarenlange bescherming — wij bieden uitsluitend producten aan waar we zelf voor de volle 100% achter staan.
        </p>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          <div className="card p-6 border hairline">
            <Sparkles className="text-accent mb-4" size={28} strokeWidth={1.5} />
            <h3 className="font-display font-medium text-lg mb-2">Showroom Resultaat</h3>
            <p className="text-sm text-fg-muted">Alleen de beste producten voor een spiegelgladde finish en diepe glans.</p>
          </div>
          <div className="card p-6 border hairline">
            <ShieldCheck className="text-accent mb-4" size={28} strokeWidth={1.5} />
            <h3 className="font-display font-medium text-lg mb-2">Duurzame Bescherming</h3>
            <p className="text-sm text-fg-muted">Van snelle sealants tot 9H hardheid coatings die tot wel 3 jaar meegaan.</p>
          </div>
          <div className="card p-6 border hairline">
            <Target className="text-accent mb-4" size={28} strokeWidth={1.5} />
            <h3 className="font-display font-medium text-lg mb-2">Voor Pro&apos;s en Liefhebbers</h3>
            <p className="text-sm text-fg-muted">Eenvoudig in gebruik, maar met professionele en betrouwbare resultaten.</p>
          </div>
        </div>

        <h2 className="mt-16 font-display text-2xl font-semibold">Vragen of Advies?</h2>
        <p className="mt-4 text-fg-muted leading-relaxed">
          Kom je er niet helemaal uit of wil je advies over welk product het beste past bij de lak van jouw auto? 
          We helpen je graag verder. Neem gerust contact met ons op en we zorgen dat je met het juiste arsenaal aan de slag kunt gaan.
        </p>
      </div>
    </>
  );
}
