import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Zoekt een adres op voor NL én BE:
//  - NL: PDOK-locatieserver (gratis, geen key) → straat + plaats op postcode + huisnummer.
//  - BE: OpenStreetMap/Nominatim (gratis) → plaats (gemeente) op postcode, met straat als extra.
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const country = (params.get('country') || '').toUpperCase();
  const pc = (params.get('pc') || '').replace(/\s/g, '').toUpperCase();
  const hn = (params.get('hn') || '').trim();
  const street = (params.get('street') || '').trim();

  const isNL = country === 'NL' || /^\d{4}[A-Z]{2}$/.test(pc);
  const isBE = !isNL && (country === 'BE' || /^\d{4}$/.test(pc));

  // ── Nederland (PDOK) ──────────────────────────────────────────────────────
  if (isNL) {
    if (!/^\d{4}[A-Z]{2}$/.test(pc) || !hn) return NextResponse.json({ found: false });
    try {
      const q = encodeURIComponent(`postcode:${pc} and huisnummer:${hn}`);
      const url = `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?fq=type:adres&rows=1&q=${q}`;
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      const data = await res.json();
      const doc = data?.response?.docs?.[0];
      if (!doc) return NextResponse.json({ found: false });
      return NextResponse.json({ found: true, country: 'NL', street: doc.straatnaam ?? '', city: doc.woonplaatsnaam ?? '' });
    } catch {
      return NextResponse.json({ found: false });
    }
  }

  // ── België (Nominatim / OpenStreetMap) ────────────────────────────────────
  if (isBE) {
    if (!/^\d{4}$/.test(pc)) return NextResponse.json({ found: false });
    try {
      const qp = new URLSearchParams({ format: 'json', addressdetails: '1', countrycodes: 'be', postalcode: pc, limit: '1' });
      // Als straat (+ huisnummer) bekend is, verfijnen we de zoekopdracht.
      if (street) qp.set('street', hn ? `${hn} ${street}` : street);
      const url = `https://nominatim.openstreetmap.org/search?${qp.toString()}`;
      const res = await fetch(url, { headers: { 'User-Agent': 'VamiPro-Webshop/1.0 (info@vamipro.nl)', Accept: 'application/json' } });
      const data = await res.json();
      const a = data?.[0]?.address;
      if (!a) return NextResponse.json({ found: false });
      const city = a.city || a.town || a.village || a.municipality || a.suburb || '';
      if (!city) return NextResponse.json({ found: false });
      return NextResponse.json({ found: true, country: 'BE', street: a.road ?? street ?? '', city });
    } catch {
      return NextResponse.json({ found: false });
    }
  }

  return NextResponse.json({ found: false });
}
