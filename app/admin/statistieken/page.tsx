import { createServiceClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const nf = (n: any) => Number(n ?? 0).toLocaleString('nl-NL');
const dayLabel = (d: string) => new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });

export default async function StatsPage() {
  const supabase = createServiceClient();

  let summary: any = null;
  let daily: any[] = [];
  let topPages: any[] = [];
  let summaryReady = true;
  let detailReady = true; // visit_daily + visit_top_pages (uit de bijgewerkte migratie)
  try {
    const [s, d, t] = await Promise.all([
      supabase.rpc('visit_stats'),
      supabase.rpc('visit_daily', { days: 30 }),
      supabase.rpc('visit_top_pages', { days: 30, lim: 12 }),
    ]);
    if (s.error || !s.data) summaryReady = false;
    if (d.error || t.error) detailReady = false;
    summary = s.data ?? null;
    daily = d.data ?? [];
    topPages = t.data ?? [];
  } catch {
    summaryReady = false;
    detailReady = false;
  }

  if (!summaryReady) {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-1">Statistieken</h1>
        <p className="text-fg-muted text-sm">De bezoekersteller is nog niet geactiveerd.</p>
        <div className="card mt-6 p-5 text-sm text-fg-muted">
          Voer eenmalig <code className="text-fg">supabase/analytics.sql</code> uit in de Supabase SQL-editor.
          Daarna verschijnen hier de bezoekersaantallen, een grafiek per dag en de best bezochte pagina&apos;s.
        </div>
      </div>
    );
  }

  const maxViews = Math.max(1, ...daily.map((r) => Number(r.views || 0)));

  return (
    <div className="space-y-10">
      <div>
        <p className="eyebrow">Overzicht</p>
        <h1 className="h-section mt-2">Statistieken</h1>
      </div>

      {/* Samenvatting */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          ['Vandaag', summary?.visitors_today, summary?.views_today],
          ['7 dagen', summary?.visitors_7d, summary?.views_7d],
          ['30 dagen', summary?.visitors_30d, summary?.views_30d],
          ['Totaal', summary?.visitors_total, summary?.views_total],
        ].map(([label, v, pv]) => (
          <div key={label as string} className="card p-5">
            <p className="text-xs uppercase tracking-wide text-fg-faint">{label as string}</p>
            <p className="mt-1 font-display text-2xl font-semibold">{nf(v)}</p>
            <p className="text-xs text-fg-muted">{nf(pv)} weergaven</p>
          </div>
        ))}
      </div>

      {/* Grafiek per dag (laatste 30 dagen) */}
      <section className="card p-5">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display font-semibold">Bezoek per dag</h2>
          <span className="text-xs text-fg-faint">laatste 30 dagen · paginaweergaven</span>
        </div>
        {!detailReady ? (
          <p className="mt-3 text-sm text-fg-muted">
            Voer de <b>bijgewerkte</b> <code className="text-fg">supabase/analytics.sql</code> nog één keer uit om de grafiek en top-pagina&apos;s te activeren (voegt <code className="text-fg">visit_daily</code> en <code className="text-fg">visit_top_pages</code> toe).
          </p>
        ) : (
        <>
        <div className="mt-6 flex h-44 items-end gap-1">
          {daily.map((r) => {
            const views = Number(r.views || 0);
            const h = Math.round((views / maxViews) * 100);
            return (
              <div key={r.day} className="group relative flex flex-1 flex-col items-center justify-end">
                <div
                  className="w-full rounded-t-sm bg-accent/70 transition-colors group-hover:bg-accent"
                  style={{ height: `${Math.max(2, h)}%` }}
                />
                {/* Tooltip */}
                <div className="pointer-events-none absolute bottom-full mb-1 hidden whitespace-nowrap rounded bg-black/85 px-2 py-1 text-[11px] text-white group-hover:block">
                  {dayLabel(r.day)}: {nf(views)} weergaven · {nf(r.visitors)} bezoekers
                </div>
              </div>
            );
          })}
        </div>
        {/* As-labels (begin / midden / eind) */}
        <div className="mt-2 flex justify-between text-[10px] text-fg-faint">
          <span>{daily[0] ? dayLabel(daily[0].day) : ''}</span>
          <span>{daily[Math.floor(daily.length / 2)] ? dayLabel(daily[Math.floor(daily.length / 2)].day) : ''}</span>
          <span>{daily[daily.length - 1] ? dayLabel(daily[daily.length - 1].day) : ''}</span>
        </div>
        </>
        )}
      </section>

      {/* Best bezochte pagina's */}
      <section className="card overflow-x-auto">
        <div className="border-b hairline p-5"><h2 className="font-display font-semibold">Best bezochte pagina&apos;s <span className="text-xs font-normal text-fg-faint">(30 dagen)</span></h2></div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-fg-faint">
              <th className="p-4 font-normal">Pagina</th>
              <th className="p-4 font-normal text-right">Weergaven</th>
              <th className="p-4 font-normal text-right">Bezoekers</th>
            </tr>
          </thead>
          <tbody>
            {topPages.length ? topPages.map((r) => (
              <tr key={r.path} className="border-t hairline">
                <td className="p-4 font-display max-w-[280px] truncate">{r.path || '/'}</td>
                <td className="p-4 text-right">{nf(r.views)}</td>
                <td className="p-4 text-right text-fg-muted">{nf(r.visitors)}</td>
              </tr>
            )) : (
              <tr><td colSpan={3} className="p-6 text-center text-fg-muted">{detailReady ? 'Nog geen bezoeken geregistreerd.' : 'Voer de bijgewerkte analytics.sql nog één keer uit om deze lijst te activeren.'}</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
