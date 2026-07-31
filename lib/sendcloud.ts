import { createServiceClient } from '@/lib/supabase/server';

const AUTH = 'Basic ' + Buffer.from(
  `${process.env.SENDCLOUD_PUBLIC_KEY}:${process.env.SENDCLOUD_SECRET_KEY}`
).toString('base64');
const BASE2 = 'https://panel.sendcloud.sc/api/v2';
const BASE3 = 'https://panel.sendcloud.sc/api/v3';
const HEADERS = { Authorization: AUTH, 'Content-Type': 'application/json' };

export async function getShippingMethods(country: 'NL' | 'BE') {
  const res = await fetch(`${BASE2}/shipping_methods?to_country=${country}`, {
    headers: { Authorization: AUTH },
  });
  const { shipping_methods } = await res.json();
  return shipping_methods;
}

// Het (eerste) afzenderadres dat in het Sendcloud-account is ingesteld.
async function getSenderAddressId(): Promise<number | null> {
  try {
    const res = await fetch(`${BASE2}/user/addresses/sender`, { headers: { Authorization: AUTH } });
    const { sender_addresses } = await res.json();
    return sender_addresses?.[0]?.id ?? null;
  } catch {
    return null;
  }
}

// Kiest een bezorgoptie: bij voorkeur thuisbezorging, geen servicepunt/brievenbus.
function pickOption(options: any[]): any | null {
  if (!options?.length) return null;
  return (
    options.find((o) => /home|standard/i.test(o.code) && !/servicepoint|mailbox|brievenbus/i.test(o.code)) ||
    options.find((o) => !/servicepoint/i.test(o.code)) ||
    options[0]
  );
}

// Meldt de bestelling automatisch aan in Sendcloud via API v3 (v2 is uitgeschakeld
// voor parcels). De bestelling verschijnt in het Sendcloud-dashboard; het label
// print je daar. Retourneert een shape die de webhook al verwacht.
export async function createSendcloudLabel(order: any, items: any[]) {
  const senderId = await getSenderAddressId();
  if (!senderId) throw new Error('Geen Sendcloud-afzenderadres gevonden');

  // Nauwkeurig pakketgewicht: haal het echte gewicht (weight_grams) per product op.
  const productIds = (items ?? []).map((it: any) => it.product_id).filter(Boolean);
  const weights: Record<string, number> = {};
  if (productIds.length) {
    try {
      const supabase = createServiceClient();
      const { data } = await supabase.from('products').select('id, weight_grams').in('id', productIds);
      (data ?? []).forEach((p: any) => { if (p.weight_grams != null) weights[p.id] = Number(p.weight_grams); });
    } catch { /* val terug op standaardgewicht */ }
  }
  const totalGrams = (items ?? []).reduce(
    (s: number, it: any) => s + (weights[it.product_id] ?? it.weight_grams ?? 500) * (it.quantity || 1),
    0,
  );
  const weightKg = Math.max(0.1, totalGrams / 1000).toFixed(3);
  const toCountry = order.ship_country === 'BE' ? 'BE' : 'NL';

  // Beschikbare bezorgopties ophalen en de beste kiezen.
  const optRes = await fetch(`${BASE3}/fetch-shipping-options`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ from_country_code: 'NL', to_country_code: toCountry, weight: { value: weightKg, unit: 'kg' } }),
  });
  const options = (await optRes.json())?.data ?? [];
  const opt = pickOption(options);
  if (!opt) throw new Error(`Geen Sendcloud-verzendoptie voor ${toCountry} (${weightKg} kg)`);

  // Shipment aanmaken (aanmelden).
  const res = await fetch(`${BASE3}/shipments`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({
      to_address: {
        name: `${order.ship_first_name} ${order.ship_last_name}`.trim(),
        address_line_1: order.ship_address,
        house_number: order.ship_house_number,
        postal_code: order.ship_postal_code,
        city: order.ship_city,
        country_code: toCountry,
        email: order.ship_email,
        phone_number: order.ship_phone || '',
      },
      from_address: { sender_address_id: senderId },
      ship_with: { type: 'shipping_option_code', properties: { shipping_option_code: opt.code } },
      // order_number hoort op shipment-niveau (zo verschijnt het bij de parcel in Sendcloud).
      order_number: order.order_number,
      parcels: [{
        weight: { value: weightKg, unit: 'kg' },
        order_number: order.order_number,
        // Productregels — zodat Sendcloud een pakbon met de producten kan printen.
        parcel_items: (items ?? []).map((it: any) => ({
          description: it.product_name,
          quantity: it.quantity || 1,
          sku: it.sku || undefined,
          weight: { value: (((weights[it.product_id] ?? it.weight_grams ?? 500)) / 1000).toFixed(3), unit: 'kg' },
        })),
      }],
    }),
  });
  const body = await res.json();
  const data = body?.data;
  if (!res.ok || !data?.id) {
    throw new Error('Sendcloud v3 shipment mislukt: ' + JSON.stringify(body?.errors ?? body).slice(0, 300));
  }

  const parcel = Array.isArray(data.parcels) ? data.parcels[0] : null;
  const labelDoc = (parcel?.documents ?? []).find((d: any) => d.type === 'label' || d.document_type === 'label');
  return {
    parcelId: String(parcel?.id ?? data.id), // numerieke parcel-id (zoals in het Sendcloud-dashboard)
    trackingNumber: parcel?.tracking_number ?? data.tracking_number ?? null,
    trackingUrl: parcel?.tracking_url ?? data.tracking_url ?? null,
    labelUrl: labelDoc?.link ?? null,
  };
}
