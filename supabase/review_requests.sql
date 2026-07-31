-- Opvolg-review-mail: voorkomt dat een klant meer dan één review-verzoek krijgt.
-- Voer dit één keer uit in de Supabase SQL-editor (project ezvwhxjhpzyszomytcgi).

alter table orders add column if not exists review_request_sent_at timestamptz;

-- Versnelt het dagelijks opzoeken van orders die nog een review-mail moeten krijgen.
create index if not exists idx_orders_review_pending
  on orders (paid_at)
  where review_request_sent_at is null;

-- Optioneel: wachttijd (in dagen) na de bestelling instelbaar maken.
-- Standaard is 4 dagen; pas dit getal aan of stel het later in via de admin.
insert into site_content (key, value)
values ('review_request_delay_days', '4')
on conflict (key) do nothing;
