import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// ── Onderhoudsmodus (winkel tijdelijk offline) ───────────────────────────────
// Standaard AAN. Zet in Vercel de env-variabele MAINTENANCE_MODE=0 om de winkel
// weer live te zetten (of =1 om 'm weer offline te halen). De env wint van de
// standaardwaarde hieronder.
const MAINTENANCE_DEFAULT = true;
function maintenanceOn() {
  const v = process.env.MAINTENANCE_MODE;
  return v != null && v !== '' ? v === '1' : MAINTENANCE_DEFAULT;
}

const MAINTENANCE_HTML = `<!doctype html>
<html lang="nl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Vami Pro — even offline</title>
<style>
  html,body{height:100%;margin:0}
  body{background:#0a0a0a;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;
       display:flex;align-items:center;justify-content:center;text-align:center;padding:24px}
  .box{max-width:460px}
  .logo{font-size:30px;font-weight:800;letter-spacing:3px}
  .logo span{color:#4f8cff}
  h1{font-size:22px;font-weight:600;margin:26px 0 10px}
  p{color:#a1a1aa;line-height:1.6;margin:0 auto;max-width:380px}
  .foot{margin-top:34px;color:#5b5b63;font-size:12px}
</style></head>
<body><div class="box">
  <div class="logo">VAMI<span>.</span>PRO</div>
  <h1>We zijn zo weer terug</h1>
  <p>De webshop is even offline voor onderhoud. Bedankt voor je geduld — kom snel weer langs!</p>
  <div class="foot">Vami Pro &middot; Kroonstraat 33, 4879 AV Etten-Leur</div>
</div></body></html>`;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Onderhoudsmodus: publieke winkel offline, maar /admin en /api (o.a. de
  // Mollie-webhook, zodat lopende betalingen blijven werken) blijven bereikbaar.
  if (maintenanceOn() && !pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
    return new NextResponse(MAINTENANCE_HTML, {
      status: 503,
      headers: { 'content-type': 'text/html; charset=utf-8', 'retry-after': '3600', 'cache-control': 'no-store' },
    });
  }

  // Admin-beveiliging: alleen ingelogd + e-mail gelijk aan ADMIN_EMAIL.
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') return NextResponse.next();

    const response = NextResponse.next({ request });
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (list: { name: string; value: string; options?: any }[]) =>
            list.forEach(({ name, value, options }) => response.cookies.set(name, value, options)),
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    if (!user || user.email?.toLowerCase() !== adminEmail) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  // Draai op alle paden behalve Next-static, afbeeldingen en bestanden met extensie.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.).*)'],
};
