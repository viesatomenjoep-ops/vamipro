'use client';

import { useEffect } from 'react';

// Google Merchant-badge (winkelbeoordeling van Google Klantenreviews). Wordt
// site-breed geladen; Google toont zelf de zwevende badge zodra er voldoende
// reviews zijn. merchant_id komt uit Merchant Center.
const MERCHANT_ID = 5833555990;

export default function MerchantWidget() {
  useEffect(() => {
    if (document.getElementById('merchantWidgetScript')) return;

    const s = document.createElement('script');
    s.id = 'merchantWidgetScript';
    s.src = 'https://www.gstatic.com/shopping/merchant/merchantwidget.js';
    s.defer = true;
    s.addEventListener('load', function () {
      try {
        (window as any).merchantwidget?.start({ merchant_id: MERCHANT_ID });
      } catch { /* stil negeren */ }
    });
    document.body.appendChild(s);
  }, []);

  return null;
}
