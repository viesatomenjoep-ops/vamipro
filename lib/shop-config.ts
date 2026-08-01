import { getContent } from '@/lib/content';

export type ShopConfig = {
  shippingCents: number;    // Nederland
  shippingCentsBe: number;  // België
  freeShipCents: number;
  discountCode: string;
  discountPercent: number;
  discountMaxUses: number;  // "eerste X klanten" — 0 = onbeperkt
  promoActive: boolean;     // kortingsactie + actiebalk aan/uit
  chatbotEnabled: boolean;  // chatbot-widget tonen
  heroImage: string;
  oneCentCode: string;      // testcode: totaal €0,01 + gratis verzending (leeg = uit)
};

// Standaardwaarden. De actieve lancering: eerste 100 klanten 50% met code VAMIPRO50.
// Zodra de winkelier iets in de admin instelt, overrulet dat deze waarden.
const DEFAULTS: ShopConfig = {
  shippingCents: 795,
  shippingCentsBe: 1195,
  freeShipCents: 0,   // 0 = geen gratis verzending (altijd verzendkosten)
  discountCode: 'VAMIPRO50',
  discountPercent: 50,
  discountMaxUses: 100,
  promoActive: true,
  chatbotEnabled: true,
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

// Aantal keer dat een code gebruikt mag worden (bv. "eerste 100 klanten").
// Leeg of 0 = onbeperkt.
function parseMaxUses(raw: string | undefined, fallback: number): number {
  if (raw === undefined || !raw.trim()) return fallback;
  const value = parseInt(raw.trim().replace(/[^0-9]/g, ''), 10);
  if (!Number.isFinite(value) || value < 0) return fallback;
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
    discountMaxUses: parseMaxUses(t('discount_max_uses', ''), DEFAULTS.discountMaxUses),
    // Schuifjes: '0' = uit, al het andere (incl. leeg) = aan.
    promoActive: t('promo_active', '1') !== '0',
    chatbotEnabled: t('chatbot_enabled', '1') !== '0',
    heroImage: t('hero_image', ''),
    oneCentCode: (t('one_cent_code', '').trim() || '').toUpperCase(),
  };
}
