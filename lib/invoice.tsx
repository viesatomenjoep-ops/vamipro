import { Document, Page, Text, View, Image, StyleSheet, pdf } from '@react-pdf/renderer';
import { createServiceClient } from '@/lib/supabase/server';
import { LOGO_DATA_URI } from '@/lib/logo';

const euro = (c: number) => `€ ${(c / 100).toFixed(2).replace('.', ',')}`;

// Palet — afgestemd op het blauw/zilver van het Vami Pro logo
const INK = '#12151c';
const MUTED = '#6b7280';
const FAINT = '#9aa1ac';
const LINE = '#e6e8ec';
const ACCENT = '#2f54eb';
const ACCENT_SOFT = '#eef2ff';

const styles = StyleSheet.create({
  page: { paddingTop: 40, paddingBottom: 70, paddingHorizontal: 44, fontSize: 9.5, fontFamily: 'Helvetica', color: INK, lineHeight: 1.45 },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  logo: { width: 122, height: 80, objectFit: 'contain' },
  invBlock: { alignItems: 'flex-end' },
  invTitle: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: ACCENT, letterSpacing: 1 },
  metaTable: { marginTop: 8 },
  metaRow: { flexDirection: 'row', marginTop: 2 },
  metaLabel: { color: MUTED, width: 78, textAlign: 'right', marginRight: 10 },
  metaVal: { fontFamily: 'Helvetica-Bold', minWidth: 90, textAlign: 'right' },

  rule: { height: 2, backgroundColor: ACCENT, marginTop: 6, marginBottom: 22 },

  // Adresblokken
  parties: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 26 },
  party: { width: '48%' },
  partyRight: { width: '48%', alignItems: 'flex-end' },
  label: { fontSize: 7.5, color: FAINT, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 5 },
  name: { fontFamily: 'Helvetica-Bold', fontSize: 11, marginBottom: 1 },
  faint: { color: MUTED },

  // Tabel
  thead: { flexDirection: 'row', backgroundColor: ACCENT_SOFT, paddingVertical: 7, paddingHorizontal: 9, borderRadius: 3 },
  th: { fontSize: 7.5, color: ACCENT, letterSpacing: 0.6, textTransform: 'uppercase', fontFamily: 'Helvetica-Bold' },
  trow: { flexDirection: 'row', paddingVertical: 9, paddingHorizontal: 9, borderBottom: `1 solid ${LINE}` },
  cDesc: { flex: 4 },
  cQty: { flex: 1.1, textAlign: 'right' },
  cUnit: { flex: 1.5, textAlign: 'right' },
  cVat: { flex: 1, textAlign: 'right' },
  cTot: { flex: 1.6, textAlign: 'right' },
  sku: { fontSize: 7.5, color: FAINT, marginTop: 1 },

  // Totalen
  totalsWrap: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 },
  totals: { width: 250 },
  tRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  tGrand: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9, paddingHorizontal: 10, marginTop: 6, backgroundColor: INK, borderRadius: 4 },
  tGrandTxt: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#ffffff' },
  tVat: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3, marginTop: 2 },

  // Betaalstatus
  paidRow: { flexDirection: 'row', alignItems: 'center', marginTop: 26, gap: 8 },
  paidBadge: { backgroundColor: '#e7f6ee', color: '#137a48', fontFamily: 'Helvetica-Bold', fontSize: 9, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  paidNote: { color: MUTED, fontSize: 9 },

  thanks: { marginTop: 22, fontSize: 10, color: INK },

  // Footer
  footer: { position: 'absolute', bottom: 30, left: 44, right: 44, borderTop: `1 solid ${LINE}`, paddingTop: 10 },
  footRow: { flexDirection: 'row', justifyContent: 'space-between' },
  footTxt: { fontSize: 7.5, color: FAINT },
});

function InvoiceDoc({ order, items, invoiceNumber }: any) {
  const customer = order.bill_company ?? `${order.ship_first_name} ${order.ship_last_name}`;
  const invoiceDate = new Date(order.paid_at ?? Date.now()).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  const method = (order.payment_method ?? '').toString();
  const methodLabel = method ? method.charAt(0).toUpperCase() + method.slice(1) : 'online';

  return (
    <Document title={`Factuur ${invoiceNumber}`} author="Vami Pro">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image style={styles.logo} src={LOGO_DATA_URI} />
          <View style={styles.invBlock}>
            <Text style={styles.invTitle}>FACTUUR</Text>
            <View style={styles.metaTable}>
              <View style={styles.metaRow}><Text style={styles.metaLabel}>Factuurnummer</Text><Text style={styles.metaVal}>{invoiceNumber}</Text></View>
              <View style={styles.metaRow}><Text style={styles.metaLabel}>Factuurdatum</Text><Text style={styles.metaVal}>{invoiceDate}</Text></View>
              <View style={styles.metaRow}><Text style={styles.metaLabel}>Ordernummer</Text><Text style={styles.metaVal}>{order.order_number}</Text></View>
            </View>
          </View>
        </View>

        <View style={styles.rule} />

        {/* Afzender / Factuuradres */}
        <View style={styles.parties}>
          <View style={styles.party}>
            <Text style={styles.label}>Afzender</Text>
            <Text style={styles.name}>Vami Pro</Text>
            <Text>Kroonstraat 33</Text>
            <Text>4879 AV Etten-Leur, Nederland</Text>
            <Text style={styles.faint}>info@vamipro.nl</Text>
            <Text style={[styles.faint, { marginTop: 4 }]}>KVK 86797840</Text>
            <Text style={styles.faint}>BTW NL004313236B58</Text>
          </View>
          <View style={styles.partyRight}>
            <Text style={styles.label}>Factuur aan</Text>
            <Text style={styles.name}>{customer}</Text>
            {order.bill_company ? <Text>t.a.v. {order.ship_first_name} {order.ship_last_name}</Text> : null}
            <Text>{order.ship_address} {order.ship_house_number}{order.ship_addition ? ` ${order.ship_addition}` : ''}</Text>
            <Text>{order.ship_postal_code} {order.ship_city}</Text>
            <Text>{order.ship_country === 'BE' ? 'België' : 'Nederland'}</Text>
            {order.ship_email ? <Text style={[styles.faint, { marginTop: 4 }]}>{order.ship_email}</Text> : null}
            {order.bill_vat_number ? <Text style={styles.faint}>BTW: {order.bill_vat_number}</Text> : null}
          </View>
        </View>

        {/* Regels */}
        <View style={styles.thead}>
          <Text style={[styles.th, styles.cDesc]}>Omschrijving</Text>
          <Text style={[styles.th, styles.cQty]}>Aantal</Text>
          <Text style={[styles.th, styles.cUnit]}>Stuksprijs</Text>
          <Text style={[styles.th, styles.cVat]}>Btw</Text>
          <Text style={[styles.th, styles.cTot]}>Bedrag</Text>
        </View>
        {items.map((it: any, i: number) => (
          <View style={styles.trow} key={i}>
            <View style={styles.cDesc}>
              <Text>{it.product_name}</Text>
              {it.sku ? <Text style={styles.sku}>Art.nr. {it.sku}</Text> : null}
            </View>
            <Text style={styles.cQty}>{it.quantity}</Text>
            <Text style={styles.cUnit}>{euro(it.unit_price_cents)}</Text>
            <Text style={styles.cVat}>{Math.round(Number(it.vat_rate ?? 21))}%</Text>
            <Text style={styles.cTot}>{euro(it.line_total_cents)}</Text>
          </View>
        ))}

        {/* Totalen */}
        <View style={styles.totalsWrap}>
          <View style={styles.totals}>
            <View style={styles.tRow}><Text style={styles.faint}>Subtotaal producten</Text><Text>{euro(order.subtotal_cents)}</Text></View>
            <View style={styles.tRow}><Text style={styles.faint}>Verzendkosten</Text><Text>{order.shipping_cents === 0 ? 'Gratis' : euro(order.shipping_cents)}</Text></View>
            <View style={styles.tGrand}><Text style={styles.tGrandTxt}>Totaal (incl. btw)</Text><Text style={styles.tGrandTxt}>{euro(order.total_cents)}</Text></View>
            <View style={styles.tVat}><Text style={styles.faint}>Waarvan btw 21%</Text><Text style={styles.faint}>{euro(order.vat_cents)}</Text></View>
          </View>
        </View>

        {/* Betaalstatus */}
        <View style={styles.paidRow}>
          <Text style={styles.paidBadge}>BETAALD</Text>
          <Text style={styles.paidNote}>Voldaan via {methodLabel} op {invoiceDate}. Dit bedrag hoeft niet meer te worden overgemaakt.</Text>
        </View>

        <Text style={styles.thanks}>Bedankt voor je bestelling bij Vami Pro!</Text>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <View style={styles.footRow}>
            <Text style={styles.footTxt}>Vami Pro · Kroonstraat 33, 4879 AV Etten-Leur · info@vamipro.nl</Text>
            <Text style={styles.footTxt}>KVK 86797840 · BTW NL004313236B58</Text>
          </View>
          <View style={[styles.footRow, { marginTop: 2 }]}>
            <Text style={styles.footTxt}>IBAN NL86 RABO 0176 0635 95 · t.n.v. Vami Pro</Text>
            <Text style={styles.footTxt}>Factuur {invoiceNumber}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export async function generateInvoice(order: any, items: any[], invoiceNumber: string) {
  const blob = await pdf(<InvoiceDoc order={order} items={items} invoiceNumber={invoiceNumber} />).toBlob();
  const buffer = Buffer.from(await blob.arrayBuffer());
  const supabase = createServiceClient();
  const path = `${invoiceNumber}.pdf`;
  await supabase.storage.from('invoices').upload(path, buffer, {
    contentType: 'application/pdf', upsert: true,
  });
  const { data } = await supabase.storage.from('invoices').createSignedUrl(path, 60 * 60 * 24 * 365);
  return { url: data?.signedUrl ?? path, buffer };
}
