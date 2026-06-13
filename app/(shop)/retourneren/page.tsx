export const metadata = { title: "Retourneren" };
const TEXT = "# Retourneren & verzending\n\n### Retourneren\nNiet tevreden? Je hebt 14 dagen bedenktijd vanaf ontvangst. Meld je retour via {{EMAIL}} met je ordernummer. Stuur ongebruikte, ongeopende producten in de originele verpakking terug binnen 14 dagen na je melding. Verzegelde of aangebroken vloeistoffen/chemicali\u00ebn zijn om hygi\u00ebne- en veiligheidsredenen uitgesloten van retour. Retourkosten zijn voor eigen rekening. Na ontvangst en controle storten we het aankoopbedrag binnen 14 dagen terug via dezelfde betaalmethode.\n\n### Verzending\n- **Landen**: Nederland en Belgi\u00eb.\n- **Tarieven**: berekend in de checkout op basis van gewicht en land. **Gratis verzending vanaf \u20ac75** (NL & BE).\n- **Levertijd**: v\u00f3\u00f3r 16:00 op werkdagen besteld en betaald = dezelfde dag verzonden. NL doorgaans 1\u20132 werkdagen, BE 2\u20133 werkdagen.\n- **Track & trace**: je ontvangt een volglink per e-mail zodra het pakket is aangemeld bij de vervoerder.\n\n---\n";
export default function Page() {
  return (
    <div className="wrap py-16">
      <p className="eyebrow">Juridisch</p>
      <h1 className="h-section mt-3">Retourneren</h1>
      <article className="mt-8 max-w-3xl whitespace-pre-wrap text-sm leading-relaxed text-fg-muted">
        {TEXT}
      </article>
    </div>
  );
}
