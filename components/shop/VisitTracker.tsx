'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Meldt elke paginaweergave anoniem aan bij /api/track. Gebruikt een willekeurige
// id in localStorage om unieke bezoekers te schatten — geen persoonsgegevens.
export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      let sid = localStorage.getItem('vp_sid');
      if (!sid) {
        sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
        localStorage.setItem('vp_sid', sid);
      }
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session: sid, path: pathname }),
        keepalive: true,
      }).catch(() => {});
    } catch { /* localStorage geblokkeerd → niets doen */ }
  }, [pathname]);

  return null;
}
