import { NextResponse } from 'next/server';
import { getShopConfig } from '@/lib/shop-config';
import { getDiscountRemaining } from '@/lib/discount';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cfg = await getShopConfig();
  // Resterende plekken bij een gelimiteerde actie (null = onbeperkt). Zo kan de
  // pop-up/winkelmandje de code verbergen zodra de actie vol is.
  const discountRemaining = await getDiscountRemaining(cfg.discountCode, cfg.discountMaxUses);
  return NextResponse.json({ ...cfg, discountRemaining });
}
