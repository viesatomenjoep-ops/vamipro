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

// Haalt echte Google-reviews op via de Google Places API.
// Nodig: env-variabele GOOGLE_PLACES_API_KEY (Vercel) + Place-ID (Instellingen →
// google_place_id). Zonder die twee, of bij een fout, geeft dit null terug en
// valt de site netjes terug op de zelf-beheerde reviews.
export async function getGoogleReviews(): Promise<GoogleReviewsData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  let placeId = '';
  try {
    const t = await getContent();
    placeId = (t('google_place_id', '') || '').trim();
  } catch {
    return null;
  }
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
