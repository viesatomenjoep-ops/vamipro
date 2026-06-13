export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="max-w-xl space-y-4">
      <div><p className="eyebrow">Beheer</p><h1 className="h-section mt-2">Product bewerken</h1></div>
      <p className="text-sm text-fg-muted">Bouw hier het bewerkformulier (naam, prijs, voorraad, categorie, beschrijving + Cloudinary-upload). Product-id: {id}</p>
    </div>
  );
}
