import { createServiceClient } from '@/lib/supabase/server';
import ShopSettingsForm from '@/components/admin/ShopSettingsForm';

export default async function SettingsPage() {
  const supabase = createServiceClient();
  const { data } = await supabase.from('site_content').select('key, value');
  const content: Record<string, string> = {};
  (data ?? []).forEach((r: any) => { content[r.key] = r.value; });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">Instellingen</h1>
      <p className="text-fg-muted mb-6 text-sm">Beheer verzendkosten, kortingscode en de hero-afbeelding. Wijzigingen zijn direct zichtbaar.</p>
      <ShopSettingsForm content={content} />
    </div>
  );
}
