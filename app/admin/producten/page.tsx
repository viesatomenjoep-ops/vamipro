import { createServiceClient } from '@/lib/supabase/server';
import { isMock, MOCK_PRODUCTS } from '@/lib/mock-data';
import Link from 'next/link';

const euro = (c: number) => `\u20ac ${(c / 100).toFixed(2).replace('.', ',')}`;

export default async function AdminProducts({ searchParams }: { searchParams: Promise<{ sort?: string, q?: string }> }) {
  const { sort, q } = await searchParams;
  const supabase = createServiceClient();
  
  let query = supabase.from('products').select('*');
  if (q) {
    query = query.ilike('name', `%${q}%`);
  }
  if (sort === 'date') {
    query = query.order('created_at', { ascending: false });
  } else {
    query = query.order('name', { ascending: true });
  }

  const { data: products } = isMock 
    ? { data: MOCK_PRODUCTS }
    : await query;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><p className="eyebrow">Beheer</p><h1 className="h-section mt-2">Producten</h1></div>
        <Link href="/admin/producten/nieuw" className="btn btn-primary text-sm">Nieuw product</Link>
      </div>

      <div className="card space-y-4">
        <form method="GET" className="flex flex-col sm:flex-row gap-3">
          <input type="text" name="q" defaultValue={q} placeholder="Zoek op artikel..." className="input flex-1 text-black bg-white px-3 py-2 rounded-md" />
          <select name="sort" defaultValue={sort} className="input text-black bg-white px-3 py-2 rounded-md">
            <option value="name">Alfabetisch (A-Z)</option>
            <option value="date">Datum aangemaakt (Nieuw-Oud)</option>
          </select>
          <button type="submit" className="btn btn-primary text-sm px-6">Filter</button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead><tr className="text-left text-fg-faint"><th className="p-4 font-normal">Naam</th><th className="font-normal">SKU</th><th className="font-normal">Prijs</th><th className="font-normal">Voorraad</th><th className="font-normal">Aangemaakt op</th><th></th></tr></thead>
            <tbody>
              {products?.map((p: any) => (
                <tr key={p.id} className="border-t hairline">
                  <td className="p-4">{p.name}</td>
                  <td className="text-fg-muted">{p.sku}</td>
                  <td>{euro(p.price_cents)}</td>
                  <td className={p.stock <= 5 ? 'text-red-400' : 'text-fg-muted'}>{p.stock}</td>
                  <td className="text-fg-muted">{p.created_at ? new Date(p.created_at).toLocaleDateString('nl-NL') : '-'}</td>
                  <td><Link href={`/admin/producten/${p.id}`} className="text-accent hover:underline">Bewerk</Link></td>
                </tr>
              ))}
              {!products?.length && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-fg-muted">Geen producten gevonden.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
