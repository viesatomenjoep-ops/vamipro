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

import { ThemeProvider } from '@/components/ThemeProvider';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" suppressHydrationWarning className={`${display.variable} ${body.variable}`}>
      <body style={{ fontFamily: 'var(--font-body-next), var(--font-body)' } as React.CSSProperties}>
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
