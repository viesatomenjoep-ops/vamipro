import { NextRequest, NextResponse } from 'next/server';
import { getShippingMethods } from '@/lib/sendcloud';

export async function GET(req: NextRequest) {
  const country = (req.nextUrl.searchParams.get('country') ?? 'NL') as 'NL' | 'BE';
  try {
    const methods = await getShippingMethods(country);
    return NextResponse.json({ methods });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
