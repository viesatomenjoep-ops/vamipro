import { Document, Page, Text, View, Image, StyleSheet, pdf } from '@react-pdf/renderer';
import { LOGO_DATA_URI } from '@/lib/logo';

// Interne pakbon met picklijst/checklist — voor Donny om de bestelling te
// controleren en in te pakken. Geen prijzen (dat is de factuur).
const INK = '#141414';
const MUTED = '#2f333a';
const FAINT = '#474c55';
const LINE = '#e6e8ec';
const PANEL = '#f4f4f5';
const BAR = '#000000';

const s = StyleSheet.create({
  page: { paddingTop: 0, paddingHorizontal: 0, paddingBottom: 56, fontSize: 10, fontFamily: 'Helvetica', color: INK, backgroundColor: '#ffffff', lineHeight: 1.45 },
  topBar: { backgroundColor: BAR, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 44 },
  logo: { width: 86, height: 56, objectFit: 'contain' },
  barTitle: { fontSize: 17, fontFamily: 'Helvetica-Bold', color: '#ffffff', letterSpacing: 3 },
  body: { paddingHorizontal: 44, paddingTop: 24 },

  metaWrap: { alignItems: 'flex-end', marginBottom: 20 },
  metaRow: { flexDirection: 'row', marginTop: 2 },
  metaLabel: { color: MUTED, width: 80, textAlign: 'right', marginRight: 10 },
  metaVal: { fontFamily: 'Helvetica-Bold', minWidth: 92, textAlign: 'right', color: INK },

  label: { fontSize: 7.5, color: FAINT, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 5, fontFamily: 'Helvetica-Bold' },
  name: { fontFamily: 'Helvetica-Bold', fontSize: 11, marginBottom: 1, color: INK },
  muted: { color: MUTED },
  addrWrap: { marginBottom: 22 },

  thead: { flexDirection: 'row', backgroundColor: PANEL, paddingVertical: 7, paddingHorizontal: 9, borderRadius: 3 },
  th: { fontSize: 7.5, color: INK, letterSpacing: 0.6, textTransform: 'uppercase', fontFamily: 'Helvetica-Bold' },
  trow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 9, borderBottom: `1 solid ${LINE}` },
  cCheck: { width: 26 },
  cDesc: { flex: 5 },
  cSku: { flex: 2 },
  cQty: { flex: 1.2, textAlign: 'right', fontFamily: 'Helvetica-Bold' },
  box: { width: 13, height: 13, border: `1.3 solid ${INK}`, borderRadius: 2 },
  sku: { fontSize: 8, color: FAINT },

  checklistWrap: { marginTop: 26, borderTop: `1 solid ${LINE}`, paddingTop: 16 },
  checklistTitle: { fontSize: 8, color: FAINT, letterSpacing: 1.2, textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', marginBottom: 10 },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 9, gap: 8 },
  checkTxt: { fontSize: 10, color: INK },

  footer: { position: 'absolute', bottom: 26, left: 44, right: 44, borderTop: `1 solid ${LINE}`, paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between' },
  footTxt: { fontSize: 7.5, color: FAINT },
});

function PackingSlipDoc({ order, items }: any) {
  const date = new Date(order.paid_at ?? Date.now()).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  const totalItems = (items ?? []).reduce((n: number, it: any) => n + (it.quantity || 0), 0);

  return (
    <Document title={`Pakbon ${order.order_number}`} author="Vami Pro">
      <Page size="A4" style={s.page}>
        <View style={s.topBar}>
          <Image style={s.logo} src={LOGO_DATA_URI} />
          <Text style={s.barTitle}>PAKBON</Text>
        </View>

        <View style={s.body}>
          <View style={s.metaWrap}>
            <View style={s.metaRow}><Text style={s.metaLabel}>Ordernummer</Text><Text style={s.metaVal}>{order.order_number}</Text></View>
            <View style={s.metaRow}><Text style={s.metaLabel}>Datum</Text><Text style={s.metaVal}>{date}</Text></View>
            <View style={s.metaRow}><Text style={s.metaLabel}>Aantal items</Text><Text style={s.metaVal}>{totalItems}</Text></View>
          </View>

          <View style={s.addrWrap}>
            <Text style={s.label}>Verzenden naar</Text>
            <Text style={s.name}>{order.ship_first_name} {order.ship_last_name}</Text>
            <Text style={s.muted}>{order.ship_address} {order.ship_house_number}{order.ship_addition ? ` ${order.ship_addition}` : ''}</Text>
            <Text style={s.muted}>{order.ship_postal_code} {order.ship_city}</Text>
            <Text style={s.muted}>{order.ship_country === 'BE' ? 'België' : 'Nederland'}</Text>
          </View>

          {/* Picklijst met vinkvakjes */}
          <View style={s.thead}>
            <Text style={[s.th, s.cCheck]}> </Text>
            <Text style={[s.th, s.cDesc]}>Product</Text>
            <Text style={[s.th, s.cSku]}>Art.nr.</Text>
            <Text style={[s.th, s.cQty]}>Aantal</Text>
          </View>
          {(items ?? []).map((it: any, i: number) => (
            <View style={s.trow} key={i}>
              <View style={s.cCheck}><View style={s.box} /></View>
              <Text style={s.cDesc}>{it.product_name}</Text>
              <Text style={[s.cSku, s.sku]}>{it.sku ?? '—'}</Text>
              <Text style={s.cQty}>{it.quantity}×</Text>
            </View>
          ))}

          {/* Checklist onderaan */}
          <View style={s.checklistWrap}>
            <Text style={s.checklistTitle}>Checklist</Text>
            {['Alle artikelen gepakt en gecontroleerd', 'Netjes ingepakt', 'Verzendlabel geprint en geplakt', 'Factuur/pakbon toegevoegd', 'Aangeboden aan vervoerder'].map((t, i) => (
              <View style={s.checkRow} key={i}>
                <View style={s.box} />
                <Text style={s.checkTxt}>{t}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={s.footer} fixed>
          <Text style={s.footTxt}>Vami Pro · Kroonstraat 33, 4879 AV Etten-Leur</Text>
          <Text style={s.footTxt}>Pakbon · order {order.order_number}</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function generatePackingSlip(order: any, items: any[]): Promise<Buffer> {
  const blob = await pdf(<PackingSlipDoc order={order} items={items} />).toBlob();
  return Buffer.from(await blob.arrayBuffer());
}
