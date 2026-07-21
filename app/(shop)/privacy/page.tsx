import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacybeleid',
  description: 'Lees hoe Vami Pro je persoonsgegevens verwerkt en beschermt volgens de AVG/GDPR bij het bestellen van car-detailingproducten in NL & BE.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacybeleid',
    description: 'Lees hoe Vami Pro je persoonsgegevens verwerkt en beschermt volgens de AVG/GDPR bij het bestellen van car-detailingproducten in NL & BE.',
    url: '/privacy',
    type: 'website',
  },
};

export default function PrivacyPage() {
  return (
    <div className="wrap py-12 md:py-24 max-w-4xl">
      <p className="eyebrow">Juridisch</p>
      <h1 className="h-section mt-3">Privacybeleid</h1>
      
      <article className="mt-10 space-y-10 text-base md:text-lg leading-relaxed text-fg-muted">
        
        <section>
          <h2 className="font-display text-2xl font-semibold text-fg mb-4">Privacyverklaring Vami Pro</h2>
          
          <div className="space-y-8">
            <div>
              <p>
                <strong className="text-fg font-medium">Verwerkingsverantwoordelijke:</strong><br />
                Vami Pro<br />
                Kroonstraat 33, 4879 AV Etten-Leur, Nederland<br />
                KVK 86797840<br />
                info@vamipro.nl
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-fg mb-1">Welke gegevens verwerken wij?</h3>
              <p>Naam, adres, e-mail, telefoonnummer, bestelgegevens en betaalstatus. Wij verwerken géén volledige betaalgegevens; alle betalingen lopen veilig via onze betaalpartner Mollie.</p>
            </div>

            <div>
              <h3 className="font-semibold text-fg mb-1">Doeleinden</h3>
              <p>Wij verwerken je gegevens voor het uitvoeren van je bestelling (levering, facturatie, klantenservice), het voldoen aan wettelijke (fiscale) bewaarplichten en, met jouw uitdrukkelijke toestemming, het versturen van een nieuwsbrief.</p>
            </div>

            <div>
              <h3 className="font-semibold text-fg mb-1">Grondslagen (AVG/GDPR)</h3>
              <p>Wij verwerken de gegevens op basis van de volgende grondslagen: uitvoering van de overeenkomst, wettelijke verplichting (o.a. fiscale bewaartermijn van 7 jaar voor facturen), en toestemming (voor bijvoorbeeld de nieuwsbrief).</p>
            </div>

            <div>
              <h3 className="font-semibold text-fg mb-1">Ontvangers / Verwerkers</h3>
              <p>We delen je gegevens uitsluitend met partijen die nodig zijn voor het uitvoeren van onze dienstverlening. Dit zijn: Supabase (database en opslag), Cloudinary (media), Mollie (betalingen), Sendcloud en vervoerders (verzending), Vercel (hosting), en onze e-mailprovider. Met al deze partijen worden verwerkersovereenkomsten gesloten om je gegevens te beschermen.</p>
            </div>

            <div>
              <h3 className="font-semibold text-fg mb-1">Bewaartermijnen</h3>
              <p>Bestelgegevens en facturen worden bewaard zolang wettelijk verplicht (fiscaal 7 jaar). Overige gegevens bewaren we niet langer dan noodzakelijk voor de doeleinden waarvoor ze zijn verzameld.</p>
            </div>

            <div>
              <h3 className="font-semibold text-fg mb-1">Jouw rechten</h3>
              <p>Je hebt altijd het recht op inzage, correctie, verwijdering, beperking, bezwaar en dataportabiliteit van je persoonsgegevens. Verzoeken hiervoor kun je indienen via <strong>info@vamipro.nl</strong>. Daarnaast heb je het recht om een klacht in te dienen bij de Autoriteit Persoonsgegevens (NL) of de Gegevensbeschermingsautoriteit (BE).</p>
            </div>

            <div className="h-px w-full bg-line my-12" />

            <div>
              <h3 className="font-semibold text-fg mb-1">Cookies</h3>
              <p>Wij gebruiken functionele cookies (zoals voor je winkelmandje en sessie) om de website goed te laten werken. Alleen met jouw toestemming plaatsen we analytische of marketingcookies. Je kunt je voorkeuren te allen tijde beheren via onze cookiebanner.</p>
            </div>

          </div>
        </section>

      </article>
    </div>
  );
}
