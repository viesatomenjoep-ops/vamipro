-- ========= WINKEL INSTELLINGEN =========
create table store_settings (
  id int primary key default 1,
  logo_url text,
  hero_media_url text,
  hero_media_type text default 'image', -- 'image' of 'video'
  theme_color_accent text default '#7b3aed',
  theme_color_bg text default '#0d0d12',
  updated_at timestamptz default now()
);

-- Zorg dat er altijd maar 1 rij kan zijn (id=1)
alter table store_settings add constraint store_settings_id_check check (id = 1);

-- Standaardwaarden invoegen
insert into store_settings (id, theme_color_accent, theme_color_bg) 
values (1, '#7b3aed', '#0d0d12')
on conflict (id) do nothing;

-- RLS (Publiek mag lezen, server mag schrijven)
alter table store_settings enable row level security;
create policy "public read settings" on store_settings for select using (true);
