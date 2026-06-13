import { createServiceClient } from '@/lib/supabase/server';
import { isMock, getMockOrders } from '@/lib/mock-data';

const euro = (c: number) => `\u20ac ${(c / 100).toFixed(2).replace('.', ',')}`;

export default async function InvoicesPage() {
  const supabase = createServiceClient();
  const { data: orders } = isMock
    ? getMockOrders(100)
    : await supabase.from('orders').select('*').not('invoice_number', 'is', null).order('paid_at', { ascending: false });
  return (
    <div className="space-y-6">
      <div><p className="eyebrow">Administratie</p><h1 className="h-section mt-2">Facturen</h1></div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-fg-faint"><th className="p-4 font-normal">Factuur</th><th className="font-normal">Order</th><th className="font-normal">Bedrag</th><th className="font-normal">Datum</th><th></th></tr></thead>
          <tbody>
            {orders?.map((o) => (
              <tr key={o.id} className="border-t hairline">
                <td className="p-4 font-display">{o.invoice_number}</td>
                <td className="text-fg-muted">{o.order_number}</td>
                <td>{euro(o.total_cents)}</td>
                <td className="text-fg-muted">{o.paid_at ? new Date(o.paid_at).toLocaleDateString('nl-NL') : '—'}</td>
                <td>{o.invoice_pdf_url && <a href={o.invoice_pdf_url} target="_blank" className="text-accent hover:underline">Download</a>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
