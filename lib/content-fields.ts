// Bewerkbare teksten, gegroepeerd per sectie. Nieuwe teksten toevoegen = hier een
// regel bijzetten en op de betreffende pagina `t('<key>', '<standaard>')` gebruiken.
import { LANDING_PAGES } from './landing-pages';
import { TIPS } from './tips';

// SEO-rijke standaard-FAQ's (bewerkbaar via de admin). Wordt gebruikt op /faq en
// levert FAQ-structured-data (rich results) aan Google. Leeg = wordt overgeslagen.
export const FAQ_DEFAULTS: { q: string; a: string }[] = [
  { q: 'Welke autopoetsproducten verkoopt Vami Pro?', a: 'Vami Pro levert professionele car-detailingproducten: autoshampoos, snow foam, droogdoeken, microvezeldoeken, velgenreinigers, interieurreinigers, borstels, sponzen en complete pakketten — voor zowel liefhebbers als professionals in Nederland en België.' },
  { q: 'Wat maakt een 1600 GSM droogdoek beter dan een gewone droogdoek?', a: 'Een 1600 GSM twisted-loop microvezel droogdoek neemt veel meer water op en droogt je auto krasvrij in één beweging. Zo droog je een hele auto zonder strepen of swirls, zonder de lak te belasten.' },
  { q: 'Welke betaalmethodes accepteren jullie?', a: 'Je betaalt veilig met iDEAL (Nederland) en Bancontact (België), beide via Mollie. Wij ontvangen of bewaren zelf geen betaalgegevens.' },
  { q: 'Wat zijn de verzendkosten en levertijden naar NL en BE?', a: 'De verzendkosten zijn € 7,95 in Nederland en € 11,95 in België; het exacte bedrag zie je in de checkout. Voor 16:00 op werkdagen besteld en betaald = dezelfde dag verzonden, doorgaans 1–2 werkdagen (NL) en 2–3 werkdagen (BE).' },
  { q: 'Zijn de producten veilig voor coating, wax en keramische lak?', a: 'Onze autoshampoos en reinigers zijn pH-neutraal en veilig voor gecoate, gewaxte en keramisch beschermde lak, tenzij anders vermeld op de productpagina.' },
  { q: 'Hoe was ik mijn auto krasvrij?', a: 'Gebruik de twee-emmer-methode: week het vuil eerst los met snow foam, was daarna met een zachte washandschoen en een grit guard in de emmer, en droog met een dikke microvezel droogdoek. Zo minimaliseer je krassen en swirls.' },
  { q: 'Wat is snow foam en waarvoor gebruik je het?', a: 'Snow foam is een dik reinigend schuim dat je vóór het wassen aanbrengt met een foam lance. Het weekt het grootste vuil los zodat je dat contactloos wegspoelt — de veiligste eerste stap tegen krassen.' },
  { q: 'Hoe reinig ik mijn velgen veilig?', a: 'Gebruik een pH-neutrale velgenreiniger en een zachte velgenborstel. Laat de reiniger kort inwerken op koude velgen, borstel na en spoel goed. Zo verwijder je remstof zonder de coating aan te tasten.' },
  { q: 'Welke producten heb ik nodig om te beginnen met detailing?', a: 'Een goede basis: een autoshampoo, snow foam met foam lance, een zachte washandschoen, een emmer met grit guard en een microvezel droogdoek. Wil je alles in één keer? Kies dan ons Showroom pakket XXL.' },
  { q: 'Leveren jullie ook in België?', a: 'Ja, we verzenden naar zowel Nederland als België. De verzendkosten zijn € 7,95 (NL) en € 11,95 (BE); het exacte tarief zie je in de checkout.' },
  { q: 'Kan ik mijn bestelling retourneren?', a: 'Je hebt 14 dagen bedenktijd. Ongeopende producten kun je retourneren volgens ons retourbeleid. Neem bij vragen contact op via info@vamipro.nl.' },
  { q: 'Kan ik advies krijgen over de juiste producten?', a: 'Zeker. Stel je vraag via de chat op de site of mail naar info@vamipro.nl — we helpen je graag met de juiste keuze voor jouw auto en lak.' },
  { q: 'Hoe vaak moet ik mijn auto wassen en detailen?', a: 'Voor een goed onderhouden auto is elke 1 tot 2 weken wassen ideaal. Detaileren (velgen, interieur, quick detailer) doe je afhankelijk van gebruik maandelijks tot per kwartaal. Regelmatig onderhoud voorkomt inbrandende vervuiling en houdt de lak langer mooi.' },
  { q: 'Wat is het verschil tussen wax en een keramische coating?', a: 'Wax geeft een warme glans en bescherming voor enkele weken tot maanden. Een keramische coating vormt een hardere, langdurige beschermlaag (maanden tot jaren) met sterke waterafstoting. Beide zijn te combineren met onze pH-neutrale onderhoudsproducten.' },
  { q: 'Hoe verwijder ik insecten, teer en boomhars van de lak?', a: 'Gebruik een speciale insecten- of teerverwijderaar, laat kort inwerken en veeg zacht af met een microvezeldoek. Nooit droog wrijven — dat veroorzaakt krassen. Was daarna de zone na en bescherm met wax of quick detailer.' },
  { q: 'Welke microvezeldoek gebruik ik waarvoor?', a: 'Gebruik een dikke, pluizende doek voor het uitnemen van wax/quick detailer, een korte-vezel doek voor ruiten (streeploos) en een aparte doek voor velgen en vuile zones. Houd doeken per taak gescheiden om krassen en kruisbesmetting te voorkomen.' },
  { q: 'Kan ik jullie producten ook voor een motor, camper of boot gebruiken?', a: 'Ja. Onze shampoos, snow foam, microvezeldoeken en reinigers werken op elke gelakte of gecoate ondergrond — auto, motor, camper, caravan of boot.' },
  { q: 'Hoe onderhoud ik mijn microvezeldoeken en droogdoek?', a: 'Was microvezel op maximaal 40°C zonder wasverzachter (dat verstopt de vezels) en droog op lage temperatuur of aan de lucht. Zo blijven ze honderden wasbeurten zacht en absorberend.' },
  { q: 'Wat is clay bar / reinigingsklei en heb ik het nodig?', a: 'Reinigingsklei haalt ingebedde vervuiling (remstof, industrieel neerslag) uit de lak die wassen niet verwijdert. Ideaal 1-2x per jaar vóór het waxen of coaten, voor een gladde, schone ondergrond.' },
  { q: 'Hoe krijg ik streeploze ruiten?', a: 'Gebruik een glasreiniger met een schone, korte-vezel microvezeldoek en poets na met een droge doek. Werk uit de zon en vermijd te veel product — dat voorkomt strepen.' },
  { q: 'Zijn de verpakkingen en producten milieubewust?', a: 'We kiezen waar mogelijk voor geconcentreerde formules (minder verpakking en transport) en pH-neutrale, lak-veilige samenstellingen. Concentraten meng je zelf met water, wat verspilling beperkt.' },
  { q: 'Hebben jullie pakketten of kortingen voor beginners?', a: 'Ja. Ons Showroom pakket XXL bevat alles voor de perfecte wasbeurt in één doos — voordeliger dan los kopen en ideaal om mee te starten. Houd ook de kortingscode in je winkelwagen in de gaten.' },
];

export const CONTENT_FIELDS: { group: string; items: { key: string; label: string; type?: 'text' | 'textarea'; def: string }[] }[] = [
  {
    group: 'Hero (bovenaan de homepage)',
    items: [
      { key: 'hero_eyebrow', label: 'Klein label boven de titel', def: 'Car detailing · NL & BE' },
      { key: 'hero_title_1', label: 'Titel — regel 1', def: 'Ultieme glans' },
      { key: 'hero_title_2', label: 'Titel — regel 2', def: '& bescherming voor' },
      { key: 'hero_title_3', label: 'Titel — regel 3 (accent)', def: 'de échte liefhebber.' },
      { key: 'hero_subtitle', label: 'Ondertitel', type: 'textarea', def: 'Professionele detailingproducten — van veilig wassen tot showroomglans. Ontwikkeld voor liefhebbers en pro’s.' },
      { key: 'hero_cta_primary', label: 'Knop 1 — tekst', def: 'Shop de collectie' },
      { key: 'hero_cta_secondary', label: 'Knop 2 — tekst', def: 'Bekijk categorieën' },
    ],
  },
  {
    group: 'Statistiek-balk (onder de hero)',
    items: [
      { key: 'stat_1_value', label: 'Statistiek 1 — getal', def: '1600' },
      { key: 'stat_1_suffix', label: 'Statistiek 1 — achtervoegsel', def: ' GSM' },
      { key: 'stat_1_label', label: 'Statistiek 1 — label', def: 'Dikste droogdoek' },
      { key: 'stat_2_prefix', label: 'Statistiek 2 — voorvoegsel', def: '' },
      { key: 'stat_2_value', label: 'Statistiek 2 — getal', def: '100' },
      { key: 'stat_2_suffix', label: 'Statistiek 2 — achtervoegsel', def: '%' },
      { key: 'stat_2_label', label: 'Statistiek 2 — label', def: 'Veilig betalen' },
      { key: 'stat_3_value', label: 'Statistiek 3 — getal', def: '14' },
      { key: 'stat_3_suffix', label: 'Statistiek 3 — achtervoegsel', def: '' },
      { key: 'stat_3_label', label: 'Statistiek 3 — label', def: 'Dagen bedenktijd' },
      { key: 'stat_4_value', label: 'Statistiek 4 — getal', def: '16' },
      { key: 'stat_4_suffix', label: 'Statistiek 4 — achtervoegsel', def: ':00' },
      { key: 'stat_4_label', label: 'Statistiek 4 — label', def: 'Besteld = vandaag verzonden' },
    ],
  },
  {
    group: 'Marquee (lopende balk)',
    items: [
      { key: 'marquee_items', label: 'Teksten (gescheiden door komma’s)', type: 'textarea', def: 'Showroomglans, Swirl-vrij wassen, 1600 GSM, Krasvrij drogen, Voor 16:00 = vandaag verzonden' },
    ],
  },
  {
    group: 'Collectie-sectie',
    items: [
      { key: 'collection_eyebrow', label: 'Klein label', def: 'De collectie' },
      { key: 'collection_title', label: 'Titel — regel 1', def: 'Kies je categorie.' },
      { key: 'collection_subtitle', label: 'Titel — regel 2', def: 'Direct naar de juiste tools.' },
    ],
  },
  {
    group: 'Droogdoek-sectie',
    items: [
      { key: 'towel_badge', label: 'Badge', def: 'Bestseller' },
      { key: 'towel_title_1', label: 'Titel — regel 1', def: 'De dikste droogdoek' },
      { key: 'towel_title_2', label: 'Titel — regel 2', def: 'die we verkopen.' },
      { key: 'towel_intro', label: 'Introtekst', type: 'textarea', def: '1600 gram per vierkante meter twisted-loop microvezel. Eén doek, één auto, nul strepen — zonder ooit de lak te raken.' },
      { key: 'towel_bullet_1', label: 'Kenmerk 1', def: 'droogt een hele auto in één keer' },
      { key: 'towel_bullet_2', label: 'Kenmerk 2', def: 'voor alle lakken en coatings' },
      { key: 'towel_bullet_3', label: 'Kenmerk 3', def: 'en honderden keren wasbaar' },
      { key: 'towel_button', label: 'Knop — tekst', def: 'Shop de droogdoek' },
    ],
  },
  {
    group: 'XXL-pakket-sectie',
    items: [
      { key: 'xxl_title', label: 'Titel', def: 'Showroom pakket XXL' },
      { key: 'xxl_intro', label: 'Introtekst', type: 'textarea', def: 'Alles wat je nodig hebt voor de perfecte wasbeurt en detailing — in één doos. Inclusief droogdoek, washandschoen, emmer met grit guard en meer.' },
      { key: 'xxl_button', label: 'Knop — tekst', def: 'Profiteer nu' },
    ],
  },
  {
    group: 'Het ritueel',
    items: [
      { key: 'ritual_eyebrow', label: 'Klein label', def: 'Het ritueel' },
      { key: 'ritual_title_1', label: 'Titel — regel 1', def: 'Drie fases.' },
      { key: 'ritual_title_2', label: 'Titel — regel 2', def: 'Eén showroomresultaat.' },
      { key: 'ritual_1_title', label: 'Fase 1 — titel', def: 'Wassen' },
      { key: 'ritual_1_text', label: 'Fase 1 — tekst', type: 'textarea', def: 'Snow foam weekt het vuil los, de grit guard houdt je washandschoen schoon. Contactloos waar het kan, veilig waar het moet.' },
      { key: 'ritual_2_title', label: 'Fase 2 — titel', def: 'Drogen' },
      { key: 'ritual_2_text', label: 'Fase 2 — tekst', type: 'textarea', def: 'De 1600 GSM droogdoek neemt alles in één beweging op. Geen strepen, geen swirls — de lak blijft onaangeraakt.' },
      { key: 'ritual_3_title', label: 'Fase 3 — titel', def: 'Detailen' },
      { key: 'ritual_3_text', label: 'Fase 3 — tekst', type: 'textarea', def: 'Borstels, sponzen en microvezel voor velgen, naden en interieur. De details maken het verschil tussen schoon en showroom.' },
    ],
  },
  {
    group: 'Bannertekst (foto-sectie)',
    items: [
      { key: 'gallery_eyebrow', label: 'Klein label', def: 'Professional grade' },
      { key: 'gallery_title', label: 'Titel', type: 'textarea', def: 'Alles voor de perfecte wasbeurt.' },
    ],
  },
  {
    group: 'Reviews-sectie',
    items: [
      { key: 'reviews_eyebrow', label: 'Klein label', def: 'Reviews' },
      { key: 'reviews_title', label: 'Titel', def: 'Wat klanten over ons zeggen.' },
    ],
  },
  {
    group: 'Aanbeveling / review',
    items: [
      { key: 'testimonial_quote', label: 'Quote', type: 'textarea', def: 'Mijn zwarte lak heeft nog nooit zo diep gestaan. De droogdoek alleen al is z’n geld dubbel waard.' },
      { key: 'testimonial_author', label: 'Naam', def: 'Mark V.' },
      { key: 'testimonial_detail', label: 'Detail (auto · plaats)', def: 'BMW M4 · Antwerpen' },
    ],
  },
  {
    group: 'Slot-CTA (onderaan)',
    items: [
      { key: 'final_eyebrow', label: 'Klein label', def: 'Klaar om te beginnen?' },
      { key: 'final_title_1', label: 'Titel — regel 1', def: 'Showroomglans' },
      { key: 'final_title_2', label: 'Titel — regel 2 (accent)', def: 'begint hier.' },
      { key: 'final_text', label: 'Tekst', type: 'textarea', def: 'Voor 16:00 besteld, vandaag verzonden. Snelle levering in NL & BE.' },
      { key: 'final_button', label: 'Knop — tekst', def: 'Shop de collectie' },
    ],
  },
  {
    group: 'Footer & contact',
    items: [
      { key: 'footer_tagline', label: 'Footer-slogan', type: 'textarea', def: 'Professionele detailingproducten voor een showroomresultaat. Geleverd in NL en BE.' },
      { key: 'contact_phone', label: 'Telefoonnummer (leeg = verbergen)', def: '' },
    ],
  },
  {
    group: 'FAQ-sectie op homepage',
    items: [
      { key: 'home_faq_eyebrow', label: 'Klein label', def: 'Hulp' },
      { key: 'home_faq_title', label: 'Titel', def: 'Veelgestelde vragen' },
    ],
  },
  {
    group: 'SEO-tekst (onderaan homepage)',
    items: [
      { key: 'seo_block_title', label: 'Titel', def: 'Professionele autopoetsproducten & car detailing voor NL & BE' },
      { key: 'seo_block_text', label: 'Tekst', type: 'textarea', def: 'Bij Vami Pro vind je alles voor een showroomresultaat: van pH-neutrale autoshampoo, snow foam en foam lances tot 1600 GSM droogdoeken, microvezeldoeken, velgenreinigers, interieurreinigers en complete detailingpakketten. Onze producten zijn geschikt voor liefhebbers én professionals en veilig voor gecoate en gewaxte lak. Betaal eenvoudig met iDEAL of Bancontact — voor 16:00 besteld is dezelfde dag verzonden in Nederland en België.' },
    ],
  },
  {
    group: 'Veelgestelde vragen (FAQ)',
    items: FAQ_DEFAULTS.flatMap((d, i) => ([
      { key: `faq_${i + 1}_q`, label: `Vraag ${i + 1}`, def: d.q },
      { key: `faq_${i + 1}_a`, label: `Antwoord ${i + 1}`, type: 'textarea', def: d.a },
    ])) as { key: string; label: string; type?: 'text' | 'textarea'; def: string }[],
  },
  {
    group: 'SEO: pagina-titels & beschrijvingen',
    items: [
      { key: 'meta_home_title', label: 'Homepage — SEO-titel', def: 'Vami Pro — Professionele detailingproducten' },
      { key: 'meta_home_desc', label: 'Homepage — SEO-beschrijving', type: 'textarea', def: 'Showroomresultaat voor elke auto. Professionele car-detailingproducten voor liefhebbers en pro’s. Veilig betalen met iDEAL en Bancontact. Snelle levering in NL en BE.' },
      { key: 'meta_producten_title', label: 'Producten — SEO-titel', def: 'Alle detailingproducten' },
      { key: 'meta_producten_desc', label: 'Producten — SEO-beschrijving', type: 'textarea', def: 'Bekijk alle car-detailingproducten van Vami Pro: autoshampoo, snow foam, droogdoeken, velgenreinigers en meer. Snelle levering in NL & BE.' },
    ],
  },
  ...(LANDING_PAGES.map((p) => ({
    group: `Landingspagina: /${p.slug}`,
    items: [
      { key: `landing_${p.slug}_metatitle`, label: 'SEO-titel (Google-tabblad)', def: p.metaTitle },
      { key: `landing_${p.slug}_metadesc`, label: 'SEO-beschrijving (Google)', type: 'textarea', def: p.metaDesc },
      { key: `landing_${p.slug}_eyebrow`, label: 'Klein label', def: p.eyebrow },
      { key: `landing_${p.slug}_h1`, label: 'Titel (H1)', def: p.h1 },
      { key: `landing_${p.slug}_intro`, label: 'Introtekst', type: 'textarea', def: p.intro },
      { key: `landing_${p.slug}_body`, label: 'SEO-tekst (lege regel = nieuwe alinea; 1e regel per blok = tussenkop)', type: 'textarea', def: p.body },
      { key: `landing_${p.slug}_ctatext`, label: 'Knop-tekst', def: p.ctaText },
      { key: `landing_${p.slug}_ctalink`, label: 'Knop-link', def: p.ctaLink },
    ],
  })) as { group: string; items: { key: string; label: string; type?: 'text' | 'textarea'; def: string }[] }[]),
  ...(TIPS.map((tp) => ({
    group: `Tip/blog: /tips/${tp.slug}`,
    items: [
      { key: `tip_${tp.slug}_metatitle`, label: 'SEO-titel', def: tp.metaTitle },
      { key: `tip_${tp.slug}_metadesc`, label: 'SEO-beschrijving', type: 'textarea', def: tp.metaDesc },
      { key: `tip_${tp.slug}_title`, label: 'Titel', def: tp.title },
      { key: `tip_${tp.slug}_excerpt`, label: 'Samenvatting (overzicht)', type: 'textarea', def: tp.excerpt },
      { key: `tip_${tp.slug}_body`, label: 'Artikel (lege regel = nieuwe alinea; 1e regel per blok = tussenkop)', type: 'textarea', def: tp.body },
    ],
  })) as { group: string; items: { key: string; label: string; type?: 'text' | 'textarea'; def: string }[] }[]),
];
