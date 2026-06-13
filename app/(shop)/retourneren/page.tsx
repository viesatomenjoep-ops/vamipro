export const metadata = { title: "Retourneren & Verzending" };

export default function Page() {
  return (
    <div className="wrap py-12 md:py-24 max-w-3xl">
      <p className="eyebrow">Klantenservice</p>
      <h1 className="h-section mt-3">Retourneren & Verzending</h1>
      
      <article className="mt-10 space-y-12 text-base md:text-lg leading-relaxed text-fg-muted">
        
        <section>
          <h2 className="font-display text-2xl font-semibold text-fg mb-4">Retourneren</h2>
          <p>
            Niet tevreden? Je hebt 14 dagen bedenktijd vanaf ontvangst. Meld je retour via <strong>info@vamipro.nl</strong> met je ordernummer. 
          </p>
          <p className="mt-4">
            Stuur ongebruikte, ongeopende producten in de originele verpakking terug binnen 14 dagen na je melding. 
            Verzegelde of aangebroken vloeistoffen en chemicaliën zijn om hygiëne- en veiligheidsredenen uitgesloten van retour. 
          </p>
          <p className="mt-4">
            Retourkosten zijn voor eigen rekening. Na ontvangst en controle storten we het aankoopbedrag binnen 14 dagen terug via dezelfde betaalmethode.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-fg mb-4">Verzending</h2>
          <ul className="space-y-4 list-disc list-inside marker:text-accent">
            <li>
              <strong className="text-fg font-medium">Landen:</strong> Nederland en België.
            </li>
            <li>
              <strong className="text-fg font-medium">Tarieven:</strong> Berekend in de checkout op basis van gewicht en land. <strong className="text-fg font-medium">Gratis verzending vanaf €75</strong> (NL & BE).
            </li>
            <li>
              <strong className="text-fg font-medium">Levertijd:</strong> Vóór 16:00 op werkdagen besteld en betaald = dezelfde dag verzonden. NL doorgaans 1–2 werkdagen, BE 2–3 werkdagen.
            </li>
            <li>
              <strong className="text-fg font-medium">Track & trace:</strong> Je ontvangt een volglink per e-mail zodra het pakket is aangemeld bij de vervoerder.
            </li>
          </ul>
        </section>

      </article>
    </div>
  );
}
