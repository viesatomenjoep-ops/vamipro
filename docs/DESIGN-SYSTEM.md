# Vami Pro — Design System

**Richting: "Albast & Aubergine"** — een koel albast-wit canvas met een diep aubergine (paars) accent. Helder, luxe, geometrisch. Géén goud. De personaliteit zit in de strakke Space Grotesk-koppen, ruime witruimte, en het ene rijke accent dat spaarzaam terugkomt op knoppen, labels en de signature.

## Kleuren (CSS-variabelen in `app/globals.css`)

| Token | Hex | Gebruik |
|---|---|---|
| `--bg` | `#f6f4f7` | Basis-achtergrond (albast: koel wit met lila ondertoon) |
| `--panel` | `#ffffff` | Cards / verhoogde vlakken |
| `--panel-2` | `#f1edf3` | Subtiel getint paneel / placeholders |
| `--raise` | `#faf8fb` | Hover op witte cards |
| `--line` | `#e9e3ec` | Hairline randen |
| `--line-strong` | `#ddd4e2` | Sterkere rand / inputs |
| `--fg` | `#1c1620` | Primaire tekst (bijna-zwart, paarse ondertoon) |
| `--fg-muted` | `#6f6577` | Secundaire tekst |
| `--fg-faint` | `#9b91a2` | Bijschriften |
| `--accent` | `#5b2a86` | **Accent** — knoppen, links, highlights |
| `--accent-deep` | `#3f1c61` | Hover / donkere accenttekst |
| `--accent-bright` | `#7c3fb0` | Levendiger variant (sheen) |
| `--accent-soft` | `#ece3f3` | Lichte wash (chips, badges) |
| `--on-accent` | `#ffffff` | Tekst op accent |

## Typografie

- **Display**: Space Grotesk (600) — koppen, labels, prijzen. Strakke geometrische letter-spacing (-0.025 tot -0.035em).
- **Body**: Inter (400/500) — lopende tekst.
- Klassen: `.h-hero`, `.h-section`, `.eyebrow` (uppercase, letterspacing 0.26em, accentkleur), `.font-display`.

## Signature-element

De **aubergine sheen**: een animatie die het accent over het kernwoord van de hero-kop ("het licht vangt") laat lopen (`.gloss-text`), plus de reflectie-strip (`.gloss-line`) en de schuine accent-highlight op het signature-paneel (nu een lichte aubergine-wash i.p.v. donker glas). Spaarzaam ingezet — één memorabel element, de rest rustig.

## Componenten

- **Knoppen**: `.btn` + `.btn-primary` (aubergine, wit label, lift + diepere kleur bij hover), `.btn-ghost` (outline → accent bij hover), `.btn-light`.
- **Cards**: `.card` (wit + hairline + zachte schaduw), `.card-hover` (rand → accent + lift).
- **Inputs**: `.field` (wit, accent focus-ring).
- **Reveal**: `.reveal`/`.in` via `components/shop/Reveal.tsx` (scroll-onthulling, respecteert reduced-motion).

## Structuur die iets betekent

De categorie-nummering `01–06` is de **echte volgorde van het detailing-proces** (wassen → exterieur → interieur → coating → machines → doeken). Gedefinieerd in `lib/categories.ts`.

## Toegankelijkheid / kwaliteitsvloer

- Responsive tot mobiel (grids vallen terug naar 1–2 koloms).
- Zichtbare focus-ring op inputs (accent-glow).
- `prefers-reduced-motion` schakelt alle animatie uit.
- Donkere tekst op licht canvas — hoog contrast en goed leesbaar.

## Waar zit wat

- Tokens + alle utility-klassen: `app/globals.css`
- Tailwind mapping naar tokens: `tailwind.config.ts` (bv. `bg-panel`, `text-accent`, `border-line`)
- Fonts geladen in: `app/layout.tsx` (next/font: Space Grotesk + Inter)
- Gedeelde UI: `components/shop/` (Header, Footer, ProductCard, AddToCart, CartButton, Reveal)
- Live preview zonder build: `docs/design-preview.html` + `docs/preview-full.png`
- Verkende paletten: `docs/palette-options.html` / `docs/palette-options.png`

## Een ander accent kiezen

Wil je later schuiven van kleur? Wijzig alleen `--accent`, `--accent-deep`, `--accent-bright`, `--accent-soft` en `--accent-glow` in `globals.css` — de hele site verschuift mee. Warmer of koeler wit? Pas `--bg` en `--panel-2` aan.
