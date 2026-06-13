import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Maakt een Cloudinary upload-signature aan (admin uploadt direct naar Cloudinary)
export async function POST(req: NextRequest) {
  const { folder } = await req.json();
  const timestamp = Math.round(Date.now() / 1000);
  const toSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash('sha1')
    .update(toSign + process.env.CLOUDINARY_API_SECRET)
    .digest('hex');
  return NextResponse.json({
    signature, timestamp, folder,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  });
}
