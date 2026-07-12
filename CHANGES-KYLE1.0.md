# Kyle1.0 upgrade — VamiPro

## Gewijzigd
- `app/globals.css` — designsysteem v2: bugfix (gedeelde variabelen zoals --radius/--font-display/--shadow-card stonden alleen in .dark en ontbraken dus in light mode), custom easing curves, ::selection + styled scrollbar, grain-overlay, masked-line reveal (.mask-line), fade-up loadsequence, ken-burns, scroll-cue, marquee, sheen-sweep op knoppen en media (.img-sheen — het "polijst"-signature), nav-underline animatie, reveal-varianten (left/right/scale/blur), footer-wordmark.
- `app/(shop)/page.tsx` — cinematic hero-loadsequence (eyebrow → 3 masked headline-regels → zoekbalk → promo-paneel gestaggerd), scroll-cue, kinetische marquee-sectie, animated counters met echte shopfeiten (1200 GSM / €75 / 14 dagen / 16:00), gestaggerde bestsellers, links/rechts-reveals bij de Droogdoek XXL-feature met sheen, grotere banner- en closing-CTA-typografie.
- `components/shop/Reveal.tsx` — varianten (up/left/right/scale/blur) + className prop, backwards compatible.
- `components/shop/Header.tsx` — backdrop-blur glas-header, animated slide-in underlines op nav-links.
- `components/shop/Footer.tsx` — gigantisch outlined VAMIPRO-wordmark dat op hover saffierblauw invult.
- `components/shop/ProductCard.tsx` — sheen-sweep op productfoto's, "Bekijk →" schuift in op hover.

## Nieuw
- `components/shop/Marquee.tsx` — oneindige CSS-marquee (pauzeert op hover).
- `components/shop/CountUp.tsx` — expo-out counters via IntersectionObserver.

## Kwaliteitsvloer
- `prefers-reduced-motion` schakelt alle animaties uit (masked lines en reveals worden direct zichtbaar).
- Geen nieuwe npm-dependencies: alles pure CSS + IntersectionObserver, dus de build blijft identiek.
- Shop-logica (Supabase, Mollie, cart, admin) onaangeraakt.
