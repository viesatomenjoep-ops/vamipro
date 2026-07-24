-- Vami Pro - Database schema
-- Voer dit uit in de Supabase SQL editor (volgorde aanhouden)

-- ========= CATEGORIEËN =========
create table categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references categories(id) on delete cascade,
  slug text unique not null,
  name text not null,
  description text,
  cloudinary_image text,
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

create or replace function decrement_stock(p_id uuid, qty int)
returns void language sql as $$
  update products set stock = greatest(stock - qty, 0) where id = p_id;
$$;
