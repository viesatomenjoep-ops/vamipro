import { createServiceClient } from '@/lib/supabase/server';
import { isMock, MOCK_PRODUCTS } from '@/lib/mock-data';
import Link from 'next/link';

const euro = (c: number) => `\u20ac ${(c / 100).toFixed(2).replace('.', ',')}`;

export default async function AdminProducts() {
  const supabase = createServiceClient();
  const { data: products } = isMock 
    ? { data: MOCK_PRODUCTS }
    : await supabase.from('products').select('*').order('name');
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><p className="eyebrow">Beheer</p><h1 className="h-section mt-2">Producten</h1></div>
        <Link href="/admin/producten/nieuw" className="btn btn-primary text-sm">Nieuw product</Link>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-fg-faint"><th className="p-4 font-normal">Naam</th><th className="font-normal">SKU</th><th className="font-normal">Prijs</th><th className="font-normal">Voorraad</th><th></th></tr></thead>
          <tbody>
            {products?.map((p: any) => (
              <tr key={p.id} className="border-t hairline">
                <td className="p-4">{p.name}</td>
                <td className="text-fg-muted">{p.sku}</td>
                <td>{euro(p.price_cents)}</td>
                <td className={p.stock <= 5 ? 'text-red-400' : 'text-fg-muted'}>{p.stock}</td>
                <td><Link href={`/admin/producten/${p.id}`} className="text-accent hover:underline">Bewerk</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
