// Blog / detailing-tips. Elk artikel is bewerkbaar via site_content-keys:
// tip_<slug>_<veld>. Wordt getoond op /tips (overzicht) en /tips/<slug> (artikel),
// en levert Article-structured-data aan Google. Nieuw artikel = hier een item bijzetten.
export type Tip = {
  slug: string;
  metaTitle: string;
  metaDesc: string;
  title: string;
  excerpt: string;
  body: string;      // alinea's gescheiden door een lege regel; eerste regel per blok = tussenkop
  date: string;      // ISO datum (voor structured data)
};

export const TIPS: Tip[] = [
  {
    slug: 'auto-wassen-zonder-krassen',
    metaTitle: 'Auto wassen zonder krassen: complete gids | Vami Pro',
    metaDesc: 'Leer hoe je je auto krasvrij wast met de twee-emmer-methode, snow foam en de juiste washandschoen. Praktische detailing-tips van Vami Pro.',
    title: 'Auto wassen zonder krassen: de complete gids',
    excerpt: 'De meeste krassen (swirls) ontstaan tijdens het wassen. Met de juiste methode en materialen voorkom je ze bijna volledig. Zo doe je het.',
    date: '2026-07-01',
    body: 'Waarom ontstaan krassen?\nSwirls zijn fijne krasjes die ontstaan doordat je zand- en vuildeeltjes over de lak wrijft. Verkeerde doeken, één emmer water en droog poetsen zijn de grootste boosdoeners.\n\nStap 1: Spoel en gebruik snow foam\nSpoel de auto eerst goed af om los vuil te verwijderen. Breng daarna snow foam aan met een foam lance en laat 3-5 minuten inwerken. Het schuim weekt het grootste vuil los zodat je het contactloos wegspoelt.\n\nStap 2: De twee-emmer-methode\nGebruik twee emmers: één met pH-neutrale shampoo, één met schoon spoelwater. Spoel je washandschoen na elke paneel in het schone water en gebruik grit guards op de bodem, zodat vuil naar beneden zakt.\n\nStap 3: Was van boven naar beneden\nBegin bij het dak en werk naar beneden — de onderkant is het vuilst. Gebruik een zachte microvezel washandschoen en niet te veel druk.\n\nStap 4: Droog krasvrij\nDroog met een dikke 1600 GSM microvezel droogdoek. Leg de doek op de lak en trek zacht, in plaats van te wrijven. Zo droog je streeploos en zonder swirls.',
  },
  {
    slug: 'auto-drogen-zonder-strepen',
    metaTitle: 'Auto drogen zonder strepen: microvezel droogdoek | Vami Pro',
    metaDesc: 'Streeploos en krasvrij drogen? Ontdek waarom een 1600 GSM microvezel droogdoek het verschil maakt en hoe je hem het beste gebruikt.',
    title: 'Auto drogen zonder strepen met een microvezel droogdoek',
    excerpt: 'Drogen is het moment waarop veel krassen ontstaan. Een dikke microvezel droogdoek en de juiste techniek geven een streeploos resultaat.',
    date: '2026-07-05',
    body: 'Waarom een droogdoek zo belangrijk is\nNa het wassen zit er nog een dunne waterfilm op de lak met opgeloste mineralen. Laat je die opdrogen, dan krijg je kalkvlekken en strepen. Snel en goed drogen voorkomt dat.\n\nKies voor 1600 GSM\nHoe hoger het GSM-gewicht, hoe meer water de doek opneemt en hoe zachter hij is. Met een 1600 GSM twisted-loop droogdoek droog je een hele auto in één keer, zonder uitwringen.\n\nDe juiste techniek\nLeg de doek plat op het paneel en trek hem rustig naar je toe, of dep zacht. Vermijd hard wrijven. Werk van boven naar beneden en gebruik een schone kant zodra de doek verzadigd is.\n\nOnderhoud van je droogdoek\nWas op maximaal 40°C zonder wasverzachter en droog op lage temperatuur. Zo blijft de doek honderden wasbeurten absorberend en pluisvrij.',
  },
  {
    slug: 'snow-foam-gebruiken',
    metaTitle: 'Snow foam gebruiken: zo doe je het goed | Vami Pro',
    metaDesc: 'Snow foam gebruiken met een foam lance? Ontdek de juiste dosering, inwerktijd en waarom voorwassen krassen voorkomt.',
    title: 'Snow foam gebruiken: zo doe je het goed',
    excerpt: 'Snow foam is de veiligste eerste stap van je wasbeurt. Met de juiste dosering en inwerktijd haal je het maximale eruit.',
    date: '2026-07-10',
    body: 'Wat is snow foam?\nSnow foam is een dik, reinigend schuim dat je vóór het handmatig wassen aanbrengt. Het kapselt vuildeeltjes in en glijdt ermee van de lak, zodat je contactloos het grootste vuil verwijdert.\n\nWat heb je nodig?\nEen foam lance (op een hogedrukreiniger) of een pomp-foamer, plus een snow foam concentraat. Meng volgens de aanbevolen verhouding voor een dik, blijvend schuim.\n\nStap voor stap\nSpoel de auto eerst af. Breng het schuim royaal aan van onder naar boven en laat 3-5 minuten inwerken — maar laat het niet opdrogen, zeker niet in de zon. Spoel daarna grondig af.\n\nDaarna handmatig wassen\nSnow foam vervangt het wassen niet, maar maakt het veiliger. Was na de foam met pH-neutrale shampoo via de twee-emmer-methode en droog met een microvezel droogdoek.',
  },
  {
    slug: 'velgen-reinigen-en-beschermen',
    metaTitle: 'Velgen reinigen en beschermen | Vami Pro',
    metaDesc: 'Remstof en wegvuil veilig van je velgen verwijderen met een pH-neutrale velgenreiniger. Plus tips om velgen langer schoon te houden.',
    title: 'Velgen reinigen en beschermen',
    excerpt: 'Velgen krijgen de zwaarste vervuiling. Met de juiste reiniger en borstel maak je ze veilig schoon en houd je ze langer mooi.',
    date: '2026-07-14',
    body: 'Werk altijd op koude velgen\nWarme velgen laten reiniger te snel opdrogen, wat vlekken geeft en minder effectief is. Reinig ze dus in de schaduw of als de auto even heeft gestaan.\n\nDe juiste producten\nGebruik een pH-neutrale velgenreiniger en een zachte velgenborstel. Zure reinigers kunnen coatings en gelakte velgen aantasten — pH-neutraal reinigt krachtig maar veilig.\n\nStap voor stap\nSpuit de reiniger royaal aan, laat kort inwerken en agiteer met de borstel — ook in de spaken en achter de velg. Spoel daarna grondig na met veel water.\n\nBeschermen loont\nBreng na het drogen een velgencoating of quick detailer aan. Beschermde velgen nemen minder remstof op en zijn de volgende keer veel sneller schoon.',
  },
  {
    slug: 'interieur-detailen',
    metaTitle: 'Interieur detailen: stap voor stap | Vami Pro',
    metaDesc: 'Een fris en verzorgd auto-interieur? Volg dit stappenplan voor stof, kunststof, leer en streeploze ruiten.',
    title: 'Interieur detailen: stap voor stap',
    excerpt: 'Een schoon interieur maakt elke rit prettiger. Met een vaste volgorde en de juiste producten krijg je een resultaat als nieuw.',
    date: '2026-07-18',
    body: 'Begin met opruimen en stofzuigen\nHaal alle losse spullen eruit en stofzuig grondig: stoelen, vloermatten, kofferbak en tussen de stoelen. Gebruik een smal mondstuk voor naden.\n\nKunststof en dashboard\nGebruik een all-purpose interieurreiniger met een microvezeldoek en een detailborstel voor roosters en knoppen. Kies een reiniger met een matte finish — geen vette glans die verblindt of stof aantrekt.\n\nLeer verzorgen\nReinig leer met een milde leerreiniger en breng daarna leervoeding aan. Zo blijft het leer soepel en voorkom je scheurtjes.\n\nStreeploze ruiten als afwerking\nPoets de ruiten met een glasreiniger en een schone, korte-vezel microvezeldoek. Werk uit de zon en poets na met een droge doek voor een streeploos resultaat.',
  },
  {
    slug: 'lak-beschermen-wax-of-coating',
    metaTitle: 'Lak beschermen: wax of keramische coating? | Vami Pro',
    metaDesc: 'Wax of keramische coating? Ontdek de verschillen, hoe lang ze beschermen en welke bij jou past. Detailing-tips van Vami Pro.',
    title: 'Lak beschermen: wax vs. keramische coating',
    excerpt: 'Bescherming houdt je lak langer mooi en maakt wassen makkelijker. Maar kies je wax of een keramische coating? De verschillen op een rij.',
    date: '2026-07-22',
    body: 'Waarom lakbescherming?\nEen beschermlaag stoot water en vuil af, geeft diepe glans en beschermt tegen UV en lichte vervuiling. Bijkomend voordeel: de auto blijft langer schoon en is sneller te wassen.\n\nWax: warme glans, eenvoudig\nWax is makkelijk aan te brengen en geeft een warme, natte glans. De bescherming houdt enkele weken tot maanden. Ideaal als je regelmatig zelf onderhoudt en van het aanbrengen geniet.\n\nKeramische coating: langdurig en hard\nEen keramische coating vormt een hardere, langdurige laag (maanden tot jaren) met sterke waterafstoting en meer krasbestendigheid. Het aanbrengen vraagt meer voorbereiding: de lak moet grondig gereinigd en ontvet zijn.\n\nWat past bij jou?\nWil je snel resultaat en houd je van regelmatig bijwerken? Kies wax. Wil je maximale, langdurige bescherming en minder onderhoud? Ga voor een coating. Beide combineer je met onze pH-neutrale onderhoudsproducten.',
  },
];

export function getTip(slug: string): Tip | undefined {
  return TIPS.find((t) => t.slug === slug);
}
