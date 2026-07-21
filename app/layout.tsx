import type { Metadata } from 'next';
import { Archivo, Space_Mono } from 'next/font/google';
import './globals.css';

const display = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-display-next' });
const mono = Space_Mono({ subsets: ['latin'], weight: ['400','700'], variable: '--font-mono-next' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.vamipro.nl';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Vami Pro — Professionele detailingproducten', template: '%s · Vami Pro' },
  description: 'Showroomresultaat voor elke auto. Professionele car-detailingproducten voor liefhebbers en pro\'s. Veilig betalen met iDEAL en Bancontact.',
  keywords: ['auto wassen', 'car detailing', 'professionele detailing producten', 'autopoets', 'microvezeldoek', 'showroom glans'],
  alternates: {
    canonical: '/',
    languages: {
      'nl-NL': '/',
      'nl-BE': '/',
    },
  },
  openGraph: {
    title: 'Vami Pro — Professionele detailingproducten',
    description: 'Showroomresultaat voor elke auto. Professionele car-detailingproducten voor liefhebbers en pro\'s.',
    url: siteUrl,
    siteName: 'Vami Pro',
    images: [
      {
        url: '/images/hero-audi.jpg',
        width: 1200,
        height: 630,
        alt: 'Vami Pro - Professionele Detailing Producten',
      },
    ],
    locale: 'nl_NL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vami Pro — Professionele detailingproducten',
    description: 'Showroomresultaat voor elke auto. Professionele car-detailingproducten voor liefhebbers en pro\'s.',
    images: ['/images/hero-audi.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Google Search Console verificatie — zet de code uit Search Console in
  // de env-variabele GOOGLE_SITE_VERIFICATION. De meta-tag verschijnt dan automatisch.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

import { ThemeProvider } from '@/components/ThemeProvider';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'Vami Pro',
  url: siteUrl,
  email: 'info@vamipro.nl',
  image: `${siteUrl}/images/logo-clean.png`,
  description: 'Professionele car-detailingproducten voor een showroomresultaat. Geleverd in NL en BE.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Kroonstraat 33',
    postalCode: '4879 AV',
    addressLocality: 'Etten-Leur',
    addressCountry: 'NL',
  },
  vatID: 'NL004313236B58',
  taxID: '86797840',
  areaServed: ['NL', 'BE'],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" suppressHydrationWarning className={`${display.variable} ${mono.variable}`}>
      <body style={{ fontFamily: 'var(--font-display-next), var(--font-body)' } as React.CSSProperties}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
