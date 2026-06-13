export type CategoryMeta = {
  slug: string; name: string; tagline: string; step: string;
};
// Volgorde = het echte detailing-proces (zinvolle nummering, geen decoratie)
export const CATEGORIES: CategoryMeta[] = [
  { slug: 'exterieur-wassen', name: 'Exterieur & Wassen', tagline: 'Hier plaats je alle vloeistoffen en chemie voor de auto.', step: '01' },
  { slug: 'accessoires-washulpmiddelen', name: 'Accessoires & Washulpmiddelen', tagline: 'Dit is de perfecte plek voor alle fysieke tools.', step: '02' },
];
export const catBySlug = (s: string) => CATEGORIES.find((c) => c.slug === s);
