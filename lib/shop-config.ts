import { getContent } from '@/lib/content';

export type ShopConfig = {
  shippingCents: number;    // Nederland
  shippingCentsBe: number;  // België
  freeShipCents: number;
  discountCode: string;
  discountPercent: number;
  heroImage: string;
  oneCentCode: string;      // testcode: totaal €0,01 + gratis verzending (leeg = uit)
};

// Standaardwaarden = de huidige hardgecodeerde waarden. Zo verandert er niets
// aan het gedrag zolang de winkelier niets instelt.
const DEFAULTS: ShopConfig = {
  shippingCents: 795,
  shippingCentsBe: 1195,
  freeShipCents: 7000,
  discountCode: 'VAMIPRO10',
  discountPercent: 10,
  heroImage: '',
  oneCentCode: '',
};

// Parse een euro-bedrag ("6,95" of "6.95" -> 695 cent; "70" -> 7000 cent).
function eurosToCents(raw: string | undefined, fallback: number): number {
  if (!raw || !raw.trim()) return fallback;
  const normalized = raw.trim().replace(',', '.').replace(/[^0-9.]/g, '');
  const value = parseFloat(normalized);
  if (!isFinite(value) || value < 0) return fallback;
  return Math.round(value * 100);
}

function parsePercent(raw: string | undefined, fallback: number): number {
  if (!raw || !raw.trim()) return fallback;
  const value = parseFloat(raw.trim().replace(',', '.').replace(/[^0-9.]/g, ''));
  if (!isFinite(value) || value < 0) return fallback;
  return value;
}

export async function getShopConfig(): Promise<ShopConfig> {
  const t = await getContent();

  const discountCodeRaw = t('discount_code', DEFAULTS.discountCode).trim();

  return {
    shippingCents: eurosToCents(t('shipping_cost_eur', ''), DEFAULTS.shippingCents),
    shippingCentsBe: eurosToCents(t('shipping_cost_be_eur', ''), DEFAULTS.shippingCentsBe),
    freeShipCents: eurosToCents(t('free_shipping_eur', ''), DEFAULTS.freeShipCents),
    discountCode: (discountCodeRaw || DEFAULTS.discountCode).toUpperCase(),
    discountPercent: parsePercent(t('discount_percent', ''), DEFAULTS.discountPercent),
    heroImage: t('hero_image', ''),
    oneCentCode: (t('one_cent_code', '').trim() || '').toUpperCase(),
  };
}
