import { createServiceClient } from '@/lib/supabase/server';
import { SITE_URL } from '@/lib/site-url';

export const runtime = 'nodejs';
// Elk uur opnieuw genereren; Merchant Center haalt de feed doorgaans dagelijks op.
export const revalidate = 3600;

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dxcohla4k';

// Volledige Cloudinary-afbeeldings-URL (ongecropt, webgeoptimaliseerd).
function img(id: string): string {
  if (!id) return '';
  if (id.startsWith('http')) return id;
  return `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,w_1200/${id}`;
}

// Tekst opschonen: markdown/emoji/witruimte weg, inkorten. XML-escaping gebeurt apart.
function clean(s: string | null | undefined, max: number): string {
  if (!s) return '';
  let t = String(s)
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/[*_#>`~]/g, ' ')
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}️]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (t.length > max) t = t.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
  return t;
}

function xml(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const supabase = createServiceClient();
  const { data: products } = await supabase
    .from('products')
    .select('slug, name, short_description, description, price_cents, stock, sku, brand, cloudinary_images')
    .eq('is_active', true)
    .order('name');

  const items = (products ?? []).map((p: any) => {
    const imgs: string[] = Array.isArray(p.cloudinary_images) ? p.cloudinary_images : [];
    const desc = clean(p.description || p.short_description, 500) || clean(p.name, 500);
    const id = p.sku || p.slug;
    const extra = imgs.slice(1, 11)
      .map((x) => `\n      <g:additional_image_link>${xml(img(x))}</g:additional_image_link>`)
      .join('');
    return `    <item>
      <g:id>${xml(id)}</g:id>
      <title>${xml(clean(p.name, 150))}</title>
      <link>${SITE_URL}/producten/${xml(p.slug)}</link>
      <description>${xml(desc)}</description>
      <g:image_link>${xml(img(imgs[0]))}</g:image_link>${extra}
      <g:availability>${p.stock > 0 ? 'in_stock' : 'out_of_stock'}</g:availability>
      <g:price>${(p.price_cents / 100).toFixed(2)} EUR</g:price>
      <g:condition>new</g:condition>
      <g:brand>${xml(p.brand || 'Vami Pro')}</g:brand>
      <g:mpn>${xml(p.sku || id)}</g:mpn>
      <g:identifier_exists>no</g:identifier_exists>
    </item>`;
  }).join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Vami Pro — Productfeed</title>
    <link>${SITE_URL}</link>
    <description>Professionele car-detailingproducten van Vami Pro.</description>
${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
