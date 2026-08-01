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

-- Per dag: paginaweergaven + unieke bezoekers over de laatste N dagen
-- (inclusief lege dagen, in Nederlandse tijd). Voor de grafiek.
create or replace function visit_daily(days int default 30)
returns table(day date, views bigint, visitors bigint)
language sql stable as $$
  select d::date as day,
         count(h.id) as views,
         count(distinct h.session) as visitors
  from generate_series(
         (now() at time zone 'Europe/Amsterdam')::date - (days - 1),
         (now() at time zone 'Europe/Amsterdam')::date,
         interval '1 day'
       ) d
  left join page_hits h
    on (h.created_at at time zone 'Europe/Amsterdam')::date = d::date
  group by d
  order by d;
$$;

-- Best bezochte pagina's over de laatste N dagen.
create or replace function visit_top_pages(days int default 30, lim int default 12)
returns table(path text, views bigint, visitors bigint)
language sql stable as $$
  select path,
         count(*) as views,
         count(distinct session) as visitors
  from page_hits
  where created_at >= now() - (days || ' days')::interval
  group by path
  order by views desc
  limit lim;
$$;
