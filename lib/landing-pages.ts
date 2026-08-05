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
    metaDesc: 'Professionele autoshampoo kopen? pH-neutraal, veilig voor wax en coating, veel schuim en krasvrij wassen. Snelle levering in NL & BE.',
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
    slug: 'detailing-pakket',
    metaTitle: 'Detailing pakket kopen — complete set voor je auto | Vami Pro',
    metaDesc: 'Compleet detailing pakket kopen: shampoo, snow foam, droogdoek, velgen- en interieurreiniger in één set. Alles voor een showroomresultaat. Levering NL & BE.',
    eyebrow: 'Pakketten',
    h1: 'Detailing pakket kopen: alles in één set',
    intro: 'Wil je in één keer alles in huis hebben om je auto van binnen én buiten te laten stralen? Onze detailing pakketten bundelen de beste producten tegen een voordeelprijs — ideaal om te starten of cadeau te geven.',
    body: 'Wat zit er in een detailing pakket?\nAfhankelijk van het pakket combineer je een pH-neutrale autoshampoo, snow foam, een 1600 GSM droogdoek, velgenreiniger, interieurreiniger en de bijbehorende borstels en doeken. Zo heb je voor elke stap het juiste product.\n\nVoordeliger dan los kopen\nEen compleet pakket is altijd voordeliger dan de losse producten bij elkaar. Je bespaart geld én je weet zeker dat alles op elkaar is afgestemd voor een veilig, krasvrij resultaat.\n\nVoor beginners en gevorderden\nBen je net begonnen met detailing? Dan heb je met één pakket meteen een complete basis. Ben je al gevorderd? Dan vul je met een XXL-pakket je arsenaal in één keer aan.',
    ctaText: 'Bekijk de pakketten',
    ctaLink: '/producten',
  },
  {
    slug: 'spray-wax',
    metaTitle: 'Spray wax kopen — snelle glans & bescherming | Vami Pro',
    metaDesc: 'Spray wax kopen voor direct een diepe glans en langdurige bescherming. Eenvoudig aan te brengen na het wassen. Veilig voor alle lakken. Levering NL & BE.',
    eyebrow: 'Spray wax',
    h1: 'Spray wax: snelle glans en bescherming',
    intro: 'Spray wax is de snelste manier om je auto een showroomglans én bescherming te geven. In enkele minuten breng je een beschermlaag aan die water laat afparelen en de lak diep laat glanzen.',
    body: 'Hoe breng je spray wax aan?\nWas en droog je auto eerst. Spuit de spray wax paneel voor paneel op de nog licht vochtige of droge lak, verdeel met een zachte microvezeldoek en werk na met een tweede droge doek tot een streeploze glans.\n\nGlans én bescherming\nSpray wax vormt een dunne beschermlaag die de lak beschermt tegen vuil, water en lichte vervuiling. Het water parelt af (het "beading"-effect), waardoor je auto langer schoon blijft.\n\nWanneer gebruik je het?\nGebruik spray wax na elke wasbeurt als snelle onderhoudsbescherming, of als toplaag over een bestaande wax of coating voor extra glans. Veilig voor gewone, matte en gecoate lak.',
    ctaText: 'Bekijk de producten',
    ctaLink: '/producten',
  },
  {
    slug: 'washandschoen-auto',
    metaTitle: 'Washandschoen auto kopen — krasvrij wassen | Vami Pro',
    metaDesc: 'Zachte microvezel washandschoen kopen voor krasvrij wassen. Neemt vuil diep op zonder swirls. Voor lak en velgen. Snel geleverd in NL & BE.',
    eyebrow: 'Washandschoenen',
    h1: 'Washandschoen kopen voor krasvrij wassen',
    intro: 'De washandschoen is bepalend voor een krasvrije wasbeurt. Onze zachte microvezel chenille-washandschoenen nemen vuil diep in de vezels op, zodat het niet over je lak schuurt.',
    body: 'Waarom een goede washandschoen?\nHarde sponzen en oude doeken slepen zandkorrels over de lak en veroorzaken swirls. Een dikke microvezel chenille-washandschoen “vangt” het vuil in de lange vezels weg van het lakoppervlak — de veiligste manier om te wassen.\n\nZo gebruik je hem\nWerk met de twee-emmer-methode: was met de handschoen uit de shampoo-emmer en spoel hem regelmatig uit in de tweede emmer met grit guard. Was van boven naar beneden en gebruik een aparte handschoen voor de velgen.\n\nOnderhoud\nSpoel de washandschoen na gebruik goed uit en laat hem drogen. Was hem af en toe op 30-40°C zonder wasverzachter, zodat de vezels zacht en absorberend blijven.',
    ctaText: 'Bekijk de producten',
    ctaLink: '/producten',
  },
  {
    slug: 'detailing-belgie',
    metaTitle: 'Car detailing producten België — snel geleverd | Vami Pro',
    metaDesc: 'Professionele car-detailingproducten in België: autoshampoo, snow foam, droogdoeken en meer. Betaal met Bancontact, snelle levering.',
    eyebrow: 'België',
    h1: 'Car detailing producten in België',
    intro: 'Vami Pro levert professionele detailingproducten in heel België. Bestel eenvoudig met Bancontact en profiteer van snelle levering.',
    body: 'Alles voor detailing, ook in België\nVan pH-neutrale autoshampoo, snow foam en foam lances tot 1600 GSM droogdoeken, microvezeldoeken, velgenreinigers en interieurreinigers — je vindt bij ons alles voor een showroomresultaat.\n\nBetalen met Bancontact\nJe rekent veilig af met Bancontact via Mollie, in je eigen bankomgeving. Voor Nederlandse klanten is iDEAL beschikbaar.\n\nSnelle levering in heel België\nVoor 16:00 op werkdagen besteld en betaald = dezelfde dag verzonden. Levering doorgaans 2-3 werkdagen, inclusief track & trace.',
    ctaText: 'Bekijk de producten',
    ctaLink: '/producten',
  },
];

export function getLandingPage(slug: string): LandingPage | undefined {
  return LANDING_PAGES.find((p) => p.slug === slug);
}
