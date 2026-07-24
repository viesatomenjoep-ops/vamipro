import { createServiceClient } from '@/lib/supabase/server';

export type CustomSection = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  button_text: string;
  button_link: string;
  sort_order: number;
  is_active: boolean;
};

// Eigen (custom) secties die de winkelier zelf toevoegt: titel + tekst + knop.
// Blijft leeg (geen crash) zolang de tabel `custom_sections` nog niet bestaat.
export async function getCustomSections(activeOnly = true): Promise<CustomSection[]> {
  try {
    const supabase = createServiceClient();
    let q = supabase
      .from('custom_sections')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    if (activeOnly) q = q.eq('is_active', true);
    const { data, error } = await q;
    if (error || !data) return [];
    return data as CustomSection[];
  } catch {
    return [];
  }
}
