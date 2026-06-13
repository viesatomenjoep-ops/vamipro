import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation(order: any, invoiceUrl: string) {
  await resend.emails.send({
    from: 'Vami Pro <orders@vamipro.nl>',
    to: order.ship_email,
    subject: `Bevestiging bestelling ${order.order_number}`,
    html: `<h2>Bedankt voor je bestelling!</h2>
      <p>Je bestelling <b>${order.order_number}</b> is betaald en wordt verwerkt.</p>
      <p>Je factuur: <a href="${invoiceUrl}">download hier</a></p>
      <p>Je ontvangt een track &amp; trace-link zodra je pakket is verzonden.</p>
      <p>— Vami Pro</p>`,
  });
}
