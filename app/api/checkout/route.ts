import { NextRequest, NextResponse } from 'next/server';
import { mollie } from '@/lib/mollie';
import { createServiceClient } from '@/lib/supabase/server';
import { getShopConfig } from '@/lib/shop-config';
import { getDiscountUsedCount } from '@/lib/discount';
import { z } from 'zod';

const schema = z.object({
  items: z.array(z.object({ productId: z.string(), quantity: z.number().int().positive() })),
  shipping: z.object({
    firstName: z.string().min(1), lastName: z.string().min(1),
    address: z.string().min(1), houseNumber: z.string().min(1), addition: z.string().nullish(),
    postalCode: z.string().min(1), city: z.string().min(1), country: z.enum(['NL', 'BE']),
    email: z.string().email(), phone: z.string().min(1),
  }),
  billing: z.object({ company: z.string().nullish(), vatNumber: z.string().nullish() }).nullish(),
  shippingMethodId: z.string(),
  paymentMethod: z.enum(['ideal', 'bancontact']),
  discountCode: z.string().nullish(),
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const supabase = createServiceClient();
    const cfg = await getShopConfig();

    const ids = body.items.map((i) => i.productId);
    const { data: products } = await supabase
      .from('products').select('*').in('id', ids).eq('is_active', true);
    if (!products?.length) return NextResponse.json({ error: 'Geen geldige producten' }, { status: 400 });

    let subtotal = 0, vat = 0;
    const items = body.items.map((i) => {
      const p = products.find((x) => x.id === i.productId);
      if (!p) throw new Error('Product niet gevonden');
      const line = p.price_cents * i.quantity;
      subtotal += line;
      vat += Math.round(line - line / (1 + Number(p.vat_rate) / 100));
      return { product: p, quantity: i.quantity, line };
    });

    const codeUpper = (body.discountCode ?? '').toUpperCase();
    const isOneCent = !!cfg.oneCentCode && codeUpper === cfg.oneCentCode;

    const baseShipping = body.shipping.country === 'BE' ? cfg.shippingCentsBe : cfg.shippingCents;
    // Gratis verzending alleen als er een drempel is ingesteld (> 0); anders altijd verzendkosten.
    let shippingCents = (cfg.freeShipCents > 0 && subtotal >= cfg.freeShipCents) ? 0 : baseShipping;

    let discountCents = 0;
    let appliedDiscountCode: string | null = null;
    if (cfg.promoActive && codeUpper && codeUpper === cfg.discountCode) {
      // "Eerste X klanten"-limiet: als de actie vol is, geen korting toepassen.
      const capReached =
        cfg.discountMaxUses > 0 &&
        (await getDiscountUsedCount(cfg.discountCode)) >= cfg.discountMaxUses;
      if (!capReached) {
        discountCents = Math.round(subtotal * cfg.discountPercent / 100);
        appliedDiscountCode = cfg.discountCode;
      }
    }

    let total = subtotal - discountCents + shippingCents;

    // Testcode: gratis verzending en totaal €0,01 (Mollie accepteert geen €0).
    if (isOneCent) {
      shippingCents = 0;
      discountCents = Math.max(0, subtotal - 1);
      total = 1;
    }

    const { data: orderNum } = await supabase.rpc('next_counter', { counter_key: 'order' });
    const orderNumber = `VP-2026-${String(orderNum).padStart(5, '0')}`;

    const { data: order, error } = await supabase.from('orders').insert({
      order_number: orderNumber, status: 'pending',
      subtotal_cents: subtotal, shipping_cents: shippingCents, vat_cents: vat, total_cents: total,
      ship_first_name: body.shipping.firstName, ship_last_name: body.shipping.lastName,
      ship_address: body.shipping.address, ship_house_number: body.shipping.houseNumber,
      ship_addition: body.shipping.addition, ship_postal_code: body.shipping.postalCode,
      ship_city: body.shipping.city, ship_country: body.shipping.country,
      ship_email: body.shipping.email, ship_phone: body.shipping.phone,
      bill_company: body.billing?.company, bill_vat_number: body.billing?.vatNumber,
      payment_method: body.paymentMethod,
    }).select().single();
    if (error || !order) return NextResponse.json({ error: 'Order aanmaken mislukt' }, { status: 500 });

    // Registreer de gebruikte actiecode (best-effort): pas actief zodra de
    // migratie discount_cap.sql is uitgevoerd. Faalt 'ie (kolom bestaat nog niet),
    // dan blijft de bestelling gewoon doorgaan.
    if (appliedDiscountCode) {
      try {
        await supabase.from('orders')
          .update({ discount_code: appliedDiscountCode, discount_cents: discountCents })
          .eq('id', order.id);
      } catch { /* kolommen bestaan nog niet — negeren */ }
    }

    await supabase.from('order_items').insert(items.map((it) => ({
      order_id: order.id, product_id: it.product.id, product_name: it.product.name,
      sku: it.product.sku, unit_price_cents: it.product.price_cents,
      vat_rate: it.product.vat_rate, quantity: it.quantity, line_total_cents: it.line,
    })));

    // Bepaal de basis-URL uit het echte verzoek (dat adres is per definitie bereikbaar voor Mollie).
    // Bij lokaal testen (localhost) valt 'ie terug op NEXT_PUBLIC_SITE_URL, zodat je daar een
    // publieke tunnel-URL (bv. ngrok) kunt instellen.
    const origin = req.nextUrl.origin;
    const isLocal = origin.includes('localhost') || origin.includes('127.0.0.1');
    const site = isLocal ? (process.env.NEXT_PUBLIC_SITE_URL ?? origin) : origin;
    const payment = await mollie.payments.create({
      amount: { currency: 'EUR', value: (total / 100).toFixed(2) },
      description: `Vami Pro bestelling ${orderNumber}`,
      redirectUrl: `${site}/checkout/bedankt?order=${orderNumber}`,
      webhookUrl: `${site}/api/webhooks/mollie`,
      method: body.paymentMethod as any,
      metadata: { orderId: order.id, orderNumber },
    });

    await supabase.from('orders').update({ mollie_payment_id: payment.id }).eq('id', order.id);
    return NextResponse.json({ checkoutUrl: payment.getCheckoutUrl() });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Onbekende fout' }, { status: 400 });
  }
}
