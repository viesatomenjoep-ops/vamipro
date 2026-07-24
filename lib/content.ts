import { createServiceClient } from '@/lib/supabase/server';

/**
 * Haalt alle bewerkbare website-teksten op en geeft een getter terug.
 * Gebruik: const t = await getContent(); ... {t('hero_eyebrow', 'Standaardtekst')}
 * Valt netjes terug op de meegegeven standaardtekst als er niets is ingesteld
 * (of als de tabel nog niet bestaat).
 */
export async function getContent() {
  const supabase = createServiceClient();
  const { data } = await supabase.from('site_content').select('key, value');
  const map = new Map<string, string>((data ?? []).map((r: any) => [r.key, r.value]));
  return (key: string, fallback = '') => {
    const v = map.get(key);
    return v && v.trim() ? v : fallback;
  };
}
