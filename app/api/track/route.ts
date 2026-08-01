import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Registreert een anonieme paginaweergave voor de bezoekersteller. Faalt stil
// (bv. als de tabel nog niet bestaat) zodat de site nooit hindert.
export async function POST(req: NextRequest) {
  try {
    const { session, path } = await req.json();
    if (typeof path === 'string' && !path.startsWith('/admin')) {
      const supabase = createServiceClient();
      await supabase.from('page_hits').insert({
        session: typeof session === 'string' ? session.slice(0, 64) : null,
        path: path.slice(0, 300),
      });
    }
  } catch { /* stil negeren */ }
  return NextResponse.json({ ok: true });
}
