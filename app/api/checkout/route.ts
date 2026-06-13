import { NextRequest, NextResponse } from 'next/server';
import { mollie } from '@/lib/mollie';
import { createServiceClient } from '@/lib/supabase/server';
import { z } from 'zod';

const schema = z.object({
  items: z.array(z.object({ productId: z.string(), quantity: z.number().int().positive() })),
  shipping: z.object({
    firstName: z.string().min(1), lastName: z.string().min(1),
    address: z.string().min(1), houseNumber: z.string().min(1), addition: z.string().optional(),
    postalCode: z.string().min(1), city: z.string().min(1), country: z.enum(['NL', 'BE']),
    email: z.string().email(), phone: z.string().min(1),
  }),
  billing: z.object({ company: z.string().optional(), vatNumber: z.string().optional() }).optional(),
  shippingMethodId: z.string(),
  paymentMethod: z.enum(['ideal', 'bancontact']),
  discountCode: z.string().optional(),
});

// Simpele verzendkosten-logica (pas aan / koppel aan Sendcloud-tarieven)
function shippingCost(subtotalCents: number, country: 'NL' | 'BE') {
  if (subtotalCents >= 7500) return 0;       // gratis vanaf 75 euro
  return country === 'NL' ? 495 : 695;
}

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const supabase = createServiceClient();

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

    const shippingCents = shippingCost(subtotal, body.shipping.country);
    
    let discountCents = 0;
    if (body.discountCode === 'VAMIPRO10' || body.discountCode === 'START10') {
      discountCents = Math.round(subtotal * 0.10);
    }
    
    const total = subtotal - discountCents + shippingCents;

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

    await supabase.from('order_items').insert(items.map((it) => ({
      order_id: order.id, product_id: it.product.id, product_name: it.product.name,
      sku: it.product.sku, unit_price_cents: it.product.price_cents,
      vat_rate: it.product.vat_rate, quantity: it.quantity, line_total_cents: it.line,
    })));

    const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.vamipro.nl';
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
