import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, FileText, Settings } from 'lucide-react';

const nav = [
  ['/admin', 'Dashboard', LayoutDashboard],
  ['/admin/bestellingen', 'Bestellingen', ShoppingCart],
  ['/admin/producten', 'Producten', Package],
  ['/admin/categorieen', 'Categorieën', Package],
  ['/admin/facturen', 'Facturen', FileText],
  ['/admin/instellingen', 'Instellingen', Settings],
] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient();
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user || user.email !== process.env.ADMIN_EMAIL) redirect('/admin/login');

  return (
    <div className="flex min-h-screen bg-bg text-fg">
      <aside className="w-60 shrink-0 border-r hairline bg-panel p-5">
        <p className="font-display text-lg font-semibold">VAMI<span className="text-accent">.</span>PRO</p>
        <p className="mb-8 text-xs uppercase tracking-[0.2em] text-fg-faint">Admin</p>
        <nav className="flex flex-col gap-1 text-sm">
          {nav.map(([href, label, Icon]) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-fg-muted transition-colors hover:bg-panel-2 hover:text-fg">
              <Icon size={17} strokeWidth={1.6} /> {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
