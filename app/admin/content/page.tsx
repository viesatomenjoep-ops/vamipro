import { createServiceClient } from '@/lib/supabase/server';
import ContentForm from '@/components/admin/ContentForm';

export default async function ContentPage() {
  const supabase = createServiceClient();
  const { data } = await supabase.from('site_content').select('key, value');
  const content: Record<string, string> = {};
  (data ?? []).forEach((r: any) => { content[r.key] = r.value; });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">Website teksten</h1>
      <p className="text-fg-muted mb-6 text-sm">Pas de teksten op de website aan. Wijzigingen zijn direct zichtbaar.</p>
      <ContentForm content={content} />
    </div>
  );
}
