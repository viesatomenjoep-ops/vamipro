import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { createServiceClient } from '@/lib/supabase/server';

const euro = (c: number) => `\u20ac ${(c / 100).toFixed(2).replace('.', ',')}`;

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  h1: { fontSize: 20 },
  row: { flexDirection: 'row', borderBottom: '1 solid #eee', paddingVertical: 4 },
  cell: { flex: 1 },
  cellR: { flex: 1, textAlign: 'right' },
  totals: { marginTop: 20, alignSelf: 'flex-end', width: 220 },
});

function InvoiceDoc({ order, items, invoiceNumber }: any) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.h1}>Vami Pro</Text>
            <Text>{/* {{ADRES}} */}Kroonstraat 33, 4879 AV Etten-Leur</Text>
            <Text>KVK: {/* {{KVK}} */}86797840  BTW: {/* {{BTW_NL}} */}NL004313236B58</Text>
            <Text>{/* {{EMAIL}} */}info@vamipro.nl</Text>
          </View>
          <View>
            <Text>Factuur {invoiceNumber}</Text>
            <Text>Order {order.order_number}</Text>
            <Text>Datum: {new Date().toLocaleDateString('nl-NL')}</Text>
          </View>
        </View>
        <Text>Factuuradres:</Text>
        <Text>{order.bill_company ?? `${order.ship_first_name} ${order.ship_last_name}`}</Text>
        <Text>{order.ship_address} {order.ship_house_number}</Text>
        <Text>{order.ship_postal_code} {order.ship_city}, {order.ship_country}</Text>
        {order.bill_vat_number ? <Text>BTW: {order.bill_vat_number}</Text> : null}
        <View style={{ marginTop: 20 }}>
          <View style={styles.row}>
            <Text style={[styles.cell, { flex: 3 }]}>Product</Text>
            <Text style={styles.cellR}>Aantal</Text>
            <Text style={styles.cellR}>Stuk</Text>
            <Text style={styles.cellR}>Totaal</Text>
          </View>
          {items.map((it: any, i: number) => (
            <View style={styles.row} key={i}>
              <Text style={[styles.cell, { flex: 3 }]}>{it.product_name}</Text>
              <Text style={styles.cellR}>{it.quantity}</Text>
              <Text style={styles.cellR}>{euro(it.unit_price_cents)}</Text>
              <Text style={styles.cellR}>{euro(it.line_total_cents)}</Text>
            </View>
          ))}
        </View>
        <View style={styles.totals}>
          <View style={styles.row}><Text style={styles.cell}>Subtotaal</Text><Text style={styles.cellR}>{euro(order.subtotal_cents)}</Text></View>
          <View style={styles.row}><Text style={styles.cell}>Verzendkosten</Text><Text style={styles.cellR}>{euro(order.shipping_cents)}</Text></View>
          <View style={styles.row}><Text style={styles.cell}>waarvan btw 21%</Text><Text style={styles.cellR}>{euro(order.vat_cents)}</Text></View>
          <View style={styles.row}><Text style={styles.cell}>Totaal</Text><Text style={styles.cellR}>{euro(order.total_cents)}</Text></View>
        </View>
        <Text style={{ marginTop: 30, fontSize: 8, color: '#888' }}>
          Betaling voldaan via {order.payment_method}. Vami Pro  IBAN {/* {{IBAN}} */}________
        </Text>
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
  return data?.signedUrl ?? path;
}
