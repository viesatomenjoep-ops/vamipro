import { NextResponse } from 'next/server';
import { getShopConfig } from '@/lib/shop-config';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cfg = await getShopConfig();
  return NextResponse.json(cfg);
}
