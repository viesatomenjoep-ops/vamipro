import { createServiceClient } from '@/lib/supabase/server';
import { isMock, getMockOrders, MOCK_PRODUCTS } from '@/lib/mock-data';

const euro = (c: number) => `\u20ac ${(c / 100).toFixed(2).replace('.', ',')}`;
const statusColor: Record<string, string> = {
  paid: 'text-accent', shipped: 'text-blue-300', delivered: 'text-green-400',
  pending: 'text-fg-faint', cancelled: 'text-red-400', processing: 'text-yellow-300',
};

export default async function AdminDashboard() {
  const supabase = createServiceClient();
  
  const { data: orders } = isMock 
    ? getMockOrders() 
    : await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10);
    
  const { data: lowStock } = isMock
    ? { data: MOCK_PRODUCTS.filter(p => p.stock <= 5 && p.is_active).map(p => ({ name: p.name, stock: p.stock })) }
    : await supabase.from('products').select('name, stock').lte('stock', 5).eq('is_active', true);
    
  const revenue = (orders ?? []).filter((o: any) => !['pending', 'cancelled'].includes(o.status)).reduce((s: any, o: any) => s + o.total_cents, 0);

  return (
    <div className="space-y-10">
      <div>
        <p className="eyebrow">Overzicht</p>
        <h1 className="h-section mt-2">Dashboard</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[['Omzet (recent)', euro(revenue)], ['Te verwerken', String((orders ?? []).filter((o: any) => o.status === 'paid').length)], ['Lage voorraad', String(lowStock?.length ?? 0)]].map(([l, v]) => (
          <div key={l} className="card p-5">
            <p className="text-sm text-fg-muted">{l}</p>
            <p className="mt-1 font-display text-2xl font-semibold">{v}</p>
          </div>
        ))}
      </div>
      <section className="card overflow-hidden">
        <div className="border-b hairline p-5"><h2 className="font-display font-semibold">Laatste bestellingen</h2></div>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-fg-faint"><th className="p-4 font-normal">Order</th><th className="font-normal">Status</th><th className="font-normal">Totaal</th><th className="font-normal">Datum</th></tr></thead>
          <tbody>
            {orders?.map((o: any) => (
              <tr key={o.id} className="border-t hairline">
                <td className="p-4 font-display">{o.order_number}</td>
                <td className={statusColor[o.status] ?? 'text-fg-muted'}>{o.status}</td>
                <td>{euro(o.total_cents)}</td>
                <td className="text-fg-muted">{new Date(o.created_at).toLocaleDateString('nl-NL')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {lowStock && lowStock.length > 0 && (
        <section className="card p-5">
          <h2 className="font-display font-semibold text-red-400">Lage voorraad</h2>
          <ul className="mt-3 grid gap-1 text-sm text-fg-muted sm:grid-cols-2">
            {lowStock.map((p: any) => <li key={p.name}>{p.name} — nog {p.stock}</li>)}
          </ul>
        </section>
      )}
    </div>
  );
}
