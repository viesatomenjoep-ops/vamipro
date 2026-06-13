import { NextRequest, NextResponse } from 'next/server';
import { mollie } from '@/lib/mollie';
import { createServiceClient } from '@/lib/supabase/server';
import { generateInvoice } from '@/lib/invoice';
import { createSendcloudLabel } from '@/lib/sendcloud';
import { sendOrderConfirmation } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const paymentId = form.get('id') as string;
    if (!paymentId) return NextResponse.json({ ok: true });

    const payment = await mollie.payments.get(paymentId);
    const supabase = createServiceClient();
    const orderId = (payment.metadata as any)?.orderId as string;
    const { data: order } = await supabase.from('orders').select('*').eq('id', orderId).single();
    if (!order) return NextResponse.json({ ok: true });

    if (payment.status === 'paid' && order.status === 'pending') {
      const { data: items } = await supabase.from('order_items').select('*').eq('order_id', orderId);

      for (const it of items ?? []) {
        await supabase.rpc('decrement_stock', { p_id: it.product_id, qty: it.quantity });
      }

      const { data: invNum } = await supabase.rpc('next_counter', { counter_key: 'invoice' });
      const invoiceNumber = `2026-${String(invNum).padStart(5, '0')}`;
      const invoiceUrl = await generateInvoice(order, items ?? [], invoiceNumber);

      let label: any = {};
      try { label = await createSendcloudLabel(order, items ?? []); } catch (e) { console.error('Sendcloud', e); }

      await supabase.from('orders').update({
        status: 'paid', paid_at: new Date().toISOString(),
        invoice_number: invoiceNumber, invoice_pdf_url: invoiceUrl,
        sendcloud_parcel_id: label.parcelId, tracking_number: label.trackingNumber,
        tracking_url: label.trackingUrl, label_pdf_url: label.labelUrl,
      }).eq('id', orderId);

      try { await sendOrderConfirmation(order, invoiceUrl); } catch (e) { console.error('Email', e); }
    }

    if (['expired', 'canceled', 'failed'].includes(payment.status)) {
      await supabase.from('orders').update({ status: 'cancelled' }).eq('id', orderId);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Webhook error', e);
    return NextResponse.json({ ok: true }); // altijd 200 naar Mollie
  }
}
