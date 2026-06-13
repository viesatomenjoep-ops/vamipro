import { createServiceClient } from '@/lib/supabase/server';
import SettingsForm from '@/components/admin/SettingsForm';

export default async function SettingsPage() {
  const supabase = createServiceClient();
  const { data: settings } = await supabase.from('store_settings').select('*').eq('id', 1).single();

  return (
    <div className="space-y-6">
      <div><p className="eyebrow">Beheer</p><h1 className="h-section mt-2">Design & Instellingen</h1></div>
      <p className="text-sm text-fg-muted max-w-2xl">
        Pas hier de kleuren van de website aan, upload een nieuw logo, en verander de grote video/foto op de voorpagina.
        Wijzigingen zijn direct live voor alle bezoekers.
      </p>
      
      <SettingsForm settings={settings || {}} />
    </div>
  );
}
