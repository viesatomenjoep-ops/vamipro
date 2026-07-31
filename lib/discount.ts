import { createServiceClient } from '@/lib/supabase/server';

// Telt hoe vaak een kortingscode al is ingezet (voor de "eerste X klanten"-limiet).
// Alleen orders die niet geannuleerd zijn tellen mee. Retourneert 0 bij twijfel,
// zodat een tijdelijke DB-fout de actie niet per ongeluk blokkeert.
export async function getDiscountUsedCount(code: string): Promise<number> {
  const c = (code || '').trim().toUpperCase();
  if (!c) return 0;
  try {
    const supabase = createServiceClient();
    const { count, error } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('discount_code', c)
      .neq('status', 'cancelled');
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}

// Resterende plekken bij een gelimiteerde actie. null = onbeperkt (geen limiet).
export async function getDiscountRemaining(code: string, maxUses: number): Promise<number | null> {
  if (!maxUses || maxUses <= 0) return null;
  const used = await getDiscountUsedCount(code);
  return Math.max(0, maxUses - used);
}
