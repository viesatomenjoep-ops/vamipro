import Link from 'next/link';
import { Check } from 'lucide-react';
import { createServiceClient } from '@/lib/supabase/server';
import GoogleCustomerReviews from '@/components/shop/GoogleCustomerReviews';

export const metadata = { title: 'Bedankt voor je bestelling' };

// Merchant-ID van Google Klantenreviews (Merchant Center).
const GCR_MERCHANT_ID = 5833555990;

export default async function ThanksPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams;

  // Bestelgegevens ophalen voor het Google Klantenreviews-fragment.
  let gcr: { orderId: string; email: string; country: string; delivery: string } | null = null;
  if (order) {
    try {
      const supabase = createServiceClient();
      const { data: o } = await supabase
        .from('orders')
        .select('order_number, ship_email, ship_country, paid_at, created_at, status')
        .eq('order_number', order)
        .single();
      if (o && o.ship_email && o.status !== 'cancelled') {
        // Geschatte leverdatum: besteldatum + 3 werkdagen (NL) of 4 (BE).
        const base = new Date(o.paid_at || o.created_at || Date.now());
        base.setDate(base.getDate() + (o.ship_country === 'BE' ? 4 : 3));
        gcr = {
          orderId: o.order_number,
          email: o.ship_email,
          country: o.ship_country === 'BE' ? 'BE' : 'NL',
          delivery: base.toISOString().slice(0, 10),
        };
      }
    } catch { /* stil negeren — pagina werkt ook zonder */ }
  }

  return (
    <div className="wrap grid min-h-[60vh] place-items-center pt-0 pb-20 text-center">
      {gcr && (
        <GoogleCustomerReviews
          merchantId={GCR_MERCHANT_ID}
          orderId={gcr.orderId}
          email={gcr.email}
          deliveryCountry={gcr.country}
          estimatedDeliveryDate={gcr.delivery}
        />
      )}
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
