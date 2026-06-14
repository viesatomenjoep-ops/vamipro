const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function upsertProduct(slug, name, shortDesc, description, catSlug, price, sku, image) {
  const { data: cat } = await supabase.from('categories').select('id').eq('slug', catSlug).single();
  if (!cat) {
    console.log("Category not found:", catSlug);
    return;
  }

  const { data: existing } = await supabase.from('products').select('id').eq('slug', slug).single();

  if (existing) {
    await supabase.from('products').update({
      name, short_description: shortDesc, description,
      price_cents: price, is_active: true,
      cloudinary_images: [image]
    }).eq('id', existing.id);
  } else {
    await supabase.from('products').insert({
      slug, name, short_description: shortDesc, description,
      category_id: cat.id, brand: 'Vami Pro', price_cents: price,
      vat_rate: 21.00, stock: 50, sku,
      cloudinary_images: [image], is_active: true, weight_grams: 200
    });
  }
}

async function run() {
  await upsertProduct(
    'vami-bucket-grit-guard', 
    'VaMi-Pro Car Wash Bucket + Grit Guard', 
    'Premium 20L wasemmer met vuilrooster', 
    "Onmisbaar voor een veilige, krasvrije wasbeurt. Deze zware kwaliteit wasemmer is ontworpen voor intensief gebruik en bestand tegen sterke reinigingsmiddelen.\n\nDe meegeleverde Grit Guard (vuilrooster) zorgt dat zand en vuil veilig naar de bodem zakken. Hierdoor blijft je washandschoen brandschoon en voorkom je swirls op de lak. Ideaal voor de twee-emmermethode!\n\nKenmerken:\n• Inclusief Grit Guard vuilrooster\n• Voorkomt actief krassen en swirls\n• Gemaakt van oersterk, duurzaam kunststof\n• Perfect voor de twee-emmermethode", 
    'accessoires', 
    2995, 
    'VP-WAS-005', 
    '/images/bucket.jpg'
  );

  await upsertProduct(
    'vami-microvezeldoek-33x65-3pack', 
    'VaMi-Pro Microvezeldoek 33 x 65 cm (3-Pack)', 
    'Set van 3 premium krasvrije doeken', 
    "Onmisbaar voor het veilig en efficiënt reinigen van je in- en exterieur. In deze handige en voordelige 3-pack! Dankzij de ultrazachte microvezels neem je moeiteloos stof, vocht en vuil op, zonder enige kans op krassen of strepen.\n\nHet royale formaat maakt ze perfect voor het razendsnel afnemen van lakwerk, glas en delicate interieurdelen. De krachtige absorptie garandeert een professioneel resultaat!\n\nGebruik:\n• Licht vochtig: perfect voor stof en lichte vervuiling.\n• Droog: ideaal voor het uitpoetsen van producten.\n\nKenmerken:\n• 3 stuks premium ultrazachte microvezels\n• 100% veilig voor lak, glas, kunststof en interieur\n• Royaal en veelzijdig formaat: 33 x 65 cm\n• Gegarandeerd kras-, pluis- en streeploos", 
    'accessoires', 
    2495, 
    'VP-DOE-003', 
    '/images/microfiber.jpg'
  );

  await upsertProduct(
    'vami-drying-towel-xl', 
    'VaMi-Pro Magnet Droogdoek XL 90 x 60 cm', 
    'Extreme twisted-loop droogdoek', 
    "Dé ultieme droogdoek voor het razendsnel en streeploos drogen van je auto! Dankzij de geavanceerde twisted-loop microvezeltechnologie neemt deze doek extreme hoeveelheden water op. Vaak is één doek al ruim voldoende voor je complete voertuig.\n\nDe ultrazachte structuur glijdt moeiteloos en gewichtloos over je lak. Hierdoor minimaliseer je de kans op krassen en swirls. Veilig, extreem efficiënt en altijd een 100% streeploos eindresultaat!\n\nGebruik:\n• Leg de doek op de natte lak en trek hem rustig naar je toe.\n• Laat de enorme absorptiekracht het werk doen zonder hard te drukken.\n\nKenmerken:\n• Premium twisted-loop microvezeltechnologie\n• Extreem hoog absorberend vermogen\n• Royaal XL formaat: 90 x 60 cm\n• 100% veilig voor lak, glas en coatings", 
    'droogdoeken', 
    2995, 
    'VP-DOE-002', 
    '/images/drying_towel.jpg'
  );

  await upsertProduct(
    'vami-droogdoek-500gsm-40x30-2pack', 
    'VaMi-Pro Microvezel Droogdoek 500 GSM (2-Pack)', 
    'Set van 2 extreem absorberende droogdoeken', 
    "Droog je auto razendsnel, 100% veilig en streeploos. Geleverd in een handige voordeel 2-pack! Dankzij de ultrazachte 500 GSM structuur neemt deze handzame droogdoek moeiteloos water op, zonder kans op krassen.\n\nMet een handig formaat van 40 x 30 cm is deze doek extreem wendbaar. Ideaal voor het vlekkeloos drogen van lakwerk, ruiten, deursponningen en velgen. Een must-have voor elke detailer!\n\nGebruik:\n• Veeg zonder hard te drukken soepel over het natte oppervlak.\n• Na gebruik eenvoudig uitwassen en eindeloos hergebruiken.\n\nKenmerken:\n• Voordeelbundel van 2 stuks 500 GSM droogdoeken\n• Handzaam en wendbaar XL formaat: 40 x 30 cm\n• 100% veilig voor alle (gevoelige) laksoorten", 
    'droogdoeken', 
    1995, 
    'VP-DOE-004', 
    '/images/droogdoek_500gsm.jpg'
  );

  await upsertProduct(
    'vami-wash-mitt-coral-fleece', 
    'VaMi-Pro Coral Fleece Washandschoen met Duim', 
    'Zachte tweekleurige washandschoen met duim', 
    "Ervaar ultieme controle en veiligheid tijdens het wassen! Deze innovatieve coral fleece washandschoen met speciaal duim-design zorgt voor perfecte grip op alle lastige rondingen en velgen van je auto.\n\nDe dikke, ultra-zachte microvezels nemen massaal water en vuil op. De twee verschillende kleuren helpen je bovendien moeiteloos onderscheid te maken tussen de schone bovenkant en de vuile onderkant van je voertuig. \n\nGebruik:\n• Combineer met een hoogwaardige autoshampoo.\n• Was in rechte lijnen en spoel de handschoen zeer regelmatig uit.\n\nKenmerken:\n• Innovatief duimontwerp voor maximale grip\n• Extra dikke en zachte coral fleece microvezels\n• Tweekleurig design voorkomt vuil-overslag\n• 100% veilig voor alle laksoorten en coatings", 
    'washandschoenen', 
    1995, 
    'VP-WAS-006', 
    '/images/wash_mitt.jpg'
  );

  await upsertProduct(
    'vami-wash-mitt-zacht-chenille', 
    'VaMi-Pro Washandschoen zacht', 
    'Zachte microvezel chenille washandschoen', 
    "De ideale keuze voor een extreem veilige en krasvrije wasbeurt! Dankzij de honderden ultrazachte microvezel chenille-vezels (‘noodle’ structuur) wordt vuil diep in de handschoen opgenomen en veilig vastgehouden.\n\nMet een comfortabel formaat van 25 x 16 cm ligt deze washandschoen perfect in de hand. Hij neemt bizar veel water en shampoo op, waardoor je razendsnel grote oppervlakken brandschoon wast.\n\nGebruik:\n• Spoel los vuil vooraf weg en gebruik indien nodig snow foam.\n• Was in rechte lijnen (paneel voor paneel) en spoel regelmatig uit.\n\nKenmerken:\n• Hoogwaardige en ultrazachte chenille-structuur\n• Neemt massaal water en vuil op voor een uiterst veilige wasbeurt\n• 100% veilig voor alle laksoorten en kwetsbare delen", 
    'washandschoenen', 
    1495, 
    'VP-WAS-007', 
    '/images/wash_mitt_chenille.jpg'
  );

  await upsertProduct(
    'vami-nano-spons-magic-5pack', 
    'VaMi-Pro Nano Spons Magic (5-Pack)', 
    'Set van 5 krachtige probleemoplossers', 
    "Dé ultieme probleemoplosser voor hardnekkige vervuiling! Geleverd in een slimme bundel van 5 stuks. Deze licht schurende nano-spons heeft een krachtige, ingebouwde polijstwerking om extreem lastige vlekken en verweerd vuil moeiteloos te verwijderen.\n\nPerfect geschikt voor het grondig reinigen van stugge oppervlakken, zoals zwarte bumpers, ongespoten plastic delen, banden en rubbers. \n\n⚠️ Let op: Vanwege de licht schurende werking mag deze spons absoluut niet direct op autolak gebruikt worden.\n\nGebruik:\n• Maak de spons licht vochtig met water voor gebruik.\n• Wrijf met lichte druk over het vuile oppervlak.\n• Test altijd eerst op een onopvallende plek.\n\nKenmerken:\n• Bundel van 5 stuks krachtige nano-sponzen\n• Ideaal voor ongespoten plastic, bumpers en rubbers\n• Let op: Niet geschikt voor gebruik op autolak!", 
    'accessoires', 
    1495, 
    'VP-ACC-001', 
    '/images/nano_spons.jpg'
  );

  await upsertProduct(
    'vami-houten-paardenhaarborstel', 
    'VaMi-Pro Houten Paardenhaarborstel', 
    'Natuurlijke paardenhaarborstel voor leer', 
    "Geef je lederen interieur de ultieme, veilige dieptereiniging! Deze premium paardenhaarborstel is onmisbaar voor het grondig reinigen van leren autostoelen, sturen en deurpanelen. \n\nDe zachte, 100% natuurlijke paardenharen dringen diep door in de poriën van het leer om hardnekkig vuil en huidoliën los te maken, zónder de kwetsbare toplaag te beschadigen. Dankzij de robuuste houten handgreep en het compacte formaat (10,5 x 5,2 x 4,2 cm) bereik je moeiteloos krappe randen.\n\nGebruik:\n• Breng een goede lederreiniger direct op de borstel of het leer aan.\n• Wrijf met soepele, ronddraaiende bewegingen (zonder hard drukken).\n• Neem het losgeweekte vuil direct af met een microvezeldoek.\n\nKenmerken:\n• 100% natuurlijke en zachte paardenharen (volledig krasvrij)\n• Veilig voor álle soorten (geperforeerd) leer en kunstleer\n• Voorzien van een ergonomische, premium houten handgreep", 
    'interieur', 
    1295, 
    'VP-ACC-003', 
    '/images/paardenhaarborstel.jpg'
  );

  await upsertProduct(
    'vami-microvezel-wielborstel', 
    'VaMi-Pro Microvezel Wielborstel met Softgrip Handvat', 
    'Krasvrije microvezel velgenborstel', 
    "Dé veiligste manier om je velgen en banden brandschoon te krijgen! In tegenstelling tot traditionele, harde velgenborstels neemt deze zachte microvezel wielborstel vuil uiterst effectief op zónder krassen achter te laten of vuil water in je gezicht te spetteren. \n\nDankzij het stevige, ergonomische softgrip handvat werk je uiterst comfortabel en behoud je maximale controle. Het lange, zachte microvezel-design bereikt moeiteloos het diepste van je velgbed en komt makkelijk tussen smalle spaken.\n\nGebruik:\n• Spray de velg in met een hoogwaardige velgenreiniger.\n• Beweeg de borstel rustig heen en weer door de spaken en in het velgbed.\n• Spoel de borstel zeer regelmatig uit in je wasemmer.\n\nKenmerken:\n• Premium, ultrazachte microvezel cover (garandeert krasvrij werken)\n• Ergonomisch softgrip handvat voor perfecte grip en controle\n• Ontworpen om vervelend opspattend water te voorkomen\n• 100% veilig voor álle soorten velgen (inclusief hoogglans zwart)", 
    'accessoires', 
    2295, 
    'VP-ACC-002', 
    '/images/wielborstel.jpg'
  );

  console.log("All products upserted!");
}

run();
