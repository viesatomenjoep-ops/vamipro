import { createServiceClient } from '@/lib/supabase/server';
import PreviewEditor from '@/components/admin/PreviewEditor';

export default async function PreviewPage() {
  const supabase = createServiceClient();
  const { data } = await supabase.from('site_content').select('key, value');
  const content: Record<string, string> = {};
  (data ?? []).forEach((r: any) => { content[r.key] = r.value; });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">Voorvertoning</h1>
      <p className="text-fg-muted mb-6 text-sm">Klik in de live voorvertoning op een tekst om die direct te bewerken. Wijzigingen zie je meteen; klik op Opslaan om ze op te slaan.</p>
      <PreviewEditor content={content} />
    </div>
  );
}
