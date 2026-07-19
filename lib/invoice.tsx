import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { createServiceClient } from '@/lib/supabase/server';

const euro = (c: number) => `€ ${(c / 100).toFixed(2).replace('.', ',')}`;

const INK = '#141414';
const MUTED = '#6b6b6b';
const LINE = '#e5e5e5';
const ACCENT = '#b8863b';

const styles = StyleSheet.create({
  page: { padding: 44, fontSize: 10, fontFamily: 'Helvetica', color: INK, lineHeight: 1.4 },

  topbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  brand: { fontSize: 24, fontFamily: 'Helvetica-Bold', letterSpacing: 2 },
  brandSub: { fontSize: 8, color: MUTED, marginTop: 2, letterSpacing: 1 },

  invBox: { alignItems: 'flex-end' },
  invTitle: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: ACCENT },
  metaRow: { flexDirection: 'row', marginTop: 3 },
  metaLabel: { color: MUTED, width: 60, textAlign: 'right', marginRight: 8 },

  rule: { height: 2, backgroundColor: ACCENT, marginTop: 14, marginBottom: 20 },

  cols: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  colLabel: { fontSize: 8, color: MUTED, letterSpacing: 1, marginBottom: 4, textTransform: 'uppercase' },
  strong: { fontFamily: 'Helvetica-Bold' },

  thead: { flexDirection: 'row', backgroundColor: '#f4f2ee', paddingVertical: 6, paddingHorizontal: 8, borderRadius: 2 },
  th: { fontSize: 8, color: MUTED, letterSpacing: 0.5, textTransform: 'uppercase' },
  row: { flexDirection: 'row', paddingVertical: 7, paddingHorizontal: 8, borderBottom: `1 solid ${LINE}` },
  cell: { flex: 1 },
  cellR: { flex: 1, textAlign: 'right' },

  totals: { marginTop: 18, alignSelf: 'flex-end', width: 240 },
  tRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  tGrand: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, marginTop: 4, borderTop: `2 solid ${INK}` },
  tGrandTxt: { fontSize: 13, fontFamily: 'Helvetica-Bold' },

  paidBadge: { marginTop: 22, alignSelf: 'flex-start', color: '#1a7f4b', fontFamily: 'Helvetica-Bold', fontSize: 11 },

  footer: { position: 'absolute', bottom: 32, left: 44, right: 44, borderTop: `1 solid ${LINE}`, paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between' },
  footTxt: { fontSize: 8, color: MUTED },
});

function InvoiceDoc({ order, items, invoiceNumber }: any) {
  const customer = order.bill_company ?? `${order.ship_first_name} ${order.ship_last_name}`;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.topbar}>
          <View>
            <Text style={styles.brand}>VAMIPRO</Text>
            <Text style={styles.brandSub}>PROFESSIONELE DETAILINGPRODUCTEN</Text>
          </View>
          <View style={styles.invBox}>
            <Text style={styles.invTitle}>FACTUUR</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Factuurnr.</Text>
              <Text style={styles.strong}>{invoiceNumber}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Order</Text>
              <Text>{order.order_number}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Datum</Text>
              <Text>{new Date().toLocaleDateString('nl-NL')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.rule} />

        {/* Van / Aan */}
        <View style={styles.cols}>
          <View style={{ maxWidth: 240 }}>
            <Text style={styles.colLabel}>Van</Text>
            <Text style={styles.strong}>Vami Pro</Text>
            <Text>Kroonstraat 33</Text>
            <Text>4879 AV Etten-Leur, Nederland</Text>
            <Text>info@vamipro.nl</Text>
            <Text style={{ marginTop: 4, color: MUTED }}>KVK 86797840 · BTW NL004313236B58</Text>
          </View>
          <View style={{ maxWidth: 240, alignItems: 'flex-end' }}>
            <Text style={styles.colLabel}>Factuuradres</Text>
            <Text style={styles.strong}>{customer}</Text>
            <Text>{order.ship_address} {order.ship_house_number}</Text>
            <Text>{order.ship_postal_code} {order.ship_city}</Text>
            <Text>{order.ship_country}</Text>
            {order.bill_vat_number ? <Text style={{ marginTop: 4, color: MUTED }}>BTW: {order.bill_vat_number}</Text> : null}
          </View>
        </View>

        {/* Regels */}
        <View style={styles.thead}>
          <Text style={[styles.th, { flex: 3 }]}>Product</Text>
          <Text style={[styles.th, styles.cellR]}>Aantal</Text>
          <Text style={[styles.th, styles.cellR]}>Stuk</Text>
          <Text style={[styles.th, styles.cellR]}>Totaal</Text>
        </View>
        {items.map((it: any, i: number) => (
          <View style={styles.row} key={i}>
            <Text style={[styles.cell, { flex: 3 }]}>{it.product_name}</Text>
            <Text style={styles.cellR}>{it.quantity}</Text>
            <Text style={styles.cellR}>{euro(it.unit_price_cents)}</Text>
            <Text style={styles.cellR}>{euro(it.line_total_cents)}</Text>
          </View>
        ))}

        {/* Totalen */}
        <View style={styles.totals}>
          <View style={styles.tRow}><Text style={{ color: MUTED }}>Subtotaal</Text><Text>{euro(order.subtotal_cents)}</Text></View>
          <View style={styles.tRow}><Text style={{ color: MUTED }}>Verzendkosten</Text><Text>{euro(order.shipping_cents)}</Text></View>
          <View style={styles.tRow}><Text style={{ color: MUTED }}>waarvan btw 21%</Text><Text>{euro(order.vat_cents)}</Text></View>
          <View style={styles.tGrand}><Text style={styles.tGrandTxt}>Totaal</Text><Text style={styles.tGrandTxt}>{euro(order.total_cents)}</Text></View>
        </View>

        <Text style={styles.paidBadge}>● Betaald via {order.payment_method}</Text>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footTxt}>Vami Pro · Kroonstraat 33, 4879 AV Etten-Leur</Text>
          <Text style={styles.footTxt}>KVK 86797840 · BTW NL004313236B58 · IBAN {/* {{IBAN}} */}NL86 RABO 0176 0635 95</Text>
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
