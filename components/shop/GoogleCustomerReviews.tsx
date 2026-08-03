'use client';

import { useEffect } from 'react';

// Google Klantenreviews opt-in op de bevestigingspagina. Laadt het officiële
// Google-fragment en toont de toestemmingsvraag voor een review na levering.
export default function GoogleCustomerReviews({
  merchantId,
  orderId,
  email,
  deliveryCountry,
  estimatedDeliveryDate,
}: {
  merchantId: number;
  orderId: string;
  email: string;
  deliveryCountry: string;
  estimatedDeliveryDate: string;
}) {
  useEffect(() => {
    if (!orderId || !email) return;

    (window as any).renderOptIn = function () {
      (window as any).gapi.load('surveyoptin', function () {
        (window as any).gapi.surveyoptin.render({
          merchant_id: merchantId,
          order_id: orderId,
          email,
          delivery_country: deliveryCountry,
          estimated_delivery_date: estimatedDeliveryDate,
        });
      });
    };

    // Fragment één keer injecteren; roept via ?onload=renderOptIn bovenstaande functie aan.
    const existing = document.getElementById('gcr-platform');
    if (!existing) {
      const s = document.createElement('script');
      s.id = 'gcr-platform';
      s.src = 'https://apis.google.com/js/platform.js?onload=renderOptIn';
      s.async = true;
      s.defer = true;
      document.body.appendChild(s);
    } else if ((window as any).gapi) {
      (window as any).renderOptIn();
    }
  }, [merchantId, orderId, email, deliveryCountry, estimatedDeliveryDate]);

  return null;
}
