-- Kortingsactie met limiet ("eerste X klanten") + registratie per bestelling.
-- Voer dit één keer uit in de Supabase SQL-editor (project ezvwhxjhpzyszomytcgi).

-- Onthoud per bestelling welke code is gebruikt en hoeveel korting is gegeven,
-- zodat we kunnen tellen hoe vaak een actiecode al is ingezet.
alter table orders add column if not exists discount_code text;
alter table orders add column if not exists discount_cents int default 0;

-- Versnelt het tellen van gebruikte codes voor de "eerste X klanten"-limiet.
create index if not exists idx_orders_discount_code on orders (discount_code);

-- Actieve lancering: eerste 100 klanten 50% korting met code VAMIPRO50.
-- (Donny kan dit later aanpassen via Admin -> Instellingen.)
insert into site_content (key, value) values
  ('discount_code', 'VAMIPRO50'),
  ('discount_percent', '50'),
  ('discount_max_uses', '100')
on conflict (key) do update set value = excluded.value, updated_at = now();
