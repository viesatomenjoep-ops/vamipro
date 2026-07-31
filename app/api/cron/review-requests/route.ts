import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { sendReviewRequest } from '@/lib/email';
import { getContent } from '@/lib/content';

export const runtime = 'nodejs';
// Deze route mag niet gecachet worden — hij draait als geplande taak.
export const dynamic = 'force-dynamic';

// Dagelijkse cron (zie vercel.json): stuurt elke betaalde klant één keer, een
// paar dagen ná de bestelling, een vriendelijke opvolg-mail met het verzoek om
// een 5-sterren Google-review. `review_request_sent_at` voorkomt dubbele mails.
export async function GET(req: NextRequest) {
  // Beveiliging: als CRON_SECRET is ingesteld, moet Vercel Cron 'm meesturen.
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }
  }

  const supabase = createServiceClient();

  // Wachttijd na de bestelling (in dagen) — instelbaar via site_content, standaard 4.
  let delayDays = 4;
  try {
    const t = await getContent();
    const raw = parseInt(t('review_request_delay_days', '4'), 10);
    if (Number.isFinite(raw) && raw >= 0) delayDays = raw;
  } catch { /* standaard aanhouden */ }

  const cutoff = new Date(Date.now() - delayDays * 24 * 60 * 60 * 1000).toISOString();

  // Kandidaten: betaalde/verzonden orders, oud genoeg, nog geen review-mail gehad.
  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, order_number, ship_email, ship_first_name, paid_at, status')
    .in('status', ['paid', 'processing', 'shipped', 'delivered'])
    .is('review_request_sent_at', null)
    .not('ship_email', 'is', null)
    .lte('paid_at', cutoff)
    .order('paid_at', { ascending: true })
    .limit(50); // max per run — voorkomt time-outs

  if (error) {
    console.error('Review-cron query', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  let sent = 0;
  let skippedNoLink = 0;
  for (const order of orders ?? []) {
    try {
      const ok = await sendReviewRequest(order);
      if (!ok) { skippedNoLink++; continue; } // geen review-link ingesteld → niets versturen
      await supabase
        .from('orders')
        .update({ review_request_sent_at: new Date().toISOString() })
        .eq('id', order.id);
      sent++;
    } catch (e) {
      console.error('Review-mail mislukt voor', order.order_number, e);
    }
  }

  // Als er geen review-link is, is alles overgeslagen — dan niets markeren,
  // zodat de mails alsnog uitgaan zodra de link is ingesteld.
  return NextResponse.json({ ok: true, candidates: orders?.length ?? 0, sent, skippedNoLink });
}
