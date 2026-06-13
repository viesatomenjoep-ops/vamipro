# Vami Pro — Complete Webshop Blueprint

> **Doel van dit document**: Een volledig, uitvoeringsklaar bouwplan voor de custom webshop **www.vamipro.nl**. Geschreven om direct in **Antigravity met Gemini** te kunnen uitwerken. Bevat architectuur, database-schema (SQL), alle pagina's, de Mollie-checkout, het admin-dashboard (`/admin`), Sendcloud-labels, automatische PDF-facturen, en kant-en-klare juridische teksten voor NL én BE.
>
> **Hoe te gebruiken in Antigravity**: Plak dit document als context. Werk per sectie. De secties zijn gemarkeerd met `[BOUWBLOK]` zodat je ze één voor één aan Gemini kunt voeren. Alle placeholders staan tussen `{{...}}` en vervang je zelf.

---

## 0. Placeholders — vul dit eerst in

Vervang overal in de codebase deze waarden (zet ze als environment variables waar mogelijk):

| Placeholder | Betekenis | Voorbeeld |
|---|---|---|
| `{{BEDRIJFSNAAM}}` | Handelsnaam | Vami Pro |
| `{{JURIDISCHE_NAAM}}` | Statutaire naam | Vami Pro B.V. / VOF |
| `{{ADRES}}` | Vestigingsadres | Straatnaam 1, 1234 AB Plaats |
| `{{KVK}}` | KVK-nummer | 12345678 |
| `{{BTW_NL}}` | BTW-nummer NL | NL001234567B01 |
| `{{IBAN}}` | Rekeningnummer | NL00 BANK 0123 4567 89 |
| `{{EMAIL}}` | Contact e-mail | info@vamipro.nl |
| `{{TELEFOON}}` | Telefoon | +31 6 12345678 |
| `{{MOLLIE_API_KEY}}` | Mollie live/test key | test_xxx |
| `{{SUPABASE_URL}}` | Supabase project URL | https://xxx.supabase.co |
| `{{SUPABASE_ANON_KEY}}` | Publieke key | eyJ... |
| `{{SUPABASE_SERVICE_KEY}}` | Service role key (server only!) | eyJ... |
| `{{CLOUDINARY_CLOUD_NAME}}` | Cloudinary cloud | vamipro |
| `{{CLOUDINARY_API_KEY}}` | Cloudinary key | 123... |
| `{{CLOUDINARY_API_SECRET}}` | Cloudinary secret (server only!) | abc... |
| `{{SENDCLOUD_PUBLIC_KEY}}` | Sendcloud public | ... |
| `{{SENDCLOUD_SECRET_KEY}}` | Sendcloud secret | ... |
| `{{ADMIN_EMAIL}}` | Login admin-dashboard | jij@vamipro.nl |

---

## 1. Wat we bouwen (scope)

Een volledig custom, headless webshop ter waarde van een ±€50k traject, met:

- **Storefront** op `www.vamipro.nl` — snel, SEO-geoptimaliseerd, mooie productfoto's
- **30 detailingproducten** verdeeld over categorieën
- **Perfecte kassa/checkout** via **Mollie** (iDEAL + Bancontact)
- **Admin-dashboard** op `www.vamipro.nl/admin` voor producten, bestellingen, facturen en verzendlabels
- **Automatische PDF-facturen** — gegenereerd, genummerd en opgeslagen in Supabase Storage
- **Sendcloud-labels** — automatisch aangemaakt per bestelling, printbaar vanuit het dashboard
- **FAQ**, **Algemene Voorwaarden (NL + BE)**, privacy- en retourbeleid
- Alle data in **Supabase** (PostgreSQL + Storage), alle media via **Cloudinary**

---

## 2. Technische stack

| Laag | Keuze | Reden |
|---|---|---|
| Frontend/Backend | **Next.js 15 (App Router)** | SSR/SSG, snelle laadtijd, perfecte SEO, API routes voor serverlogica |
| Taal | **TypeScript** | Typeveiligheid, minder bugs |
| Styling | **Tailwind CSS + shadcn/ui** | Snel, consistent, premium uitstraling |
| Database | **Supabase (PostgreSQL)** | Producten, voorraad, orders, klanten, facturen |
| Auth (admin) | **Supabase Auth** | Beveiligde toegang tot `/admin` |
| Media | **Cloudinary** | Auto-WebP/AVIF, CDN, responsive transformaties |
| Betalingen | **Mollie** | iDEAL + Bancontact, webhooks |
| Verzending | **Sendcloud** | Labels NL+BE, meerdere vervoerders |
| Facturen | **@react-pdf/renderer** (of Puppeteer) | PDF genereren server-side |
| Hosting | **Vercel** | Native Next.js, edge CDN |
| Versiebeheer | **GitHub** | CI/CD naar Vercel |
| State (cart) | **Zustand + localStorage** | Lichtgewicht winkelmandje |
| Validatie | **Zod** | Form- en API-validatie |
| E-mail | **Resend** (of Postmark) | Orderbevestiging + factuur als bijlage |

---

## 3. Projectstructuur

```
vamipro/
├─ app/
│  ├─ (shop)/
│  │  ├─ page.tsx                  # Homepage
│  │  ├─ producten/
│  │  │  ├─ page.tsx               # Alle producten + filters
│  │  │  └─ [slug]/page.tsx        # Productdetail
│  │  ├─ categorie/[slug]/page.tsx # Categoriepagina
│  │  ├─ winkelmandje/page.tsx     # Cart
│  │  ├─ checkout/
│  │  │  ├─ page.tsx               # Kassa (adres + verzending)
│  │  │  └─ bedankt/page.tsx       # Orderbevestiging
│  │  ├─ faq/page.tsx
│  │  ├─ voorwaarden/page.tsx      # Algemene voorwaarden NL+BE
│  │  ├─ privacy/page.tsx
│  │  ├─ retourneren/page.tsx
│  │  ├─ verzending/page.tsx
│  │  └─ contact/page.tsx
│  ├─ admin/
│  │  ├─ layout.tsx                # Beveiligde layout (auth-check)
│  │  ├─ page.tsx                  # Dashboard overzicht
│  │  ├─ login/page.tsx
│  │  ├─ producten/                # CRUD producten
│  │  ├─ bestellingen/             # Orders + status
│  │  ├─ facturen/                 # Facturenlijst + download
│  │  └─ instellingen/page.tsx
│  ├─ api/
│  │  ├─ checkout/route.ts         # Mollie payment aanmaken
│  │  ├─ webhooks/mollie/route.ts  # Mollie status-update
│  │  ├─ shipping/sendcloud/route.ts
│  │  ├─ invoice/[orderId]/route.ts# PDF genereren
│  │  └─ products/route.ts
│  └─ layout.tsx                   # Root layout
├─ components/
│  ├─ shop/                        # ProductCard, CartDrawer, etc.
│  ├─ admin/
│  └─ ui/                          # shadcn componenten
├─ lib/
│  ├─ supabase/                    # client + server clients
│  ├─ mollie.ts
│  ├─ sendcloud.ts
│  ├─ cloudinary.ts
│  ├─ invoice.tsx                  # PDF template
│  └─ cart-store.ts                # Zustand
├─ types/
├─ .env.local
└─ package.json
```

---

## 4. `[BOUWBLOK]` Database — Supabase schema (SQL)

Voer dit uit in de Supabase SQL-editor. Bevat tabellen, relaties, indexen en Row Level Security (RLS).

```sql
-- ========= CATEGORIEËN =========
create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ========= PRODUCTEN =========
create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  short_description text,
  description text,
  category_id uuid references categories(id) on delete set null,
  brand text,
  price_cents int not null,            -- prijs incl. BTW in centen
  vat_rate numeric(4,2) default 21.00, -- BTW %
  stock int default 0,
  sku text unique,
  cloudinary_images text[] default '{}', -- public_ids van Cloudinary
  is_active boolean default true,
  is_featured boolean default false,
  weight_grams int default 500,        -- voor verzendberekening
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ========= KLANTEN (gasten + accounts) =========
create table customers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  first_name text,
  last_name text,
  phone text,
  created_at timestamptz default now()
);

-- ========= BESTELLINGEN =========
create type order_status as enum (
  'pending','paid','processing','shipped','delivered','cancelled','refunded'
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,   -- bv. VP-2026-00001
  customer_id uuid references customers(id),
  status order_status default 'pending',
  -- bedragen in centen
  subtotal_cents int not null,
  shipping_cents int not null,
  vat_cents int not null,
  total_cents int not null,
  -- verzendadres
  ship_first_name text, ship_last_name text,
  ship_address text, ship_house_number text, ship_addition text,
  ship_postal_code text, ship_city text, ship_country text, -- 'NL' of 'BE'
  ship_email text, ship_phone text,
  -- factuuradres (optioneel afwijkend)
  bill_company text, bill_vat_number text,
  -- Mollie
  mollie_payment_id text,
  payment_method text,                 -- 'ideal' / 'bancontact'
  paid_at timestamptz,
  -- Sendcloud
  sendcloud_parcel_id text,
  tracking_number text,
  tracking_url text,
  label_pdf_url text,                  -- Supabase Storage URL
  -- factuur
  invoice_number text unique,
  invoice_pdf_url text,                -- Supabase Storage URL
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,          -- snapshot
  sku text,
  unit_price_cents int not null,       -- snapshot incl. BTW
  vat_rate numeric(4,2) not null,
  quantity int not null,
  line_total_cents int not null
);

-- ========= FACTUURNUMMER-SEQUENCE =========
create table counters (
  key text primary key,
  value int not null default 0
);
insert into counters (key, value) values ('invoice', 0), ('order', 0);

-- functie: volgende ophogend nummer (atomair)
create or replace function next_counter(counter_key text)
returns int language plpgsql as $$
declare v int;
begin
  update counters set value = value + 1 where key = counter_key returning value into v;
  return v;
end; $$;

-- ========= INDEXEN =========
create index idx_products_category on products(category_id);
create index idx_products_active on products(is_active);
create index idx_orders_status on orders(status);
create index idx_orders_created on orders(created_at desc);
create index idx_order_items_order on order_items(order_id);

-- ========= updated_at trigger =========
create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
create trigger trg_products_touch before update on products
  for each row execute function touch_updated_at();
create trigger trg_orders_touch before update on orders
  for each row execute function touch_updated_at();

-- ========= ROW LEVEL SECURITY =========
alter table products enable row level security;
alter table categories enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table customers enable row level security;

-- Publiek mag actieve producten + categorieën LEZEN
create policy "public read active products" on products
  for select using (is_active = true);
create policy "public read categories" on categories
  for select using (true);

-- Orders/items/customers: GEEN publieke toegang.
-- Server gebruikt de SERVICE ROLE key (omzeilt RLS) voor schrijven/lezen.
-- Admin-dashboard leest via service role in server components/route handlers.
```

### Storage buckets (Supabase Storage)
Maak twee buckets aan (privé):
- `invoices` — PDF-facturen (`{invoice_number}.pdf`)
- `labels` — Sendcloud verzendlabels (`{order_number}.pdf`)

Genereer signed URLs (bv. 1 uur geldig) wanneer de admin een document opent.

---

## 5. `[BOUWBLOK]` Categorieën + 30 producten (seed data)

6 categorieën, 5 producten elk. Prijzen incl. 21% BTW, in centen. SKU's en gewichten zijn realistisch geschat. Foto's: upload je naar Cloudinary en vul de `public_id`s in.

```sql
-- CATEGORIEËN
insert into categories (slug, name, description, sort_order) values
('wassen',        'Wassen & Shampoo',       'Autoshampoo, snow foam en alles voor een veilige wasbeurt.', 1),
('exterieur',     'Exterieur Reiniging',    'Velgenreiniger, teerverwijderaar, insectenreiniger en meer.', 2),
('coating',       'Coating & Bescherming',  'Keramische coatings, sealants en wax voor langdurige bescherming.', 3),
('interieur',     'Interieur',              'Reinigers en verzorging voor leer, kunststof en stoffen.', 4),
('doeken',        'Doeken & Accessoires',   'Microvezeldoeken, droogdoeken, washandschoenen en emmers.', 5),
('machines',      'Machines & Gereedschap', 'Polijstmachines, pads en applicators voor profwerk.', 6);
```

```sql
-- PRODUCTEN (vervang cloudinary_images later met echte public_ids)
-- Helper: category_id wordt via subquery op slug gekoppeld.

insert into products (slug, name, short_description, description, category_id, brand, price_cents, stock, sku, weight_grams, is_featured) values

-- ===== WASSEN & SHAMPOO =====
('vami-snow-foam-1l','Vami Snow Foam 1L','pH-neutrale dikke schuimreiniger','Dikke, pH-neutrale snow foam die hardnekkig vuil losweekt vóór contactwas. Veilig voor coatings en wax. Gebruik met een foam lance.',(select id from categories where slug='wassen'),'Vami Pro',1495,40,'VP-WAS-001',1200,true),
('vami-shampoo-ph-neutraal-500ml','Vami pH-Neutrale Shampoo 500ml','Glansversterkende autoshampoo','Hoog geconcentreerde pH-neutrale shampoo met glansversterkers. Tast was- en coatinglagen niet aan.',(select id from categories where slug='wassen'),'Vami Pro',1295,60,'VP-WAS-002',650,false),
('vami-wheel-cleaner-500ml','Vami Wheel Cleaner 500ml','Kleurindicerende velgenreiniger','Velgenreiniger die van kleur verandert bij contact met ijzerdeeltjes. Veilig voor alle velgtypes.',(select id from categories where slug='wassen'),'Vami Pro',1695,35,'VP-WAS-003',650,true),
('vami-wash-mitt-deluxe','Vami Deluxe Wash Mitt','Zachte microvezel washandschoen','Pluche microvezel washandschoen die vuil veilig vasthoudt en krassen minimaliseert.',(select id from categories where slug='wassen'),'Vami Pro',995,80,'VP-WAS-004',150,false),
('vami-bucket-grit-guard','Vami Wasemmer 20L + Grit Guard','Emmer met vuilrooster','20L wasemmer met grit guard die vuil naar de bodem laat zakken zodat het niet terug op je washandschoen komt.',(select id from categories where slug='wassen'),'Vami Pro',2495,25,'VP-WAS-005',1500,false),

-- ===== EXTERIEUR REINIGING =====
('vami-tar-remover-500ml','Vami Tar & Glue Remover 500ml','Teer- en lijmverwijderaar','Verwijdert teer, boomhars, lijmresten en bitumen zonder de lak aan te tasten.',(select id from categories where slug='exterieur'),'Vami Pro',1395,45,'VP-EXT-001',650,false),
('vami-iron-remover-500ml','Vami Iron Remover 500ml','Vliegroest-verwijderaar','Lost ingebrande remstof en vliegroest op. Kleurindicerend (paars). Voor lak en velgen.',(select id from categories where slug='exterieur'),'Vami Pro',1595,40,'VP-EXT-002',650,true),
('vami-bug-remover-500ml','Vami Bug Remover 500ml','Insectenreiniger','Weekt insectenresten snel los van bumper, grille en voorruit.',(select id from categories where slug='exterieur'),'Vami Pro',1095,50,'VP-EXT-003',650,false),
('vami-clay-bar-kit','Vami Clay Bar Kit','Kleiset met glijmiddel','Reinigingsklei + lubricant voor het verwijderen van vastzittende vervuiling. Maakt de lak spiegelglad.',(select id from categories where slug='exterieur'),'Vami Pro',1995,30,'VP-EXT-004',400,false),
('vami-apc-1l','Vami All Purpose Cleaner 1L','Universele reiniger (concentraat)','Verdunbare allesreiniger voor motorruimte, velgen, kunststof en interieur. Tot 1:10 te verdunnen.',(select id from categories where slug='exterieur'),'Vami Pro',1195,55,'VP-EXT-005',1100,false),

-- ===== COATING & BESCHERMING =====
('vami-ceramic-coating-50ml','Vami Ceramic Coating 9H 50ml','Keramische coating 3 jaar','9H keramische coating met tot 3 jaar bescherming, extreme glans en waterafstotend effect. Incl. applicator + suede doekjes.',(select id from categories where slug='coating'),'Vami Pro',6995,20,'VP-COA-001',300,true),
('vami-spray-sealant-500ml','Vami Spray Sealant 500ml','Snelle sprayverzegeling','SiO2 spray sealant voor maandenlange bescherming en glans. Aan te brengen op natte of droge lak.',(select id from categories where slug='coating'),'Vami Pro',2495,35,'VP-COA-002',650,false),
('vami-carnauba-wax-200ml','Vami Carnauba Wax 200ml','Premium pasta wax','Hoogwaardige carnauba pasta wax voor een warme, diepe glans. Eenvoudig aan te brengen en uit te werken.',(select id from categories where slug='coating'),'Vami Pro',2995,28,'VP-COA-003',350,true),
('vami-glass-coating-30ml','Vami Glass Coating 30ml','Ruitcoating regenafstotend','Hydrofobe coating voor de voorruit. Regen parelt af, betere zichtbaarheid bij nat weer.',(select id from categories where slug='coating'),'Vami Pro',1995,30,'VP-COA-004',150,false),
('vami-tire-dressing-500ml','Vami Tire Dressing 500ml','Bandenglans satijn','Geeft banden een diepe, satijnen finish zonder vet uit te slaan. Langdurig effect.',(select id from categories where slug='coating'),'Vami Pro',1295,45,'VP-COA-005',650,false),

-- ===== INTERIEUR =====
('vami-interior-cleaner-500ml','Vami Interior Cleaner 500ml','Interieurreiniger universeel','Reinigt dashboard, kunststof, stof en leer. Mat, niet-vettend resultaat met frisse geur.',(select id from categories where slug='interieur'),'Vami Pro',1195,50,'VP-INT-001',650,false),
('vami-leather-care-250ml','Vami Leather Care 250ml','Lederreiniger & voeding','2-in-1 reiniger en voeding voor leer. Houdt leer soepel en voorkomt uitdroging en barsten.',(select id from categories where slug='interieur'),'Vami Pro',1695,35,'VP-INT-002',350,true),
('vami-fabric-cleaner-500ml','Vami Fabric & Carpet Cleaner 500ml','Stof- en tapijtreiniger','Verwijdert vlekken uit bekleding, hemel en vloermatten. Diep reinigend schuim.',(select id from categories where slug='interieur'),'Vami Pro',1295,40,'VP-INT-003',650,false),
('vami-air-freshener','Vami Air Freshener','Geurverfrisser (New Car)','Langdurige geurverfrisser met "new car"-geur. Discreet te plaatsen.',(select id from categories where slug='interieur'),'Vami Pro',595,100,'VP-INT-004',80,false),
('vami-glass-cleaner-500ml','Vami Glass Cleaner 500ml','Streeploze ruitenreiniger','Streeploze, ammoniakvrije ruitenreiniger voor binnen- en buitenruiten. Veilig voor getint glas.',(select id from categories where slug='interieur'),'Vami Pro',895,60,'VP-INT-005',650,false),

-- ===== DOEKEN & ACCESSOIRES =====
('vami-microfiber-5pack','Vami Microvezeldoeken 5-pack','Allround microvezeldoeken 400gsm','Set van 5 zachte 400gsm microvezeldoeken voor uitwerken, reinigen en finishen. Krasvrij.',(select id from categories where slug='doeken'),'Vami Pro',1295,90,'VP-DOE-001',300,true),
('vami-drying-towel-xl','Vami Droogdoek XL','Plush droogdoek 1200gsm','Extra dikke 1200gsm twisted-loop droogdoek (60x90cm). Droogt een auto in één keer zonder strepen.',(select id from categories where slug='doeken'),'Vami Pro',1995,45,'VP-DOE-002',450,true),
('vami-applicator-pads-6pack','Vami Applicator Pads 6-pack','Foam applicators','Set van 6 zachte foam applicator pads voor het gelijkmatig aanbrengen van wax, sealant en dressings.',(select id from categories where slug='doeken'),'Vami Pro',795,70,'VP-DOE-003',120,false),
('vami-detailing-brush-set','Vami Detailing Brush Set','Detailborstels 3-delig','3 borstels in verschillende maten voor ventilatieroosters, naden, emblemen en velgen.',(select id from categories where slug='doeken'),'Vami Pro',1495,40,'VP-DOE-004',250,false),
('vami-wheel-brush','Vami Wheel Woolie','Zachte velgenborstel','Lange, zachte velgenborstel die ook de binnenkant van de velg bereikt zonder te krassen.',(select id from categories where slug='doeken'),'Vami Pro',1195,50,'VP-DOE-005',200,false),

-- ===== MACHINES & GEREEDSCHAP =====
('vami-da-polisher-15mm','Vami DA Polisher 15mm','Excentrische polijstmachine','Dual-action polijstmachine met 15mm slag. Krachtige 900W motor, variabele snelheid. Ideaal voor beginners en pro''s.',(select id from categories where slug='machines'),'Vami Pro',16995,12,'VP-MAC-001',2800,true),
('vami-polishing-pads-set','Vami Polijstpads Set','Pads (cutting/polish/finish)','Set polijstpads: snijden, polijsten en finishen. Past op 15mm DA machines.',(select id from categories where slug='machines'),'Vami Pro',2495,25,'VP-MAC-002',400,false),
('vami-compound-500ml','Vami Cutting Compound 500ml','Snijpolish krasverwijdering','Krachtige compound die krassen en swirls verwijdert. Stofarm, snel afwerkend.',(select id from categories where slug='machines'),'Vami Pro',1895,30,'VP-MAC-003',600,false),
('vami-polish-500ml','Vami Finishing Polish 500ml','Finish polish hoogglans','Fijne afwerkpolish voor een holografievrije, diepe hoogglans na het compounderen.',(select id from categories where slug='machines'),'Vami Pro',1795,30,'VP-MAC-004',600,false),
('vami-led-detailing-lamp','Vami LED Detailing Lamp','Oplaadbare inspectielamp','Oplaadbare LED-lamp die swirls en hologrammen zichtbaar maakt tijdens het polijsten.',(select id from categories where slug='machines'),'Vami Pro',3495,18,'VP-MAC-005',500,false);
```

> **Let op BTW**: alle prijzen zijn incl. 21% BTW. Bij verkoop aan een Belgische consument geldt in de regel ook het NL-tarief tot de EU-drempel (OSS-regeling). Stem dit af met je boekhouder; de factuurtemplate toont BTW apart zodat het juridisch klopt.

---

## 6. `[BOUWBLOK]` De perfecte checkout (kassa)

### Flow (stap voor stap)
1. **Winkelmandje** (`/winkelmandje`) — items, aantallen, subtotaal. Cart in Zustand + localStorage.
2. **Checkout** (`/checkout`) — één overzichtelijke pagina met:
   - Contactgegevens (e-mail, telefoon)
   - Verzendadres (met land NL/BE — beïnvloedt verzendkosten)
   - Optioneel afwijkend factuuradres (+ bedrijfsnaam/BTW voor zakelijk)
   - Verzendmethode (opgehaald via Sendcloud op basis van land + gewicht)
   - Live overzicht: subtotaal, verzendkosten, BTW, totaal
   - Betaalmethode: iDEAL of Bancontact (Bancontact alleen tonen/voorselecteren bij land = BE)
3. **Mollie redirect** — klant betaalt bij de bank.
4. **Webhook** — Mollie meldt status; bij `paid`: order op `paid`, factuur genereren, Sendcloud-label aanmaken, bevestigingsmail sturen.
5. **Bedankpagina** (`/checkout/bedankt?order=...`) — bevestiging + ordernummer.

### Checkout UX-principes (haal je over de streep)
- Eén pagina, geen accountverplichting (gast-checkout).
- Adres-autofill op postcode + huisnummer (PostcodeAPI voor NL).
- Duidelijke trust-signalen: veilig betalen, retourbeleid, levertijd.
- Mobiel-first; grote knoppen, weinig velden.
- Realtime validatie met Zod, foutmeldingen inline.
- Voortgangsindicator en duidelijke totaalprijs altijd zichtbaar.

### `lib/mollie.ts`
```ts
import { createMollieClient } from '@mollie/api-client';

export const mollie = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY!, // {{MOLLIE_API_KEY}}
});
```

### `app/api/checkout/route.ts` — betaling aanmaken
```ts
import { NextRequest, NextResponse } from 'next/server';
import { mollie } from '@/lib/mollie';
import { createServiceClient } from '@/lib/supabase/server';
import { z } from 'zod';

const schema = z.object({
  items: z.array(z.object({ productId: z.string(), quantity: z.number().int().positive() })),
  shipping: z.object({
    firstName: z.string(), lastName: z.string(),
    address: z.string(), houseNumber: z.string(), addition: z.string().optional(),
    postalCode: z.string(), city: z.string(), country: z.enum(['NL','BE']),
    email: z.string().email(), phone: z.string(),
  }),
  billing: z.object({ company: z.string().optional(), vatNumber: z.string().optional() }).optional(),
  shippingMethodId: z.string(),
  paymentMethod: z.enum(['ideal','bancontact']),
});

export async function POST(req: NextRequest) {
  const body = schema.parse(await req.json());
  const supabase = createServiceClient();

  // 1. Producten + prijzen SERVER-SIDE ophalen (nooit prijzen uit de client vertrouwen!)
  const ids = body.items.map(i => i.productId);
  const { data: products } = await supabase
    .from('products').select('*').in('id', ids).eq('is_active', true);
  if (!products?.length) return NextResponse.json({ error: 'Geen producten' }, { status: 400 });

  // 2. Bedragen berekenen
  let subtotal = 0, vat = 0;
  const items = body.items.map(i => {
    const p = products.find(x => x.id === i.productId)!;
    const line = p.price_cents * i.quantity;
    subtotal += line;
    vat += Math.round(line - line / (1 + p.vat_rate / 100));
    return { product: p, quantity: i.quantity, line };
  });
  const shippingCents = await getShippingCost(body.shippingMethodId, body.shipping.country);
  const total = subtotal + shippingCents;

  // 3. Ordernummer + order opslaan (status pending)
  const { data: orderNum } = await supabase.rpc('next_counter', { counter_key: 'order' });
  const orderNumber = `VP-2026-${String(orderNum).padStart(5,'0')}`;

  const { data: order } = await supabase.from('orders').insert({
    order_number: orderNumber, status: 'pending',
    subtotal_cents: subtotal, shipping_cents: shippingCents, vat_cents: vat, total_cents: total,
    ship_first_name: body.shipping.firstName, ship_last_name: body.shipping.lastName,
    ship_address: body.shipping.address, ship_house_number: body.shipping.houseNumber,
    ship_addition: body.shipping.addition, ship_postal_code: body.shipping.postalCode,
    ship_city: body.shipping.city, ship_country: body.shipping.country,
    ship_email: body.shipping.email, ship_phone: body.shipping.phone,
    bill_company: body.billing?.company, bill_vat_number: body.billing?.vatNumber,
    payment_method: body.paymentMethod,
  }).select().single();

  // 4. Order items
  await supabase.from('order_items').insert(items.map(it => ({
    order_id: order!.id, product_id: it.product.id, product_name: it.product.name,
    sku: it.product.sku, unit_price_cents: it.product.price_cents,
    vat_rate: it.product.vat_rate, quantity: it.quantity, line_total_cents: it.line,
  })));

  // 5. Mollie betaling
  const payment = await mollie.payments.create({
    amount: { currency: 'EUR', value: (total / 100).toFixed(2) },
    description: `Vami Pro bestelling ${orderNumber}`,
    redirectUrl: `https://www.vamipro.nl/checkout/bedankt?order=${orderNumber}`,
    webhookUrl: `https://www.vamipro.nl/api/webhooks/mollie`,
    method: body.paymentMethod as any,
    metadata: { orderId: order!.id, orderNumber },
  });

  await supabase.from('orders').update({ mollie_payment_id: payment.id }).eq('id', order!.id);

  return NextResponse.json({ checkoutUrl: payment.getCheckoutUrl() });
}
```

### `app/api/webhooks/mollie/route.ts` — status verwerken
```ts
import { NextRequest, NextResponse } from 'next/server';
import { mollie } from '@/lib/mollie';
import { createServiceClient } from '@/lib/supabase/server';
import { generateInvoice } from '@/lib/invoice';
import { createSendcloudLabel } from '@/lib/sendcloud';
import { sendOrderConfirmation } from '@/lib/email';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const paymentId = form.get('id') as string;        // Mollie stuurt alleen het id
  const payment = await mollie.payments.get(paymentId);
  const supabase = createServiceClient();

  const orderId = payment.metadata.orderId as string;
  const { data: order } = await supabase.from('orders').select('*').eq('id', orderId).single();
  if (!order) return NextResponse.json({ ok: true }); // altijd 200 naar Mollie

  if (payment.status === 'paid' && order.status === 'pending') {
    // a) voorraad afboeken
    const { data: items } = await supabase.from('order_items').select('*').eq('order_id', orderId);
    for (const it of items ?? []) {
      await supabase.rpc('decrement_stock', { p_id: it.product_id, qty: it.quantity });
    }
    // b) factuurnummer + PDF
    const invNum = await supabase.rpc('next_counter', { counter_key: 'invoice' });
    const invoiceNumber = `2026-${String(invNum.data).padStart(5,'0')}`;
    const invoiceUrl = await generateInvoice(order, items!, invoiceNumber);
    // c) Sendcloud label
    const label = await createSendcloudLabel(order, items!);
    // d) order updaten
    await supabase.from('orders').update({
      status: 'paid', paid_at: new Date().toISOString(),
      invoice_number: invoiceNumber, invoice_pdf_url: invoiceUrl,
      sendcloud_parcel_id: label.parcelId, tracking_number: label.trackingNumber,
      tracking_url: label.trackingUrl, label_pdf_url: label.labelUrl,
    }).eq('id', orderId);
    // e) bevestigingsmail met factuur
    await sendOrderConfirmation(order, invoiceUrl);
  }

  if (['expired','canceled','failed'].includes(payment.status)) {
    await supabase.from('orders').update({ status: 'cancelled' }).eq('id', orderId);
  }
  return NextResponse.json({ ok: true });
}
```

> **Voorraad-functie** (voeg toe aan SQL):
> ```sql
> create or replace function decrement_stock(p_id uuid, qty int)
> returns void language sql as $$
>   update products set stock = greatest(stock - qty, 0) where id = p_id;
> $$;
> ```

---

## 7. `[BOUWBLOK]` Sendcloud — automatische verzendlabels

### `lib/sendcloud.ts`
```ts
const AUTH = 'Basic ' + Buffer.from(
  `${process.env.SENDCLOUD_PUBLIC_KEY}:${process.env.SENDCLOUD_SECRET_KEY}`
).toString('base64');

const BASE = 'https://panel.sendcloud.sc/api/v2';

// Verzendmethodes ophalen (voor checkout-keuze)
export async function getShippingMethods(country: 'NL'|'BE', weightGrams: number) {
  const res = await fetch(`${BASE}/shipping_methods?to_country=${country}`, {
    headers: { Authorization: AUTH },
  });
  const { shipping_methods } = await res.json();
  return shipping_methods.filter((m: any) =>
    weightGrams >= m.min_weight * 1000 && weightGrams <= m.max_weight * 1000
  );
}

// Label aanmaken na betaling
export async function createSendcloudLabel(order: any, items: any[]) {
  const totalWeight = items.reduce((s, it) => s + (it.weight_grams ?? 500) * it.quantity, 0);
  const res = await fetch(`${BASE}/parcels`, {
    method: 'POST',
    headers: { Authorization: AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      parcel: {
        name: `${order.ship_first_name} ${order.ship_last_name}`,
        address: order.ship_address, house_number: order.ship_house_number,
        city: order.ship_city, postal_code: order.ship_postal_code,
        country: order.ship_country, email: order.ship_email,
        telephone: order.ship_phone, weight: (totalWeight / 1000).toFixed(3),
        order_number: order.order_number,
        request_label: true,
        shipping_method_checkout_name: 'Standaard', // map naar gekozen methode
      },
    }),
  });
  const { parcel } = await res.json();

  // Label-PDF downloaden en opslaan in Supabase Storage
  const labelRes = await fetch(parcel.label.label_printer, { headers: { Authorization: AUTH } });
  const labelBuffer = Buffer.from(await labelRes.arrayBuffer());
  const labelUrl = await uploadToStorage('labels', `${order.order_number}.pdf`, labelBuffer);

  return {
    parcelId: String(parcel.id),
    trackingNumber: parcel.tracking_number,
    trackingUrl: parcel.tracking_url,
    labelUrl,
  };
}
```

### Printen vanuit het dashboard
- In `/admin/bestellingen` toont elke betaalde order een knop **"Label printen"** → opent `label_pdf_url` (signed URL) in een nieuw tabblad → browser-printdialoog.
- Optioneel automatisch printen: gebruik **Sendcloud's printer-integratie** of een lokale PrintNode-koppeling. Voor de eerste versie volstaat de print-knop.

---

## 8. `[BOUWBLOK]` Automatische PDF-facturen (opgeslagen in Supabase)

### `lib/invoice.tsx` — met @react-pdf/renderer
```tsx
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { createServiceClient } from '@/lib/supabase/server';

const euro = (c: number) => `€ ${(c/100).toFixed(2).replace('.', ',')}`;

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  h1: { fontSize: 20, fontWeight: 'bold' },
  row: { flexDirection: 'row', borderBottom: '1 solid #eee', paddingVertical: 4 },
  cell: { flex: 1 }, cellRight: { flex: 1, textAlign: 'right' },
  totals: { marginTop: 20, alignSelf: 'flex-end', width: 200 },
});

function InvoiceDoc({ order, items, invoiceNumber }: any) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.h1}>{/* {{BEDRIJFSNAAM}} */}Vami Pro</Text>
            <Text>{/* {{ADRES}} */}</Text>
            <Text>KVK: {/* {{KVK}} */}  ·  BTW: {/* {{BTW_NL}} */}</Text>
            <Text>{/* {{EMAIL}} */}</Text>
          </View>
          <View>
            <Text>Factuur {invoiceNumber}</Text>
            <Text>Order {order.order_number}</Text>
            <Text>Datum: {new Date().toLocaleDateString('nl-NL')}</Text>
          </View>
        </View>

        <Text>Factuuradres:</Text>
        <Text>{order.bill_company ?? `${order.ship_first_name} ${order.ship_last_name}`}</Text>
        <Text>{order.ship_address} {order.ship_house_number}</Text>
        <Text>{order.ship_postal_code} {order.ship_city}, {order.ship_country}</Text>
        {order.bill_vat_number ? <Text>BTW: {order.bill_vat_number}</Text> : null}

        <View style={{ marginTop: 20 }}>
          <View style={[styles.row, { fontWeight: 'bold' }]}>
            <Text style={[styles.cell, { flex: 3 }]}>Product</Text>
            <Text style={styles.cellRight}>Aantal</Text>
            <Text style={styles.cellRight}>Stuk</Text>
            <Text style={styles.cellRight}>Totaal</Text>
          </View>
          {items.map((it: any, i: number) => (
            <View style={styles.row} key={i}>
              <Text style={[styles.cell, { flex: 3 }]}>{it.product_name}</Text>
              <Text style={styles.cellRight}>{it.quantity}</Text>
              <Text style={styles.cellRight}>{euro(it.unit_price_cents)}</Text>
              <Text style={styles.cellRight}>{euro(it.line_total_cents)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.row}><Text style={styles.cell}>Subtotaal</Text><Text style={styles.cellRight}>{euro(order.subtotal_cents)}</Text></View>
          <View style={styles.row}><Text style={styles.cell}>Verzendkosten</Text><Text style={styles.cellRight}>{euro(order.shipping_cents)}</Text></View>
          <View style={styles.row}><Text style={styles.cell}>waarvan BTW 21%</Text><Text style={styles.cellRight}>{euro(order.vat_cents)}</Text></View>
          <View style={[styles.row, { fontWeight: 'bold' }]}><Text style={styles.cell}>Totaal</Text><Text style={styles.cellRight}>{euro(order.total_cents)}</Text></View>
        </View>

        <Text style={{ marginTop: 30, fontSize: 8, color: '#888' }}>
          Betaling voldaan via {order.payment_method}. {/* {{BEDRIJFSNAAM}} */} · IBAN {/* {{IBAN}} */}
        </Text>
      </Page>
    </Document>
  );
}

export async function generateInvoice(order: any, items: any[], invoiceNumber: string) {
  const blob = await pdf(<InvoiceDoc order={order} items={items} invoiceNumber={invoiceNumber} />).toBlob();
  const buffer = Buffer.from(await blob.arrayBuffer());
  const supabase = createServiceClient();
  const path = `${invoiceNumber}.pdf`;
  await supabase.storage.from('invoices').upload(path, buffer, {
    contentType: 'application/pdf', upsert: true,
  });
  const { data } = await supabase.storage.from('invoices').createSignedUrl(path, 60 * 60 * 24 * 365);
  return data?.signedUrl ?? path;
}
```

### Facturatie-workflow voor jou (administratie)
- Elke betaalde order krijgt **automatisch** een doorlopend factuurnummer (`2026-00001`, `2026-00002`, …) via de `counters`-tabel — voldoet aan de wettelijke eis van een ononderbroken reeks.
- PDF wordt opgeslagen in bucket `invoices` en gekoppeld aan de order.
- In `/admin/facturen` zie je een lijst met zoeken/filteren op datum en bedrag, met **download** en **opnieuw verzenden** per factuur.
- Export-knop: **CSV/Excel-export** van alle facturen per periode → makkelijk aan te leveren bij je boekhouder of te importeren.
- Creditfacturen: maak een order-status `refunded` die een creditnota genereert (negatieve bedragen, eigen nummerreeks `C-2026-xxxxx`).

---

## 9. `[BOUWBLOK]` Admin-dashboard (`/admin`)

### Beveiliging
- `app/admin/layout.tsx` checkt Supabase Auth-sessie server-side; geen sessie of e-mail ≠ `{{ADMIN_EMAIL}}` → redirect naar `/admin/login`.
- Alle admin-data wordt via de **service role key** in server components/route handlers opgehaald (omzeilt RLS, blijft server-side).

```ts
// app/admin/layout.tsx (kern)
import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect('/admin/login');
  return <div className="admin-shell">{/* sidebar + */}{children}</div>;
}
```

### Schermen
| Route | Functie |
|---|---|
| `/admin` | KPI's: omzet vandaag/maand, # open orders, voorraadwaarschuwingen, laatste 10 bestellingen |
| `/admin/bestellingen` | Tabel met filters (status, datum). Per order: detail, statuswijziging, **factuur openen**, **label printen**, tracking |
| `/admin/bestellingen/[id]` | Volledig orderdetail, klantgegevens, items, betaal- en verzendstatus, knoppen |
| `/admin/producten` | CRUD: lijst met voorraad inline-editable; nieuw/bewerk-formulier |
| `/admin/producten/[id]` | Bewerk product: naam, prijs, voorraad, categorie, beschrijving, **foto's uploaden naar Cloudinary** |
| `/admin/facturen` | Facturenlijst, zoeken, download PDF, CSV-export per periode |
| `/admin/instellingen` | Bedrijfsgegevens, verzendtarieven, BTW, e-mailteksten |

### Dashboard-statuses (orderafhandeling)
`pending` → (betaald) `paid` → (jij verwerkt) `processing` → (label aangemaakt + verstuurd) `shipped` → `delivered`. Plus `cancelled` / `refunded`.

### Voorraadwaarschuwing
Toon producten met `stock <= 5` rood op het dashboard.

---

## 10. `[BOUWBLOK]` Cloudinary (media)

### `lib/cloudinary.ts`
```ts
// URL-helper voor frontend (geen secret nodig)
export function cldUrl(publicId: string, opts: { w?: number; h?: number } = {}) {
  const t = ['f_auto', 'q_auto', opts.w && `w_${opts.w}`, opts.h && `h_${opts.h}`, 'c_fill']
    .filter(Boolean).join(',');
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${t}/${publicId}`;
}
```

### Upload (server-side, admin)
- Gebruik **signed upload** via een API route die met `CLOUDINARY_API_SECRET` een signature maakt; de admin uploadt direct naar Cloudinary, jij slaat alleen de `public_id` op in `products.cloudinary_images`.
- Map: `vamipro/products/{sku}/...`
- Frontend gebruikt `cldUrl(publicId, { w: 800 })` → automatisch WebP/AVIF, gecomprimeerd, via CDN.

### Productfoto's responsive
- Productkaart: `w_500`
- Productdetail (hoofdfoto): `w_1000`
- Thumbnails: `w_120`
- Gebruik Next.js `<Image>` met `loader` die naar `cldUrl` wijst.

---

## 11. Storefront-pagina's + content

### Homepage (`/`)
- **Hero**: sterke claim + sfeerbeeld. Tekst: "Showroom-resultaat voor elke auto. Professionele detailingproducten, ontwikkeld voor liefhebbers en pro's."
- **Uitgelichte producten** (`is_featured = true`)
- **Categorieblokken** (6 categorieën met icoon + foto)
- **USP-balk**: Voor 16:00 besteld = vandaag verzonden · Veilig betalen met iDEAL & Bancontact · Gratis verzending vanaf €75 · 14 dagen retour
- **Social proof / reviews** (later koppelbaar aan bv. Kiyoh of Trustpilot)
- **Nieuwsbrief** + footer met alle juridische links

### Productenoverzicht (`/producten`)
- Filterbalk: categorie, merk, prijs, op voorraad
- Sortering: nieuwste, prijs op/af, populair
- Productkaarten: foto, naam, korte beschrijving, prijs, "In winkelmandje"

### Productdetail (`/producten/[slug]`)
- Fotogalerij (Cloudinary), titel, prijs incl. BTW, voorraadstatus
- Lange beschrijving, gebruiksaanwijzing, specificaties
- Aantal + "In winkelmandje", verzendinfo
- Gerelateerde producten uit dezelfde categorie
- SEO: `generateMetadata`, JSON-LD `Product` schema

### Overige pagina's
- `/categorie/[slug]` — producten per categorie
- `/winkelmandje`, `/checkout`, `/checkout/bedankt`
- `/faq`, `/voorwaarden`, `/privacy`, `/retourneren`, `/verzending`, `/contact`

### SEO-basis
- `sitemap.ts` + `robots.ts` genereren
- Per product/categorie unieke title + meta description
- Open Graph-afbeeldingen via Cloudinary
- Schema.org: `Product`, `BreadcrumbList`, `Organization`
- Snelle Core Web Vitals dankzij SSG + Cloudinary

---

## 12. Bedrijfsgegevens (verplicht op de site)

Toon in de footer én op `/contact` en in de AV:

```
{{JURIDISCHE_NAAM}} (handelend onder de naam {{BEDRIJFSNAAM}} / Vami Pro)
{{ADRES}}
KVK: {{KVK}}
BTW: {{BTW_NL}}
E-mail: {{EMAIL}}
Telefoon: {{TELEFOON}}
IBAN: {{IBAN}}
```

---

## 13. FAQ-content (kant-en-klaar)

**Bestellen & betalen**
- *Welke betaalmethodes accepteren jullie?* iDEAL (Nederland) en Bancontact (België), beide via Mollie. Je betaalt veilig in je eigen bankomgeving.
- *Is online betalen veilig?* Ja. Betalingen lopen via Mollie, een gecertificeerde Payment Service Provider. Wij ontvangen of bewaren geen betaalgegevens.
- *Kan ik op factuur betalen?* Voor zakelijke klanten is dit op aanvraag mogelijk. Neem contact op via {{EMAIL}}.

**Verzending**
- *Wat zijn de verzendkosten?* De kosten worden in de checkout berekend op basis van je land en bestelgewicht. Vanaf €75 verzenden we gratis binnen NL en BE.
- *Hoe snel wordt mijn bestelling verzonden?* Vóór 16:00 op werkdagen besteld en betaald = dezelfde dag verzonden. Levering doorgaans 1–2 werkdagen (NL) en 2–3 werkdagen (BE).
- *Kan ik mijn pakket volgen?* Ja, je ontvangt een track & trace-link per e-mail zodra je pakket is aangemeld.
- *Verzenden jullie naar België?* Ja, naar zowel Nederland als België.

**Retour & garantie**
- *Kan ik mijn bestelling retourneren?* Ja, je hebt 14 dagen bedenktijd. Ongeopende producten kun je retourneren. Zie ons retourbeleid.
- *Een product is beschadigd aangekomen, wat nu?* Mail binnen 48 uur naar {{EMAIL}} met je ordernummer en een foto. We lossen het snel op.

**Producten**
- *Zijn de producten geschikt voor coatings/wax?* Onze shampoos en reinigers zijn pH-neutraal en veilig voor gecoate en gewaxte lak, tenzij anders vermeld.
- *Geven jullie advies?* Zeker. Mail je vraag naar {{EMAIL}} en we helpen je met de juiste keuze.

---

## 14. Algemene Voorwaarden (NL + BE) — kant-en-klare tekst

> **Belangrijk**: dit is een degelijke, bruikbare basis op maat van een NL-webshop die ook aan Belgische consumenten levert. Laat dit vóór livegang eenmalig nakijken door een jurist. Vul alle `{{...}}` in.

### Algemene Voorwaarden {{BEDRIJFSNAAM}}

**Artikel 1 – Definities**
In deze voorwaarden betekent: "Ondernemer" {{JURIDISCHE_NAAM}}, handelend onder de naam Vami Pro; "Consument" de natuurlijke persoon die niet handelt in de uitoefening van beroep of bedrijf; "Klant" iedere afnemer; "Overeenkomst" de overeenkomst op afstand tussen Ondernemer en Klant; "Bedenktijd" de termijn waarbinnen de Consument gebruik kan maken van zijn herroepingsrecht.

**Artikel 2 – Identiteit van de ondernemer**
{{JURIDISCHE_NAAM}} (Vami Pro), gevestigd te {{ADRES}}. KVK: {{KVK}}. BTW: {{BTW_NL}}. E-mail: {{EMAIL}}. Telefoon: {{TELEFOON}}.

**Artikel 3 – Toepasselijkheid**
1. Deze voorwaarden zijn van toepassing op elk aanbod van de Ondernemer en op elke tot stand gekomen Overeenkomst op afstand.
2. Voordat de Overeenkomst wordt gesloten, wordt de tekst van deze voorwaarden langs elektronische weg beschikbaar gesteld, zodat de Klant deze eenvoudig kan opslaan.

**Artikel 4 – Het aanbod**
1. Alle aanbiedingen zijn vrijblijvend en gelden zolang de voorraad strekt.
2. Producten worden zo nauwkeurig mogelijk omschreven en afgebeeld. Kennelijke vergissingen of fouten binden de Ondernemer niet.

**Artikel 5 – De overeenkomst**
1. De Overeenkomst komt tot stand op het moment dat de Klant het aanbod aanvaardt en aan de gestelde voorwaarden voldoet (betaling).
2. De Ondernemer bevestigt de ontvangst van de bestelling langs elektronische weg.

**Artikel 6 – Prijzen**
1. Alle prijzen zijn in euro's en inclusief btw, tenzij anders vermeld. Verzendkosten worden apart vermeld in de checkout.
2. De Ondernemer behoudt zich het recht voor prijzen te wijzigen; de prijs ten tijde van de bestelling geldt.

**Artikel 7 – Betaling**
1. Betaling geschiedt via de in de webshop aangeboden methoden (iDEAL, Bancontact) via Mollie.
2. De bestelling wordt na ontvangst van de betaling verwerkt.

**Artikel 8 – Levering en uitvoering**
1. Als plaats van levering geldt het adres dat de Klant heeft opgegeven.
2. Bestellingen worden met bekwame spoed, uiterlijk binnen 30 dagen, geleverd, tenzij anders overeengekomen. Doorgaans wordt vóór 16:00 op werkdagen betaalde bestellingen dezelfde dag verzonden.
3. Het risico van beschadiging en/of vermissing van producten gaat over op de Klant op het moment van bezorging.

**Artikel 9 – Herroepingsrecht (Consument)**
1. De Consument kan een Overeenkomst gedurende een bedenktijd van **14 dagen** zonder opgave van redenen ontbinden. Deze termijn gaat in op de dag nadat de Consument (of een aangewezen derde) het product heeft ontvangen.
2. Tijdens de bedenktijd gaat de Consument zorgvuldig om met het product en de verpakking. Hij pakt het product slechts uit voor zover nodig om de aard en kenmerken vast te stellen.
3. Wil de Consument herroepen, dan meldt hij dit binnen de bedenktijd via {{EMAIL}} of het modelformulier voor herroeping.
4. De Consument zendt het product binnen 14 dagen na de melding terug. De rechtstreekse kosten van terugzending komen voor rekening van de Consument, tenzij anders vermeld.

**Artikel 10 – Uitsluiting herroepingsrecht**
Het herroepingsrecht is uitgesloten voor verzegelde producten die om redenen van gezondheidsbescherming of hygiëne niet geschikt zijn om te worden teruggezonden en waarvan de verzegeling na levering is verbroken, en voor producten die na levering door hun aard onherroepelijk vermengd zijn (bijv. aangebroken vloeistoffen/chemicaliën).

**Artikel 11 – Terugbetaling**
Bij herroeping betaalt de Ondernemer het reeds betaalde bedrag (inclusief eventuele leveringskosten voor heenzending op basis van de goedkoopste standaardlevering) uiterlijk binnen 14 dagen terug, mits het product retour is ontvangen of de Consument aantoont dat het is teruggezonden.

**Artikel 12 – Conformiteit en garantie**
1. De Ondernemer staat ervoor in dat de producten voldoen aan de Overeenkomst en de wettelijke (non-conformiteits)bepalingen. Voor Consumenten gelden de wettelijke rechten (in NL Boek 7 BW; in BE de regeling inzake consumentenkoop met de wettelijke garantietermijn van 2 jaar).
2. Een door de Ondernemer verstrekte garantie doet niets af aan de wettelijke rechten van de Consument.

**Artikel 13 – Klachten**
1. Klachten over de uitvoering van de Overeenkomst worden binnen bekwame tijd nadat de Klant de gebreken heeft geconstateerd, volledig en duidelijk omschreven ingediend bij {{EMAIL}}.
2. De Ondernemer beantwoordt klachten binnen 14 dagen.

**Artikel 14 – Geschillen en toepasselijk recht**
1. Op Overeenkomsten is Nederlands recht van toepassing.
2. Voor Consumenten met woonplaats in **België** geldt dat dwingende bepalingen van Belgisch consumentenrecht onverkort van toepassing blijven en dat de Consument tevens een beroep kan doen op de wettelijke bescherming die het recht van zijn woonplaats biedt.
3. Een Consument kan een geschil ook voorleggen via het Europese ODR-platform: https://ec.europa.eu/consumers/odr.

---

### Aanvulling specifiek voor Belgische consumenten

Voor Klanten die als Consument in België wonen, gelden aanvullend:
- **Wettelijke garantie**: minimaal 2 jaar conform het Belgisch consumentenrecht (Wetboek van economisch recht, Boek VI/IX).
- **Herroepingstermijn**: 14 dagen, conform de Belgische omzetting van de EU-richtlijn consumentenrechten.
- **Bevoegde instantie**: de Belgische Consument kan zich wenden tot de Consumentenombudsdienst (https://consumentenombudsdienst.be) en het ODR-platform.
- **Taal**: communicatie en voorwaarden zijn in het Nederlands beschikbaar.

---

### Modelformulier voor herroeping
> Aan {{JURIDISCHE_NAAM}}, {{ADRES}}, {{EMAIL}}:
> Ik/Wij deel/delen u mede dat ik/wij onze overeenkomst betreffende de verkoop van de volgende producten herroep/herroepen: [producten] — Besteld op/Ontvangen op: [datum] — Naam consument(en) — Adres — Datum.

---

## 15. Privacybeleid — kant-en-klare tekst

### Privacyverklaring {{BEDRIJFSNAAM}}

**Verwerkingsverantwoordelijke**: {{JURIDISCHE_NAAM}} (Vami Pro), {{ADRES}}, {{EMAIL}}.

**Welke gegevens verwerken wij?** Naam, adres, e-mail, telefoonnummer, bestelgegevens en betaalstatus. Wij verwerken géén volledige betaalgegevens; betalingen lopen via Mollie.

**Doeleinden**: het uitvoeren van je bestelling (levering, facturatie, klantenservice), het voldoen aan wettelijke (fiscale) bewaarplichten en, met je toestemming, het versturen van een nieuwsbrief.

**Grondslagen (AVG/GDPR)**: uitvoering van de overeenkomst, wettelijke verplichting (o.a. fiscale bewaartermijn van 7 jaar voor facturen), en toestemming (nieuwsbrief).

**Ontvangers/verwerkers**: Supabase (database/opslag), Cloudinary (media), Mollie (betalingen), Sendcloud en vervoerders (verzending), Vercel (hosting), en de e-mailprovider. Met deze partijen worden verwerkersovereenkomsten gesloten.

**Bewaartermijnen**: bestelgegevens en facturen worden bewaard zolang wettelijk verplicht (fiscaal 7 jaar). Overige gegevens niet langer dan noodzakelijk.

**Jouw rechten**: inzage, correctie, verwijdering, beperking, bezwaar en dataportabiliteit. Verzoeken via {{EMAIL}}. Je kunt een klacht indienen bij de Autoriteit Persoonsgegevens (NL) of de Gegevensbeschermingsautoriteit (BE).

**Cookies**: wij gebruiken functionele cookies (winkelmandje, sessie) en — alleen met toestemming — analytische/marketingcookies. Beheer je voorkeuren via de cookiebanner.

---

## 16. Retour- & verzendbeleid — kant-en-klare tekst

### Retourneren
Niet tevreden? Je hebt 14 dagen bedenktijd vanaf ontvangst. Meld je retour via {{EMAIL}} met je ordernummer. Stuur ongebruikte, ongeopende producten in de originele verpakking terug binnen 14 dagen na je melding. Verzegelde of aangebroken vloeistoffen/chemicaliën zijn om hygiëne- en veiligheidsredenen uitgesloten van retour. Retourkosten zijn voor eigen rekening. Na ontvangst en controle storten we het aankoopbedrag binnen 14 dagen terug via dezelfde betaalmethode.

### Verzending
- **Landen**: Nederland en België.
- **Tarieven**: berekend in de checkout op basis van gewicht en land. **Gratis verzending vanaf €75** (NL & BE).
- **Levertijd**: vóór 16:00 op werkdagen besteld en betaald = dezelfde dag verzonden. NL doorgaans 1–2 werkdagen, BE 2–3 werkdagen.
- **Track & trace**: je ontvangt een volglink per e-mail zodra het pakket is aangemeld bij de vervoerder.

---

## 17. Environment variables (`.env.local`)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL={{SUPABASE_URL}}
NEXT_PUBLIC_SUPABASE_ANON_KEY={{SUPABASE_ANON_KEY}}
SUPABASE_SERVICE_KEY={{SUPABASE_SERVICE_KEY}}      # NOOIT in client gebruiken
# Mollie
MOLLIE_API_KEY={{MOLLIE_API_KEY}}
# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME={{CLOUDINARY_CLOUD_NAME}}
CLOUDINARY_API_KEY={{CLOUDINARY_API_KEY}}
CLOUDINARY_API_SECRET={{CLOUDINARY_API_SECRET}}    # server only
# Sendcloud
SENDCLOUD_PUBLIC_KEY={{SENDCLOUD_PUBLIC_KEY}}
SENDCLOUD_SECRET_KEY={{SENDCLOUD_SECRET_KEY}}
# Admin
ADMIN_EMAIL={{ADMIN_EMAIL}}
# E-mail (Resend)
RESEND_API_KEY=...
# Site
NEXT_PUBLIC_SITE_URL=https://www.vamipro.nl
```

---

## 18. Bouwvolgorde voor Antigravity / Gemini (aanbevolen sprints)

1. **Setup**: Next.js + TypeScript + Tailwind + shadcn/ui, GitHub, Vercel, env vars.
2. **Database**: voer sectie 4 + 5 uit in Supabase, maak Storage-buckets.
3. **Storefront read-only**: homepage, productenoverzicht, productdetail, categorieën (lezen uit Supabase, foto's via Cloudinary).
4. **Winkelmandje**: Zustand-store + cartdrawer + `/winkelmandje`.
5. **Checkout + Mollie**: sectie 6 (checkout-pagina, API route, webhook, bedankpagina). Test met Mollie test-keys.
6. **Sendcloud**: sectie 7 — labels aanmaken + opslaan.
7. **Facturen**: sectie 8 — PDF genereren + opslaan + mailen.
8. **Admin**: sectie 9 — auth, dashboard, producten-CRUD, orders, facturen, label-print.
9. **Content + juridisch**: secties 11–16 als pagina's.
10. **SEO + polish**: sitemap, schema.org, meta, performance, cookiebanner.
11. **Go-live**: live Mollie-keys, live Sendcloud, domein `www.vamipro.nl` koppelen aan Vercel, echte bedrijfsgegevens invullen.

---

## 19. Aandachtspunten / risico's

- **Prijzen altijd server-side bepalen** — nooit vertrouwen op bedragen uit de client (fraudepreventie).
- **Webhook idempotent maken** — Mollie kan meerdere keren callen; check `order.status` voordat je verwerkt (zit al in de code).
- **Mollie webhook is niet bereikbaar op localhost** — gebruik een tunnel (ngrok) tijdens ontwikkeling.
- **BTW & OSS**: stem de BTW-behandeling van Belgische verkopen af met je boekhouder (OSS-drempel).
- **Service role key** mag alleen server-side bestaan, nooit in een client component of in de browser-bundle.
- **Juridische teksten** eenmalig laten checken door een jurist vóór livegang.
- **Backups**: zet Supabase point-in-time recovery aan.

---

*Einde blueprint — Vami Pro webshop. Vul de placeholders in en werk de bouwblokken in volgorde uit in Antigravity met Gemini.*
