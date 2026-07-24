import ReviewForm from '@/components/admin/ReviewForm';

export default function NewReview() {
  return (
    <div className="space-y-6">
      <div><p className="eyebrow">Beheer</p><h1 className="h-section mt-2">Nieuwe review toevoegen</h1></div>
      <ReviewForm />
    </div>
  );
}
