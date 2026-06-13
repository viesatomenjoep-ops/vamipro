export type CategoryMeta = {
  slug: string; name: string; tagline: string; step: string;
};
// Volgorde = het echte detailing-proces (zinvolle nummering, geen decoratie)
export const CATEGORIES: CategoryMeta[] = [
  { slug: 'wassen',    name: 'Wassen & Shampoo',      tagline: 'Veilig contactvrij voorbehandelen en wassen.', step: '01' },
  { slug: 'exterieur', name: 'Exterieur Reiniging',   tagline: 'Diepe reiniging: teer, vliegroest, insecten.',  step: '02' },
  { slug: 'interieur', name: 'Interieur',             tagline: 'Leer, kunststof en stof fris en verzorgd.',     step: '03' },
  { slug: 'coating',   name: 'Coating & Bescherming', tagline: 'Keramische coatings, sealants en wax.',         step: '04' },
  { slug: 'machines',  name: 'Machines & Gereedschap',tagline: 'Polijsten naar een holografievrije finish.',    step: '05' },
  { slug: 'doeken',    name: 'Doeken & Accessoires',  tagline: 'Microvezel, droogdoeken en applicators.',       step: '06' },
];
export const catBySlug = (s: string) => CATEGORIES.find((c) => c.slug === s);
