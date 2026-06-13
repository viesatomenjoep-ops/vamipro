export const metadata = { title: "Privacybeleid" };
const TEXT = "# Privacybeleid\n\n### Privacyverklaring {{BEDRIJFSNAAM}}\n\n**Verwerkingsverantwoordelijke**: {{JURIDISCHE_NAAM}} (Vami Pro), {{ADRES}}, {{EMAIL}}.\n\n**Welke gegevens verwerken wij?** Naam, adres, e-mail, telefoonnummer, bestelgegevens en betaalstatus. Wij verwerken g\u00e9\u00e9n volledige betaalgegevens; betalingen lopen via Mollie.\n\n**Doeleinden**: het uitvoeren van je bestelling (levering, facturatie, klantenservice), het voldoen aan wettelijke (fiscale) bewaarplichten en, met je toestemming, het versturen van een nieuwsbrief.\n\n**Grondslagen (AVG/GDPR)**: uitvoering van de overeenkomst, wettelijke verplichting (o.a. fiscale bewaartermijn van 7 jaar voor facturen), en toestemming (nieuwsbrief).\n\n**Ontvangers/verwerkers**: Supabase (database/opslag), Cloudinary (media), Mollie (betalingen), Sendcloud en vervoerders (verzending), Vercel (hosting), en de e-mailprovider. Met deze partijen worden verwerkersovereenkomsten gesloten.\n\n**Bewaartermijnen**: bestelgegevens en facturen worden bewaard zolang wettelijk verplicht (fiscaal 7 jaar). Overige gegevens niet langer dan noodzakelijk.\n\n**Jouw rechten**: inzage, correctie, verwijdering, beperking, bezwaar en dataportabiliteit. Verzoeken via {{EMAIL}}. Je kunt een klacht indienen bij de Autoriteit Persoonsgegevens (NL) of de Gegevensbeschermingsautoriteit (BE).\n\n**Cookies**: wij gebruiken functionele cookies (winkelmandje, sessie) en \u2014 alleen met toestemming \u2014 analytische/marketingcookies. Beheer je voorkeuren via de cookiebanner.\n\n---\n";
export default function Page() {
  return (
    <div className="wrap py-16">
      <p className="eyebrow">Juridisch</p>
      <h1 className="h-section mt-3">Privacybeleid</h1>
      <article className="mt-8 max-w-3xl whitespace-pre-wrap text-sm leading-relaxed text-fg-muted">
        {TEXT}
      </article>
    </div>
  );
}
