import nodemailer from 'nodemailer';
import { SITE_URL } from './site-url';
import { getContent } from './content';

// Mails worden verstuurd vanaf je Gmail-account (Vamipro2@gmail.com).
// GMAIL_USER = het volledige gmail-adres, GMAIL_APP_PASSWORD = een Google "app-wachtwoord" (niet je gewone wachtwoord).
const GMAIL_USER = process.env.GMAIL_USER ?? 'Vamipro2@gmail.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
});

const euro = (c: number) => `€ ${(c / 100).toFixed(2).replace('.', ',')}`;

const BRAND = '#141414';
const ACCENT = '#b8863b';

// E-mailveilige opmaak (tabellen i.p.v. flexbox — flex werkt niet in Gmail/Outlook).
// Vaste, nette breedte van 600px die op mobiel de volledige breedte gebruikt.
function emailShell(inner: string) {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f4f6;margin:0;padding:24px 12px;font-family:Arial,Helvetica,sans-serif">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #ececec">
          <tr>
            <td style="background:${BRAND};padding:20px 32px">
              <img src="${SITE_URL}/images/logo.png" alt="Vami Pro" height="46" style="height:46px;width:auto;display:block;border:0;outline:none;text-decoration:none" />
            </td>
          </tr>
          <tr>
            <td style="padding:32px">
              ${inner}
            </td>
          </tr>
          <tr>
            <td style="border-top:1px solid #eeeeee;padding:18px 32px;color:#999999;font-size:12px;line-height:1.5">
              Vami Pro &middot; Kroonstraat 33, 4879 AV Etten-Leur &middot; KVK 86797840 &middot; BTW NL004313236B58
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

// Knop die betrouwbaar rendert in e-mailclients (achtergrond op de <td>).
function emailButton(href: string, label: string) {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0">
    <tr>
      <td align="center" style="background:${ACCENT};border-radius:8px">
        <a href="${href}" style="display:inline-block;padding:13px 28px;color:#ffffff;text-decoration:none;font-weight:bold;font-size:15px">${label}</a>
      </td>
    </tr>
  </table>`;
}

// Bestelde producten + samenvatting (subtotaal, korting, verzending, totaal).
function orderSummaryHtml(order: any, items: any[]) {
  const rows = (items ?? []).map((it) => `
    <tr>
      <td style="padding:7px 0;font-size:14px;color:#333333;line-height:1.4">${it.quantity}&times; ${it.product_name}</td>
      <td align="right" style="padding:7px 0;font-size:14px;color:#333333;white-space:nowrap">${euro(it.line_total_cents)}</td>
    </tr>`).join('');

  const subtotal = order.subtotal_cents ?? 0;
  const shipping = order.shipping_cents ?? 0;
  const total = order.total_cents ?? 0;
  const discount = Math.max(0, subtotal + shipping - total);

  const sumLine = (label: string, value: string, o: { bold?: boolean; accent?: boolean } = {}) => `
    <tr>
      <td style="padding:5px 0;font-size:${o.bold ? '15px' : '14px'};color:${o.bold ? BRAND : '#666666'}${o.bold ? ';font-weight:bold' : ''}">${label}</td>
      <td align="right" style="padding:5px 0;font-size:${o.bold ? '17px' : '14px'};font-weight:${o.bold ? 'bold' : 'normal'};color:${o.accent ? ACCENT : o.bold ? BRAND : '#333333'};white-space:nowrap">${value}</td>
    </tr>`;

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #eeeeee;border-radius:8px;margin:0 0 26px">
    ${rows ? `<tr><td style="padding:14px 20px 6px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>
    </td></tr>
    <tr><td style="padding:0 20px"><div style="border-top:1px solid #eeeeee;font-size:0;line-height:0">&nbsp;</div></td></tr>` : ''}
    <tr><td style="padding:8px 20px 14px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        ${sumLine('Subtotaal', euro(subtotal))}
        ${discount > 0 ? sumLine('Korting', '-' + euro(discount), { accent: true }) : ''}
        ${sumLine('Verzending', shipping === 0 ? 'Gratis' : euro(shipping))}
        ${sumLine('Totaalbedrag', euro(total), { bold: true })}
      </table>
    </td></tr>
  </table>`;
}

// Review-verzoek — alleen tonen als er een Google-review-link is ingesteld
// (Instellingen → google_review_url). Zo vraag je klanten automatisch om een review.
function reviewBlock(reviewUrl: string) {
  if (!reviewUrl) return '';
  return `
    <div style="margin:26px 0 0;border-top:1px solid #eeeeee;padding-top:24px">
      <p style="margin:0 0 8px;color:${BRAND};font-size:15px;font-weight:bold">Blij met je aankoop? &#11088;</p>
      <p style="margin:0 0 14px;color:#555555;font-size:14px;line-height:1.6">Een review op Google helpt ons enorm en kost je maar 30 seconden. Alvast bedankt!</p>
      ${emailButton(reviewUrl, 'Laat een review achter')}
    </div>`;
}

// Haalt de ingestelde Google-review-link op (leeg = geen review-blok tonen).
async function getReviewUrl(): Promise<string> {
  try {
    const t = await getContent();
    return (t('google_review_url', '') || '').trim();
  } catch {
    return '';
  }
}

function confirmationHtml(order: any, invoiceUrl: string, items: any[] = [], reviewUrl = '') {
  const inner = `
    <h1 style="margin:0 0 10px;font-size:23px;color:${BRAND}">Bedankt voor je bestelling!</h1>
    <p style="margin:0 0 24px;color:#555555;font-size:15px;line-height:1.6">
      Je bestelling <b style="color:${BRAND}">${order.order_number}</b> is betaald en wordt verwerkt.
    </p>

    ${orderSummaryHtml(order, items)}

    ${emailButton(invoiceUrl, 'Download je factuur')}
    <p style="color:#888888;font-size:13px;margin:14px 0 0">Je factuur zit ook als bijlage (PDF) bij deze e-mail.</p>
    <p style="color:#555555;font-size:15px;line-height:1.6;margin:26px 0 0">Je ontvangt een track &amp; trace-link zodra je pakket is verzonden.</p>
    ${reviewBlock(reviewUrl)}
    <p style="color:${BRAND};font-size:15px;margin:26px 0 0">— Vami Pro</p>`;
  return emailShell(inner);
}

function shippingHtml(order: any, reviewUrl = '') {
  const tracking = order.tracking_url
    ? `${emailButton(order.tracking_url, 'Volg je pakket')}
       <p style="color:#888888;font-size:13px;margin:14px 0 0">Trackingnummer: <b style="color:${BRAND}">${order.tracking_number ?? ''}</b></p>`
    : `<p style="color:#555555;font-size:15px">Je pakket is onderweg.</p>`;
  const inner = `
    <h1 style="margin:0 0 10px;font-size:23px;color:${BRAND}">Je pakket is onderweg! 📦</h1>
    <p style="margin:0 0 24px;color:#555555;font-size:15px;line-height:1.6">
      Goed nieuws — je bestelling <b style="color:${BRAND}">${order.order_number}</b> is verzonden.
    </p>
    ${tracking}
    ${reviewBlock(reviewUrl)}
    <p style="color:${BRAND};font-size:15px;margin:26px 0 0">— Vami Pro</p>`;
  return emailShell(inner);
}

export async function sendShippingNotification(order: any) {
  const reviewUrl = await getReviewUrl();
  await transporter.sendMail({
    from: `"Vami Pro" <${GMAIL_USER}>`,
    to: order.ship_email,
    bcc: GMAIL_USER,
    replyTo: 'info@vamipro.nl',
    subject: `Je bestelling ${order.order_number} is verzonden`,
    html: shippingHtml(order, reviewUrl),
  });
}

export async function sendOrderConfirmation(
  order: any,
  invoiceUrl: string,
  pdfBuffer?: Buffer,
  invoiceNumber?: string,
  items: any[] = [],
) {
  const attachments = pdfBuffer
    ? [{ filename: `factuur-${invoiceNumber ?? order.order_number}.pdf`, content: pdfBuffer }]
    : undefined;
  const reviewUrl = await getReviewUrl();

  await transporter.sendMail({
    from: `"Vami Pro" <${GMAIL_USER}>`,
    to: order.ship_email,
    bcc: GMAIL_USER, // kopie van elke bestelling + factuur naar jezelf
    replyTo: 'info@vamipro.nl',
    subject: `Bevestiging bestelling ${order.order_number}`,
    html: confirmationHtml(order, invoiceUrl, items, reviewUrl),
    attachments,
  });
}

// Interne mail naar Donny bij elke betaalde bestelling: pakbon (met checklist)
// + factuur als bijlage, klaar om te printen.
export async function sendOwnerPackingSlip(
  order: any,
  items: any[],
  packingBuffer: Buffer,
  invoiceBuffer?: Buffer,
  invoiceNumber?: string,
) {
  const to = process.env.ADMIN_EMAIL || GMAIL_USER;
  const attachments: any[] = [
    { filename: `pakbon-${order.order_number}.pdf`, content: packingBuffer },
  ];
  if (invoiceBuffer) attachments.push({ filename: `factuur-${invoiceNumber ?? order.order_number}.pdf`, content: invoiceBuffer });

  const inner = `
    <h1 style="margin:0 0 10px;font-size:23px;color:${BRAND}">Nieuwe bestelling — ${order.order_number}</h1>
    <p style="margin:0 0 22px;color:#555555;font-size:15px;line-height:1.6">
      Er is een nieuwe betaalde bestelling. De <b>pakbon met checklist</b> en de <b>factuur</b> zitten als PDF-bijlage — klaar om te printen.
    </p>
    ${orderSummaryHtml(order, items)}
    <p style="margin:0;color:#555555;font-size:14px;line-height:1.6">
      <b style="color:${BRAND}">Verzenden naar:</b><br/>
      ${order.ship_first_name} ${order.ship_last_name}<br/>
      ${order.ship_address} ${order.ship_house_number}${order.ship_addition ? ' ' + order.ship_addition : ''}<br/>
      ${order.ship_postal_code} ${order.ship_city}, ${order.ship_country === 'BE' ? 'België' : 'Nederland'}
    </p>`;

  await transporter.sendMail({
    from: `"Vami Pro" <${GMAIL_USER}>`,
    to,
    subject: `Nieuwe bestelling ${order.order_number} — pakbon`,
    html: emailShell(inner),
    attachments,
  });
}
