import nodemailer from 'nodemailer';

// Mails worden verstuurd vanaf je Gmail-account (Vamipro2@gmail.com).
// GMAIL_USER = het volledige gmail-adres, GMAIL_APP_PASSWORD = een Google "app-wachtwoord" (niet je gewone wachtwoord).
const GMAIL_USER = process.env.GMAIL_USER ?? 'Vamipro2@gmail.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
});

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

function shippingHtml(order: any) {
  const tracking = order.tracking_url
    ? `<a href="${order.tracking_url}" style="display:inline-block;background:#b8863b;color:#fff;text-decoration:none;padding:11px 22px;border-radius:6px;font-weight:bold">
         Volg je pakket
       </a>
       <p style="color:#888;font-size:13px;margin-top:14px">Trackingnummer: <b>${order.tracking_number ?? ''}</b></p>`
    : `<p style="color:#555">Je pakket is onderweg.</p>`;
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#141414">
    <div style="background:#141414;padding:24px 28px">
      <span style="color:#fff;font-size:22px;font-weight:bold;letter-spacing:2px">VAMIPRO</span>
    </div>
    <div style="padding:28px">
      <h2 style="margin:0 0 8px">Je pakket is onderweg! 📦</h2>
      <p style="color:#555;margin:0 0 20px">
        Goed nieuws — je bestelling <b>${order.order_number}</b> is verzonden.
      </p>
      ${tracking}
      <p style="color:#141414;margin-top:24px">— Vami Pro</p>
    </div>
    <div style="border-top:1px solid #eee;padding:16px 28px;color:#999;font-size:12px">
      Vami Pro · Kroonstraat 33, 4879 AV Etten-Leur · KVK 86797840 · BTW NL004313236B58
    </div>
  </div>`;
}

export async function sendShippingNotification(order: any) {
  await transporter.sendMail({
    from: `"Vami Pro" <${GMAIL_USER}>`,
    to: order.ship_email,
    bcc: GMAIL_USER,
    replyTo: 'info@vamipro.nl',
    subject: `Je bestelling ${order.order_number} is verzonden`,
    html: shippingHtml(order),
  });
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

  await transporter.sendMail({
    from: `"Vami Pro" <${GMAIL_USER}>`,
    to: order.ship_email,
    bcc: GMAIL_USER, // kopie van elke bestelling + factuur naar jezelf
    replyTo: 'info@vamipro.nl',
    subject: `Bevestiging bestelling ${order.order_number}`,
    html: confirmationHtml(order, invoiceUrl),
    attachments,
  });
}
