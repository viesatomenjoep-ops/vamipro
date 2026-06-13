import Link from 'next/link';
import { Check } from 'lucide-react';

export const metadata = { title: 'Bedankt voor je bestelling' };

export default async function ThanksPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams;
  return (
    <div className="wrap grid min-h-[60vh] place-items-center pt-0 pb-20 text-center">
      <div>
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent-soft ring-1 ring-accent/30">
          <Check size={28} className="text-accent" />
        </div>
        <h1 className="h-section mt-6">Bedankt voor je bestelling</h1>
        {order && <p className="mt-3 font-display text-lg text-accent">{order}</p>}
        <p className="mx-auto mt-3 max-w-md text-fg-muted">
          Je betaling is ontvangen. Je krijgt een bevestiging met factuur per e-mail, en zodra je pakket is
          aangemeld ontvang je een track &amp; trace-link.
        </p>
        <Link href="/producten" className="btn btn-ghost mt-8">Verder winkelen</Link>
      </div>
    </div>
  );
}
