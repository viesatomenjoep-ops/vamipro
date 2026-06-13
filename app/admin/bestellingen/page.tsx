import { createServiceClient } from '@/lib/supabase/server';
import { isMock, getMockOrders } from '@/lib/mock-data';
import Link from 'next/link';

const euro = (c: number) => `\u20ac ${(c / 100).toFixed(2).replace('.', ',')}`;

export default async function OrdersPage() {
  const supabase = createServiceClient();
  const { data: orders } = isMock
    ? getMockOrders(100)
    : await supabase.from('orders').select('*').order('created_at', { ascending: false });
  return (
    <div className="space-y-6">
      <div><p className="eyebrow">Beheer</p><h1 className="h-section mt-2">Bestellingen</h1></div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-fg-faint">
            <th className="p-4 font-normal">Order</th><th className="font-normal">Klant</th><th className="font-normal">Status</th><th className="font-normal">Totaal</th><th className="font-normal">Factuur</th><th className="font-normal">Label</th>
          </tr></thead>
          <tbody>
            {orders?.map((o: any) => (
              <tr key={o.id} className="border-t hairline">
                <td className="p-4"><Link href={`/admin/bestellingen/${o.id}`} className="font-display text-accent hover:underline">{o.order_number}</Link></td>
                <td>{o.ship_first_name} {o.ship_last_name}</td>
                <td className="text-fg-muted">{o.status}</td>
                <td>{euro(o.total_cents)}</td>
                <td>{o.invoice_pdf_url ? <a href={o.invoice_pdf_url} target="_blank" className="text-accent hover:underline">PDF</a> : <span className="text-fg-faint">—</span>}</td>
                <td>{o.label_pdf_url ? <a href={o.label_pdf_url} target="_blank" className="text-accent hover:underline">Print</a> : <span className="text-fg-faint">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
