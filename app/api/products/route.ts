import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createServiceClient();
  const { data } = await supabase.from('products').select('*').eq('is_active', true);
  return NextResponse.json({ products: data ?? [] });
}
