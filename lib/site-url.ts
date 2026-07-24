// Canonieke basis-URL van de publieke website.
// Gebruikt NEXT_PUBLIC_SITE_URL, maar negeert een localhost-waarde (die stond per
// ongeluk in Vercel) zodat sitemap, robots, canonical, Open Graph en structured
// data in productie ALTIJD naar het echte domein wijzen.
const raw = (process.env.NEXT_PUBLIC_SITE_URL || '').trim();
const isLocal = raw.includes('localhost') || raw.includes('127.0.0.1');

export const SITE_URL = (raw && !isLocal ? raw : 'https://www.vamipro.nl').replace(/\/+$/, '');
