// Keyword-landingspagina's (top-level, bv. /autoshampoo). Elke pagina is volledig
// bewerkbaar via site_content-keys: landing_<slug>_<veld>. De defaults hieronder
// zijn SEO-rijk geschreven. Nieuwe landingspagina toevoegen = hier een item bijzetten.
export type LandingPage = {
  slug: string;
  metaTitle: string;
  metaDesc: string;
  eyebrow: string;
  h1: string;
  intro: string;
  body: string;      // langere SEO-tekst (nieuwe regels blijven behouden)
  ctaText: string;
  ctaLink: string;
};

export const LANDING_PAGES: LandingPage[] = [
  {
    slug: 'autoshampoo',
    metaTitle: 'Autoshampoo kopen — pH-neutraal & krasvrij | Vami Pro',
    metaDesc: 'Professionele autoshampoo kopen? pH-neutraal, veilig voor wax en coating, veel schuim en krasvrij wassen. Gratis verzending vanaf € 70 in NL & BE.',
    eyebrow: 'Autoshampoo',
    h1: 'Autoshampoo kopen: pH-neutraal en krasvrij',
    intro: 'Een goede autoshampoo is de basis van elke veilige wasbeurt. Bij Vami Pro vind je pH-neutrale shampoos met veel schuim die vuil moeiteloos losweken — veilig voor gewaxte en gecoate lak.',
    body: 'Waarom een pH-neutrale autoshampoo?\nGewone afwasmiddelen of agressieve shampoos tasten was- en coatinglagen aan. Een pH-neutrale autoshampoo reinigt krachtig maar mild, zodat je bescherming intact blijft en de lak diep en glansrijk blijft.\n\nZo was je krasvrij\nGebruik de twee-emmer-methode: één emmer met shampoo, één met schoon spoelwater, beide met een grit guard. Week het vuil eerst los met snow foam, was van boven naar beneden met een zachte washandschoen en droog met een dikke microvezel droogdoek.\n\nVoor liefhebbers én professionals\nOnze concentraten gaan lang mee: een kleine dop shampoo per emmer volstaat. Combineer met snow foam, een foam lance en een 1600 GSM droogdoek voor een compleet, showroomwaardig resultaat.',
    ctaText: 'Bekijk alle producten',
    ctaLink: '/producten',
  },
  {
    slug: 'droogdoeken-kopen',
    metaTitle: 'Droogdoek kopen — 1600 GSM microvezel | Vami Pro',
    metaDesc: 'Dikke 1600 GSM microvezel droogdoek kopen: droog je hele auto krasvrij in één keer. Voor alle lakken en coatings. Snel geleverd in NL & BE.',
    eyebrow: 'Droogdoeken',
    h1: 'Droogdoek kopen: 1600 GSM microvezel',
    intro: 'Drogen is het moment waarop de meeste krassen ontstaan. Een dikke 1600 GSM twisted-loop microvezel droogdoek neemt al het water in één beweging op — krasvrij en streeploos.',
    body: 'Waarom 1600 GSM?\nGSM staat voor het gewicht per vierkante meter. Hoe hoger, hoe meer water de doek opneemt en hoe zachter hij over de lak glijdt. Met 1600 GSM droog je een complete auto zonder de doek uit te wringen en zonder swirls.\n\nGeschikt voor elke lak\nOnze droogdoeken zijn veilig voor gewone lak, matte lak, wraps en keramische coatings. De zachte twisted-loop vezels raken de lak nauwelijks.\n\nLang plezier van je droogdoek\nWas op maximaal 40°C zonder wasverzachter en droog op lage temperatuur. Zo blijft de doek honderden wasbeurten absorberend en pluisvrij.',
    ctaText: 'Shop de droogdoeken',
    ctaLink: '/producten',
  },
  {
    slug: 'snow-foam',
    metaTitle: 'Snow foam & foam lance kopen — contactloos voorwassen | Vami Pro',
    metaDesc: 'Snow foam kopen voor een dik, vuiloplossend schuim. Contactloos voorwassen voorkomt krassen. Inclusief tips voor de foam lance. Levering NL & BE.',
    eyebrow: 'Snow foam',
    h1: 'Snow foam: contactloos voorwassen tegen krassen',
    intro: 'Snow foam is de veiligste eerste stap van je wasbeurt. Het dikke schuim weekt zand en vuil los, zodat je het grootste deel wegspoelt zónder de lak aan te raken.',
    body: 'Hoe werkt snow foam?\nJe brengt het schuim aan met een foam lance op je hogedrukreiniger (of een pomp-sproeier). Het schuim hecht aan de lak, kapselt vuildeeltjes in en glijdt ermee naar beneden. Laat 3-5 minuten inwerken (niet laten opdrogen) en spoel af.\n\nWaarom het krassen voorkomt\nDe meeste swirls ontstaan doordat je zandkorrels over de lak wrijft tijdens het wassen. Door eerst contactloos het grootste vuil te verwijderen, verklein je dat risico enorm.\n\nCompleet wassen\nNa de snow foam was je met pH-neutrale shampoo via de twee-emmer-methode en droog je met een 1600 GSM droogdoek. Zo krijg je een veilig, showroomwaardig resultaat.',
    ctaText: 'Bekijk de producten',
    ctaLink: '/producten',
  },
  {
    slug: 'velgenreiniger',
    metaTitle: 'Velgenreiniger kopen — remstof veilig verwijderen | Vami Pro',
    metaDesc: 'pH-neutrale velgenreiniger kopen die remstof en vuil oplost zonder de coating aan te tasten. Met velgenborstel en tips. Snel geleverd in NL & BE.',
    eyebrow: 'Velgen',
    h1: 'Velgenreiniger: remstof veilig verwijderen',
    intro: 'Velgen krijgen de zwaarste vervuiling te verduren: remstof, wegvuil en teer. Een goede, pH-neutrale velgenreiniger lost dat op zonder je velgen of coating aan te tasten.',
    body: 'Zo reinig je velgen veilig\nWerk altijd op koude velgen. Spuit de reiniger royaal aan, laat kort inwerken en agiteer met een zachte velgenborstel — ook in de spaken en achter de velg. Spoel daarna grondig na.\n\nWaarom pH-neutraal?\nAgressieve, zure reinigers kunnen coatings, gelakte en gepolijste velgen beschadigen. Een pH-neutrale formule reinigt krachtig maar veilig, geschikt voor vrijwel elk type velg.\n\nAfwerken en beschermen\nDroog de velgen en breng eventueel een velgencoating of quick detailer aan. Beschermde velgen blijven langer schoon en zijn de volgende keer sneller te reinigen.',
    ctaText: 'Bekijk de producten',
    ctaLink: '/producten',
  },
  {
    slug: 'interieurreiniger',
    metaTitle: 'Interieurreiniger kopen — stof, leer & kunststof | Vami Pro',
    metaDesc: 'Interieurreiniger kopen voor stof, leer, kunststof en dashboard. Veilig, geen vette glans. Complete detailing van je auto-interieur. Levering NL & BE.',
    eyebrow: 'Interieur',
    h1: 'Interieurreiniger voor een frisse, verzorgde auto',
    intro: 'Een schoon interieur maakt elke rit prettiger. Onze interieurreinigers pakken stof, kunststof, leer en dashboard aan — grondig schoon zonder vette of glimmende film.',
    body: 'Voor elk oppervlak het juiste product\nGebruik een all-purpose interieurreiniger voor kunststof en stof, en een speciale leerreiniger + leervoeding voor leren stoelen. Werk met een zachte detailborstel in naden en roosters.\n\nMat en natuurlijk resultaat\nOnze reinigers laten een matte, natuurlijke finish achter — geen kleverige of spiegelende glans die stof aantrekt of verblindt in de zon.\n\nCompleet interieur detailen\nCombineer met microvezeldoeken, detailborstels en een glasreiniger voor streeploze ruiten. Zo krijg je een interieur dat er weer als nieuw uitziet.',
    ctaText: 'Bekijk de producten',
    ctaLink: '/producten',
  },
  {
    slug: 'detailing-belgie',
    metaTitle: 'Car detailing producten België — snel geleverd | Vami Pro',
    metaDesc: 'Professionele car-detailingproducten in België: autoshampoo, snow foam, droogdoeken en meer. Betaal met Bancontact, gratis verzending vanaf € 70.',
    eyebrow: 'België',
    h1: 'Car detailing producten in België',
    intro: 'Vami Pro levert professionele detailingproducten in heel België. Bestel eenvoudig met Bancontact en profiteer van snelle levering en gratis verzending vanaf € 70.',
    body: 'Alles voor detailing, ook in België\nVan pH-neutrale autoshampoo, snow foam en foam lances tot 1600 GSM droogdoeken, microvezeldoeken, velgenreinigers en interieurreinigers — je vindt bij ons alles voor een showroomresultaat.\n\nBetalen met Bancontact\nJe rekent veilig af met Bancontact via Mollie, in je eigen bankomgeving. Voor Nederlandse klanten is iDEAL beschikbaar.\n\nSnelle levering in heel België\nVoor 16:00 op werkdagen besteld en betaald = dezelfde dag verzonden. Levering doorgaans 2-3 werkdagen. Gratis verzending vanaf € 70, inclusief track & trace.',
    ctaText: 'Bekijk de producten',
    ctaLink: '/producten',
  },
];

export function getLandingPage(slug: string): LandingPage | undefined {
  return LANDING_PAGES.find((p) => p.slug === slug);
}
