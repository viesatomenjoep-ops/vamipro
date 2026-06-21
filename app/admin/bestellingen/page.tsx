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
        <table className="w-full text-sm whitespace-nowrap">
          <thead className="bg-panel-2/50">
            <tr className="text-left text-fg-faint text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Order</th>
              <th className="px-6 py-4 font-medium">Klant</th>
              <th className="px-6 py-4 font-medium text-center">Status</th>
              <th className="px-6 py-4 font-medium text-right">Totaal</th>
              <th className="px-6 py-4 font-medium text-center">Factuur</th>
              <th className="px-6 py-4 font-medium text-center">Label</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {orders?.map((o: any) => (
              <tr key={o.id} className="transition-colors hover:bg-panel-2/30">
                <td className="px-6 py-4">
                  <Link href={`/admin/bestellingen/${o.id}`} className="font-display font-semibold text-accent hover:underline">
                    {o.order_number}
                  </Link>
                </td>
                <td className="px-6 py-4 font-medium text-fg">
                  {o.ship_first_name} {o.ship_last_name}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center rounded-full bg-panel-2 border hairline px-2.5 py-1 text-xs font-medium text-fg-muted">
                    {o.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-display text-base font-semibold text-fg">
                  {euro(o.total_cents)}
                </td>
                <td className="px-6 py-4 text-center">
                  {o.invoice_pdf_url ? <a href={o.invoice_pdf_url} target="_blank" className="inline-flex items-center justify-center rounded bg-accent/10 px-2 py-1 text-xs font-medium text-accent hover:bg-accent/20">PDF</a> : <span className="text-fg-faint">—</span>}
                </td>
                <td className="px-6 py-4 text-center">
                  {o.label_pdf_url ? <a href={o.label_pdf_url} target="_blank" className="inline-flex items-center justify-center rounded bg-accent/10 px-2 py-1 text-xs font-medium text-accent hover:bg-accent/20">Print</a> : <span className="text-fg-faint">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
