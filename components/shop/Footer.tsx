import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';

export default async function Footer() {
  const supabase = createServiceClient();
  const { data: categories } = await supabase.from('categories').select('*').is('parent_id', null).order('sort_order');

  return (
    <footer className="mt-24 border-t hairline">
      <div className="gloss-line" />
      <div className="wrap grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <img src="/images/logo.jpeg" alt="VaMiPro Logo" className="h-14 w-auto mb-2" />
          <p className="mt-3 max-w-xs text-sm text-fg-muted">
            Professionele detailingproducten voor een showroomresultaat. Geleverd in NL en BE.
          </p>
        </div>
        <div>
          <p className="eyebrow mb-4">Shop</p>
          <ul className="space-y-2 text-sm text-fg-muted">
            <li><Link href="/producten" className="hover:text-accent">Alle producten</Link></li>
            {categories?.map(c => (
              <li key={c.id}><Link href={`/categorie/${c.slug}`} className="hover:text-accent">{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-4">Service</p>
          <ul className="space-y-2 text-sm text-fg-muted">
            <li><Link href="/verzending" className="hover:text-accent">Verzending</Link></li>
            <li><Link href="/retourneren" className="hover:text-accent">Retourneren</Link></li>
            <li><Link href="/voorwaarden" className="hover:text-accent">Algemene voorwaarden</Link></li>
            <li><Link href="/privacy" className="hover:text-accent">Privacy</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-4">Vami Pro</p>
          <ul className="space-y-1 text-sm text-fg-muted">
            <li>{/* {{ADRES}} */}Adres invullen</li>
            <li>KVK {/* {{KVK}} */}________</li>
            <li>BTW {/* {{BTW_NL}} */}________</li>
            <li>{/* {{EMAIL}} */}info@vamipro.nl</li>
          </ul>
        </div>
      </div>
      <div className="wrap flex flex-col items-center justify-between gap-3 border-t hairline py-6 text-xs text-fg-faint sm:flex-row">
        <span>© {new Date().getFullYear()} Vami Pro. Alle rechten voorbehouden.</span>
        <span className="flex items-center gap-3">
          <span>Veilig betalen met</span>
          <span className="rounded border hairline px-2 py-1 font-display text-[11px] text-fg-muted">iDEAL</span>
          <span className="rounded border hairline px-2 py-1 font-display text-[11px] text-fg-muted">Bancontact</span>
        </span>
      </div>
    </footer>
  );
}
