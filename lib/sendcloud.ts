import { createServiceClient } from '@/lib/supabase/server';

const AUTH = 'Basic ' + Buffer.from(
  `${process.env.SENDCLOUD_PUBLIC_KEY}:${process.env.SENDCLOUD_SECRET_KEY}`
).toString('base64');
const BASE = 'https://panel.sendcloud.sc/api/v2';

export async function getShippingMethods(country: 'NL' | 'BE') {
  const res = await fetch(`${BASE}/shipping_methods?to_country=${country}`, {
    headers: { Authorization: AUTH },
  });
  const { shipping_methods } = await res.json();
  return shipping_methods;
}

async function uploadLabel(orderNumber: string, buffer: Buffer) {
  const supabase = createServiceClient();
  const path = `${orderNumber}.pdf`;
  await supabase.storage.from('labels').upload(path, buffer, {
    contentType: 'application/pdf', upsert: true,
  });
  const { data } = await supabase.storage.from('labels').createSignedUrl(path, 60 * 60 * 24 * 365);
  return data?.signedUrl ?? path;
}

export async function createSendcloudLabel(order: any, items: any[]) {
  const totalWeight = items.reduce((s, it) => s + (it.weight_grams ?? 500) * it.quantity, 0);
  const res = await fetch(`${BASE}/parcels`, {
    method: 'POST',
    headers: { Authorization: AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      parcel: {
        name: `${order.ship_first_name} ${order.ship_last_name}`,
        address: order.ship_address, house_number: order.ship_house_number,
        city: order.ship_city, postal_code: order.ship_postal_code,
        country: order.ship_country, email: order.ship_email,
        telephone: order.ship_phone, weight: (totalWeight / 1000).toFixed(3),
        order_number: order.order_number, request_label: true,
      },
    }),
  });
  const { parcel } = await res.json();
  const labelRes = await fetch(parcel.label.label_printer, { headers: { Authorization: AUTH } });
  const labelBuffer = Buffer.from(await labelRes.arrayBuffer());
  const labelUrl = await uploadLabel(order.order_number, labelBuffer);
  return {
    parcelId: String(parcel.id), trackingNumber: parcel.tracking_number,
    trackingUrl: parcel.tracking_url, labelUrl,
  };
}
