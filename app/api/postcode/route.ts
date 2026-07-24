import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Zoekt een Nederlands adres (straat + plaats) op via de gratis PDOK-locatieserver
// van de overheid, op basis van postcode + huisnummer. Geen API-key nodig.
export async function GET(req: NextRequest) {
  const pc = (req.nextUrl.searchParams.get('pc') || '').replace(/\s/g, '').toUpperCase();
  const hn = (req.nextUrl.searchParams.get('hn') || '').trim();

  if (!/^\d{4}[A-Z]{2}$/.test(pc) || !hn) {
    return NextResponse.json({ found: false }, { status: 400 });
  }

  try {
    const q = encodeURIComponent(`postcode:${pc} and huisnummer:${hn}`);
    const url = `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?fq=type:adres&rows=1&q=${q}`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    const data = await res.json();
    const doc = data?.response?.docs?.[0];
    if (!doc) return NextResponse.json({ found: false });
    return NextResponse.json({ found: true, street: doc.straatnaam ?? '', city: doc.woonplaatsnaam ?? '' });
  } catch {
    return NextResponse.json({ found: false });
  }
}
