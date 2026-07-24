import { createServiceClient } from '@/lib/supabase/server';
import Link from 'next/link';
import DeleteButton from '@/components/admin/DeleteButton';
import { deleteReview } from '@/app/admin/actions';

function Stars({ rating }: { rating: number }) {
  const r = Math.min(5, Math.max(0, rating || 0));
  return <span className="text-accent">{'★'.repeat(r)}<span className="text-fg-faint">{'★'.repeat(5 - r)}</span></span>;
}

export default async function AdminReviews() {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from('reviews').select('*').order('sort_order');
  const reviews = error ? [] : (data || []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><p className="eyebrow">Beheer</p><h1 className="h-section mt-2">Reviews</h1></div>
        <Link href="/admin/reviews/nieuw" className="btn btn-primary text-sm">Nieuwe review</Link>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[500px]">
          <thead>
            <tr className="text-left text-fg-faint border-b hairline">
              <th className="p-4 font-normal">Auteur</th>
              <th className="font-normal">Beoordeling</th>
              <th className="font-normal">Bron</th>
              <th className="font-normal">Actief</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r: any) => (
              <tr key={r.id} className="border-b hairline">
                <td className="p-4 font-medium">{r.author}</td>
                <td><Stars rating={r.rating} /></td>
                <td className="text-fg-muted">{r.source}</td>
                <td className="text-fg-muted">{r.is_active ? 'Ja' : 'Nee'}</td>
                <td>
                  <div className="flex items-center gap-4 pr-4">
                    <Link href={`/admin/reviews/${r.id}`} className="text-accent hover:underline">Bewerk</Link>
                    <DeleteButton action={deleteReview.bind(null, r.id)} confirmText={`Weet je zeker dat je de review van "${r.author}" wilt verwijderen?`} />
                  </div>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-fg-muted">Nog geen reviews.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
