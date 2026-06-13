-- Vami Pro - Seed data: 2 categorieen + 30 producten
-- Voer uit NA schema.sql

-- CATEGORIEËN
insert into categories (slug, name, description, sort_order) values
('exterieur-wassen', 'Exterieur & Wassen', 'Hier plaats je alle vloeistoffen en chemie voor de auto.', 1),
('accessoires-washulpmiddelen', 'Accessoires & Washulpmiddelen', 'Dit is de perfecte plek voor alle fysieke tools.', 2);

-- PRODUCTEN (vervang cloudinary_images later met echte public_ids)
-- Helper: category_id wordt via subquery op slug gekoppeld.

insert into products (slug, name, short_description, description, category_id, brand, price_cents, stock, sku, weight_grams, is_featured) values

-- ===== EXTERIEUR & WASSEN (Vloeistoffen / Chemie) =====
('vami-snow-foam-1l','Vami Snow Foam 1L','pH-neutrale dikke schuimreiniger','Dikke, pH-neutrale snow foam die hardnekkig vuil losweekt vóór contactwas. Veilig voor coatings en wax. Gebruik met een foam lance.',(select id from categories where slug='exterieur-wassen'),'Vami Pro',1495,40,'VP-WAS-001',1200,true),
('vami-shampoo-ph-neutraal-500ml','Vami pH-Neutrale Shampoo 500ml','Glansversterkende autoshampoo','Hoog geconcentreerde pH-neutrale shampoo met glansversterkers. Tast was- en coatinglagen niet aan.',(select id from categories where slug='exterieur-wassen'),'Vami Pro',1295,60,'VP-WAS-002',650,false),
('vami-wheel-cleaner-500ml','Vami Wheel Cleaner 500ml','Kleurindicerende velgenreiniger','Velgenreiniger die van kleur verandert bij contact met ijzerdeeltjes. Veilig voor alle velgtypes.',(select id from categories where slug='exterieur-wassen'),'Vami Pro',1695,35,'VP-WAS-003',650,true),
('vami-tar-remover-500ml','Vami Tar & Glue Remover 500ml','Teer- en lijmverwijderaar','Verwijdert teer, boomhars, lijmresten en bitumen zonder de lak aan te tasten.',(select id from categories where slug='exterieur-wassen'),'Vami Pro',1395,45,'VP-EXT-001',650,false),
('vami-iron-remover-500ml','Vami Iron Remover 500ml','Vliegroest-verwijderaar','Lost ingebrande remstof en vliegroest op. Kleurindicerend (paars). Voor lak en velgen.',(select id from categories where slug='exterieur-wassen'),'Vami Pro',1595,40,'VP-EXT-002',650,true),
('vami-bug-remover-500ml','Vami Bug Remover 500ml','Insectenreiniger','Weekt insectenresten snel los van bumper, grille en voorruit.',(select id from categories where slug='exterieur-wassen'),'Vami Pro',1095,50,'VP-EXT-003',650,false),
('vami-apc-1l','Vami All Purpose Cleaner 1L','Universele reiniger (concentraat)','Verdunbare allesreiniger voor motorruimte, velgen, kunststof en interieur. Tot 1:10 te verdunnen.',(select id from categories where slug='exterieur-wassen'),'Vami Pro',1195,55,'VP-EXT-005',1100,false),
('vami-ceramic-coating-50ml','Vami Ceramic Coating 9H 50ml','Keramische coating 3 jaar','9H keramische coating met tot 3 jaar bescherming, extreme glans en waterafstotend effect. Incl. applicator + suede doekjes.',(select id from categories where slug='exterieur-wassen'),'Vami Pro',6995,20,'VP-COA-001',300,true),
('vami-spray-sealant-500ml','Vami Spray Sealant 500ml','Snelle sprayverzegeling','SiO2 spray sealant voor maandenlange bescherming en glans. Aan te brengen op natte of droge lak.',(select id from categories where slug='exterieur-wassen'),'Vami Pro',2495,35,'VP-COA-002',650,false),
('vami-carnauba-wax-200ml','Vami Carnauba Wax 200ml','Premium pasta wax','Hoogwaardige carnauba pasta wax voor een warme, diepe glans. Eenvoudig aan te brengen en uit te werken.',(select id from categories where slug='exterieur-wassen'),'Vami Pro',2995,28,'VP-COA-003',350,true),
('vami-glass-coating-30ml','Vami Glass Coating 30ml','Ruitcoating regenafstotend','Hydrofobe coating voor de voorruit. Regen parelt af, betere zichtbaarheid bij nat weer.',(select id from categories where slug='exterieur-wassen'),'Vami Pro',1995,30,'VP-COA-004',150,false),
('vami-tire-dressing-500ml','Vami Tire Dressing 500ml','Bandenglans satijn','Geeft banden een diepe, satijnen finish zonder vet uit te slaan. Langdurig effect.',(select id from categories where slug='exterieur-wassen'),'Vami Pro',1295,45,'VP-COA-005',650,false),

-- ===== ACCESSOIRES & WASHULPMIDDELEN (Fysieke tools) =====
('vami-wash-mitt-deluxe','Vami Deluxe Wash Mitt','Zachte microvezel washandschoen','Pluche microvezel washandschoen die vuil veilig vasthoudt en krassen minimaliseert.',(select id from categories where slug='accessoires-washulpmiddelen'),'Vami Pro',995,80,'VP-WAS-004',150,false),
('vami-bucket-grit-guard','Vami Wasemmer 20L + Grit Guard','Emmer met vuilrooster','20L wasemmer met grit guard die vuil naar de bodem laat zakken zodat het niet terug op je washandschoen komt.',(select id from categories where slug='accessoires-washulpmiddelen'),'Vami Pro',2495,25,'VP-WAS-005',1500,false),
('vami-clay-bar-kit','Vami Clay Bar Kit','Kleiset met glijmiddel','Reinigingsklei + lubricant voor het verwijderen van vastzittende vervuiling. Maakt de lak spiegelglad.',(select id from categories where slug='accessoires-washulpmiddelen'),'Vami Pro',1995,30,'VP-EXT-004',400,false),
('vami-microfiber-5pack','Vami Microvezeldoeken 5-pack','Allround microvezeldoeken 400gsm','Set van 5 zachte 400gsm microvezeldoeken voor uitwerken, reinigen en finishen. Krasvrij.',(select id from categories where slug='accessoires-washulpmiddelen'),'Vami Pro',1295,90,'VP-DOE-001',300,true),
('vami-drying-towel-xl','Vami Droogdoek XL','Plush droogdoek 1200gsm','Extra dikke 1200gsm twisted-loop droogdoek (60x90cm). Droogt een auto in één keer zonder strepen.',(select id from categories where slug='accessoires-washulpmiddelen'),'Vami Pro',1995,45,'VP-DOE-002',450,true),
('vami-applicator-pads-6pack','Vami Applicator Pads 6-pack','Foam applicators','Set van 6 zachte foam applicator pads voor het gelijkmatig aanbrengen van wax, sealant en dressings.',(select id from categories where slug='accessoires-washulpmiddelen'),'Vami Pro',795,70,'VP-DOE-003',120,false),
('vami-detailing-brush-set','Vami Detailing Brush Set','Detailborstels 3-delig','3 borstels in verschillende maten voor ventilatieroosters, naden, emblemen en velgen.',(select id from categories where slug='accessoires-washulpmiddelen'),'Vami Pro',1495,40,'VP-DOE-004',250,false),
('vami-wheel-brush','Vami Wheel Woolie','Zachte velgenborstel','Lange, zachte velgenborstel die ook de binnenkant van de velg bereikt zonder te krassen.',(select id from categories where slug='accessoires-washulpmiddelen'),'Vami Pro',1195,50,'VP-DOE-005',200,false);
