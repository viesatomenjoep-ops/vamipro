import { createServiceClient } from '@/lib/supabase/server';
import ReviewForm from '@/components/admin/ReviewForm';
import { notFound } from 'next/navigation';

export default async function EditReview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();

  const { data: review } = await supabase.from('reviews').select('*').eq('id', id).single();
  if (!review) return notFound();

  return (
    <div className="space-y-6">
      <div><p className="eyebrow">Beheer</p><h1 className="h-section mt-2">Review bewerken</h1></div>
      <ReviewForm review={review} />
    </div>
  );
}
