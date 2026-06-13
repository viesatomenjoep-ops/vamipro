import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

// Geeft de opgeslagen factuur-URL terug (genereren gebeurt in de webhook)
export async function GET(_req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const supabase = createServiceClient();
  const { data } = await supabase.from('orders').select('invoice_pdf_url').eq('id', orderId).single();
  if (!data?.invoice_pdf_url) return NextResponse.json({ error: 'Geen factuur' }, { status: 404 });
  return NextResponse.redirect(data.invoice_pdf_url);
}
