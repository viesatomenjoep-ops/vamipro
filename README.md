# Vami Pro — Webshop (custom)

Custom detailing-webshop op **Next.js 15 + Supabase + Cloudinary + Mollie + Sendcloud**, klaar om uit te werken in **Antigravity met Gemini**.

- Storefront: `www.vamipro.nl`
- Admin: `www.vamipro.nl/admin` (facturen, bestellingen, verzendlabels)
- Checkout via Mollie (iDEAL + Bancontact)
- Automatische PDF-facturen → opgeslagen in Supabase Storage
- Verzendlabels via Sendcloud → printbaar vanuit het dashboard

## Snel starten

```bash
npm install
cp .env.example .env.local   # vul je keys in
npm run dev                  # http://localhost:3000
```

## Stap 1 — Supabase
1. Maak een Supabase-project aan.
2. Open de SQL-editor en voer uit: `supabase/schema.sql`, daarna `supabase/seed.sql`.
3. Maak twee **privé** Storage-buckets: `invoices` en `labels`.
4. Maak in Authentication één gebruiker aan met jouw `ADMIN_EMAIL` (voor `/admin`).

## Stap 2 — Keys invullen (`.env.local`)
Zie `.env.example`. Let op: `SUPABASE_SERVICE_KEY`, `CLOUDINARY_API_SECRET` en de Sendcloud/Mollie keys zijn **server-only** — nooit in client-code gebruiken.

## Stap 3 — Cloudinary
Upload productfoto's naar map `vamipro/products/{sku}/...` en zet de `public_id`s in `products.cloudinary_images`.

## Stap 4 — Mollie & Sendcloud
- Begin met Mollie **test**-keys. De webhook (`/api/webhooks/mollie`) is niet bereikbaar op localhost — gebruik een tunnel (ngrok) om te testen.
- Sendcloud: vul public/secret key in; labels worden bij betaling automatisch aangemaakt en in bucket `labels` opgeslagen.

## Belangrijkste mappen
```
app/(shop)        Storefront (home, producten, checkout, juridisch)
app/admin         Beveiligd dashboard
app/api           checkout, mollie-webhook, sendcloud, invoice, upload
lib/              supabase, mollie, cloudinary, sendcloud, invoice, cart, email
supabase/         schema.sql + seed.sql (30 producten, 6 categorieën)
docs/             BLUEPRINT.md (volledig bouwplan) + juridische teksten
```

## Placeholders
Zoek in de hele codebase naar `{{` en op `________` en vervang met je echte bedrijfsgegevens (KVK, BTW, adres, IBAN, e-mail, telefoon).

## Volledige uitleg
Zie **`docs/BLUEPRINT.md`** voor de complete architectuur, alle code-toelichting, juridische teksten (AV NL+BE, privacy, retour) en de aanbevolen bouwvolgorde.


## Design
De volledige premium design-laag ("Albast & Aubergine" — licht albast-wit canvas met diep aubergine accent, geen goud) zit al in `app/globals.css`, `tailwind.config.ts`, `app/layout.tsx` en `components/shop/`. Zie **`docs/DESIGN-SYSTEM.md`** voor de tokens en **`docs/design-preview.html`** (of `docs/preview-full.png`) voor een voorbeeld zonder build. Alles is aangesloten op de echte Supabase-data en de Mollie/Sendcloud/Cloudinary-koppelingen.

## Let op
- Prijzen worden altijd server-side berekend (fraudepreventie) — vertrouw nooit client-bedragen.
- Laat de juridische teksten vóór livegang eenmalig door een jurist nakijken.
- Stem de BTW-behandeling van Belgische verkopen (OSS) af met je boekhouder.
