import { getContent } from './content';

export type GoogleReview = {
  author: string;
  rating: number;
  text: string;
  time: string; // "3 weken geleden"
};

export type GoogleReviewsData = {
  rating: number;   // gemiddelde score (bv. 4.9)
  total: number;    // totaal aantal reviews
  reviews: GoogleReview[];
};

// Zoekt automatisch het Google Place-ID op aan de hand van bedrijfsnaam + adres,
// zodat de winkelier alleen de API-sleutel hoeft in te stellen (geen Place-ID zoeken).
async function findPlaceId(apiKey: string): Promise<string> {
  try {
    const query = 'Vami Pro, Kroonstraat 33, 4879 AV Etten-Leur, Nederland';
    const url =
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}` +
      `&inputtype=textquery&fields=place_id&language=nl&key=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 86400 } }); // 1x per dag
    const data = await res.json();
    return data?.candidates?.[0]?.place_id ?? '';
  } catch {
    return '';
  }
}

// Haalt echte Google-reviews op via de Google Places API.
// Nodig: env-variabele GOOGLE_PLACES_API_KEY (Vercel). Het Place-ID vult 'ie zelf
// (of gebruik een handmatig ingesteld Place-ID via Instellingen → google_place_id).
// Zonder sleutel, of bij een fout/geen vermelding, geeft dit null terug en valt de
// site netjes terug op de zelf-beheerde reviews.
export async function getGoogleReviews(): Promise<GoogleReviewsData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  let placeId = '';
  try {
    const t = await getContent();
    placeId = (t('google_place_id', '') || '').trim();
  } catch {
    /* geen content → probeer alsnog automatisch te zoeken */
  }
  // Geen handmatig Place-ID ingesteld → automatisch opzoeken.
  if (!placeId) placeId = await findPlaceId(apiKey);
  if (!placeId) return null;

  try {
    const url =
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}` +
      `&fields=reviews,rating,user_ratings_total&reviews_sort=newest&language=nl&key=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 3600 } }); // elk uur verversen
    const data = await res.json();
    const r = data?.result;
    if (!r) return null;

    const reviews: GoogleReview[] = (r.reviews ?? [])
      .filter((x: any) => x && x.text && x.rating)
      .map((x: any) => ({
        author: x.author_name ?? 'Google-gebruiker',
        rating: Math.round(x.rating),
        text: String(x.text).trim(),
        time: x.relative_time_description ?? '',
      }));

    return {
      rating: Number(r.rating ?? 0),
      total: Number(r.user_ratings_total ?? reviews.length),
      reviews,
    };
  } catch {
    return null;
  }
}
