-- Eenvoudige, privacyvriendelijke bezoekersteller (geen persoonsgegevens, geen cookies).
-- Voer dit één keer uit in de Supabase SQL-editor (project ezvwhxjhpzyszomytcgi).

create table if not exists page_hits (
  id bigserial primary key,
  session text,          -- willekeurige, anonieme id uit de browser (localStorage)
  path text,             -- welke pagina
  created_at timestamptz default now()
);

create index if not exists idx_page_hits_created on page_hits (created_at);

-- Samenvatting voor het admin-dashboard: paginaweergaven + unieke bezoekers per periode.
-- "Vandaag" wordt in Nederlandse tijd (Europe/Amsterdam) berekend.
create or replace function visit_stats()
returns json language sql stable as $$
  with today_start as (
    select ((now() at time zone 'Europe/Amsterdam')::date)::timestamp at time zone 'Europe/Amsterdam' as t
  )
  select json_build_object(
    'views_today',    (select count(*)                  from page_hits, today_start where created_at >= today_start.t),
    'visitors_today', (select count(distinct session)   from page_hits, today_start where created_at >= today_start.t),
    'views_7d',       (select count(*)                  from page_hits where created_at >= now() - interval '7 days'),
    'visitors_7d',    (select count(distinct session)   from page_hits where created_at >= now() - interval '7 days'),
    'views_30d',      (select count(*)                  from page_hits where created_at >= now() - interval '30 days'),
    'visitors_30d',   (select count(distinct session)   from page_hits where created_at >= now() - interval '30 days'),
    'views_total',    (select count(*)                  from page_hits),
    'visitors_total', (select count(distinct session)   from page_hits)
  );
$$;
