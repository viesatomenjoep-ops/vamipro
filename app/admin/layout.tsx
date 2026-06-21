import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, FileText, Settings } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const nav = [
  ['/admin', 'Dashboard', LayoutDashboard],
  ['/admin/bestellingen', 'Bestellingen', ShoppingCart],
  ['/admin/producten', 'Producten', Package],
  ['/admin/categorieen', 'Categorieën', Package],
  ['/admin/facturen', 'Facturen', FileText],
] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient();
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user || user.email !== process.env.ADMIN_EMAIL) redirect('/admin/login');

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-bg text-fg overflow-x-hidden">
      <aside className="w-full md:w-60 shrink-0 border-b md:border-b-0 md:border-r hairline bg-panel p-4 md:p-5">
        <p className="font-display text-lg font-semibold hidden md:block">VAMI<span className="text-accent">.</span>PRO</p>
        <p className="mb-8 text-xs uppercase tracking-[0.2em] text-fg-faint hidden md:block">Admin</p>
        <nav className="flex flex-row md:flex-col gap-2 md:gap-1 text-sm overflow-x-auto pb-2 md:pb-0 scrollbar-hide flex-1">
          {nav.map(([href, label, Icon]) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 md:gap-4 rounded-md px-3 py-3 text-fg-muted transition-colors hover:bg-panel-2 hover:text-fg whitespace-nowrap">
              <Icon size={28} strokeWidth={1.5} className="shrink-0" /> <span className="hidden sm:inline md:block text-base font-medium">{label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-8 hidden md:block">
          <ThemeToggle />
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-10 max-w-full overflow-x-hidden">{children}</main>
    </div>
  );
}
