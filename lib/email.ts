import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

// Adres waar de eigenaar een kopie van elke bestelling + factuur ontvangt.
const OWNER_EMAIL = process.env.ORDER_NOTIFY_EMAIL ?? 'Vamipro2@gmail.com';

const euro = (c: number) => `€ ${(c / 100).toFixed(2).replace('.', ',')}`;

function confirmationHtml(order: any, invoiceUrl: string) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#141414">
    <div style="background:#141414;padding:24px 28px">
      <span style="color:#fff;font-size:22px;font-weight:bold;letter-spacing:2px">VAMIPRO</span>
    </div>
    <div style="padding:28px">
      <h2 style="margin:0 0 8px">Bedankt voor je bestelling!</h2>
      <p style="color:#555;margin:0 0 20px">
        Je bestelling <b>${order.order_number}</b> is betaald en wordt verwerkt.
      </p>
      <div style="border:1px solid #eee;border-radius:6px;padding:16px 18px;margin-bottom:20px">
        <div style="display:flex;justify-content:space-between;font-size:15px">
          <span style="color:#666">Totaalbedrag</span>
          <b>${euro(order.total_cents)}</b>
        </div>
      </div>
      <a href="${invoiceUrl}" style="display:inline-block;background:#b8863b;color:#fff;text-decoration:none;padding:11px 22px;border-radius:6px;font-weight:bold">
        Download je factuur
      </a>
      <p style="color:#888;font-size:13px;margin-top:14px">Je factuur zit ook als bijlage bij deze e-mail.</p>
      <p style="color:#555;margin-top:24px">Je ontvangt een track &amp; trace-link zodra je pakket is verzonden.</p>
      <p style="color:#141414;margin-top:24px">— Vami Pro</p>
    </div>
    <div style="border-top:1px solid #eee;padding:16px 28px;color:#999;font-size:12px">
      Vami Pro · Kroonstraat 33, 4879 AV Etten-Leur · KVK 86797840 · BTW NL004313236B58
    </div>
  </div>`;
}

export async function sendOrderConfirmation(
  order: any,
  invoiceUrl: string,
  pdfBuffer?: Buffer,
  invoiceNumber?: string,
) {
  const attachments = pdfBuffer
    ? [{ filename: `factuur-${invoiceNumber ?? order.order_number}.pdf`, content: pdfBuffer }]
    : undefined;

  await resend.emails.send({
    from: 'Vami Pro <orders@vamipro.nl>',
    to: order.ship_email,
    bcc: OWNER_EMAIL,
    replyTo: 'info@vamipro.nl',
    subject: `Bevestiging bestelling ${order.order_number}`,
    html: confirmationHtml(order, invoiceUrl),
    attachments,
  });
}
