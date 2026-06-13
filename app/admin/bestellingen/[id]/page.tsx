import { createServiceClient } from '@/lib/supabase/server';

const euro = (c: number) => `\u20ac ${(c / 100).toFixed(2).replace('.', ',')}`;

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();
  const { data: o } = await supabase.from('orders').select('*').eq('id', id).single();
  const { data: items } = await supabase.from('order_items').select('*').eq('order_id', id);
  if (!o) return <p className="text-fg-muted">Niet gevonden.</p>;

  return (
    <div className="max-w-2xl space-y-6">
      <div><p className="eyebrow">Order</p><h1 className="h-section mt-2">{o.order_number}</h1></div>
      <div className="card p-5 text-sm">
        <p><span className="text-fg-faint">Status:</span> {o.status}</p>
        <p><span className="text-fg-faint">Klant:</span> {o.ship_first_name} {o.ship_last_name} — {o.ship_email}</p>
        <p><span className="text-fg-faint">Adres:</span> {o.ship_address} {o.ship_house_number}, {o.ship_postal_code} {o.ship_city} ({o.ship_country})</p>
        {o.tracking_url && <p><span className="text-fg-faint">Tracking:</span> <a href={o.tracking_url} target="_blank" className="text-accent hover:underline">{o.tracking_number}</a></p>}
      </div>
      <div className="card p-5">
        {items?.map((it) => (
          <div key={it.id} className="flex justify-between border-b hairline py-2 text-sm last:border-0">
            <span>{it.quantity}× {it.product_name}</span><span>{euro(it.line_total_cents)}</span>
          </div>
        ))}
        <div className="flex justify-between pt-3 font-display font-semibold"><span>Totaal</span><span>{euro(o.total_cents)}</span></div>
      </div>
      <div className="flex flex-wrap gap-3">
        {o.invoice_pdf_url && <a href={o.invoice_pdf_url} target="_blank" className="btn btn-primary">Factuur openen</a>}
        {o.label_pdf_url && <a href={o.label_pdf_url} target="_blank" className="btn btn-ghost">Verzendlabel printen</a>}
      </div>
    </div>
  );
}
