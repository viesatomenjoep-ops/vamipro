import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';

const display = Space_Grotesk({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-display-next' });
const body = Inter({ subsets: ['latin'], weight: ['400','500','600'], variable: '--font-body-next' });

export const metadata: Metadata = {
  title: { default: 'Vami Pro — Professionele detailingproducten', template: '%s · Vami Pro' },
  description: 'Showroomresultaat voor elke auto. Professionele car-detailingproducten voor liefhebbers en pro\'s. Veilig betalen met iDEAL en Bancontact.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.vamipro.nl'),
};

import { createServiceClient } from '@/lib/supabase/server';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServiceClient();
  const { data: settings } = await supabase.from('store_settings').select('theme_color_accent, theme_color_bg').eq('id', 1).single();

  const accentHex = settings?.theme_color_accent || '#7b3aed';
  const bgHex = settings?.theme_color_bg || '#0d0d12';

  // Extract RGB for tailwind alpha compatibility
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : '123 58 237';
  };

  const accentRgb = hexToRgb(accentHex);
  const bgRgb = hexToRgb(bgHex);

  return (
    <html lang="nl" className={`${display.variable} ${body.variable}`}>
      <body style={{ 
        fontFamily: 'var(--font-body-next), var(--font-body)',
        '--bg': bgHex,
        '--accent': accentHex,
        '--accent-glow': `rgba(${accentRgb}, 0.2)`,
      } as React.CSSProperties}>
        {children}
      </body>
    </html>
  );
}
