export const MOCK_CATEGORIES = [
  { id: '1', slug: 'wassen', name: 'Wassen & Shampoo', description: 'Autoshampoo, snow foam en alles voor een veilige wasbeurt.', sort_order: 1 },
  { id: '2', slug: 'exterieur', name: 'Exterieur Reiniging', description: 'Velgenreiniger, teerverwijderaar, insectenreiniger en meer.', sort_order: 2 },
  { id: '3', slug: 'coating', name: 'Coating & Bescherming', description: 'Keramische coatings, sealants en wax voor langdurige bescherming.', sort_order: 3 },
  { id: '4', slug: 'interieur', name: 'Interieur', description: 'Reinigers en verzorging voor leer, kunststof en stoffen.', sort_order: 4 },
  { id: '5', slug: 'doeken', name: 'Doeken & Accessoires', description: 'Microvezeldoeken, droogdoeken, washandschoenen en emmers.', sort_order: 5 },
  { id: '6', slug: 'machines', name: 'Machines & Gereedschap', description: 'Polijstmachines, pads en applicators voor profwerk.', sort_order: 6 }
];

export const MOCK_PRODUCTS = [
  { id: 'p1', category_id: '1', slug: 'vami-snow-foam-1l', name: 'Vami Snow Foam 1L', short_description: 'pH-neutrale dikke schuimreiniger', description: 'Dikke, pH-neutrale snow foam die hardnekkig vuil losweekt.', brand: 'Vami Pro', price_cents: 1495, stock: 3, sku: 'VP-WAS-001', is_featured: true, is_active: true, cloudinary_images: [], categories: { slug: 'wassen', name: 'Wassen & Shampoo' } },
  { id: 'p2', category_id: '1', slug: 'vami-wheel-cleaner-500ml', name: 'Vami Wheel Cleaner 500ml', short_description: 'Kleurindicerende velgenreiniger', description: 'Velgenreiniger die van kleur verandert bij contact met ijzerdeeltjes.', brand: 'Vami Pro', price_cents: 1695, stock: 35, sku: 'VP-WAS-003', is_featured: true, is_active: true, cloudinary_images: [], categories: { slug: 'wassen', name: 'Wassen & Shampoo' } },
  { id: 'p3', category_id: '2', slug: 'vami-iron-remover-500ml', name: 'Vami Iron Remover 500ml', short_description: 'Vliegroest-verwijderaar', description: 'Lost ingebrande remstof en vliegroest op.', brand: 'Vami Pro', price_cents: 1595, stock: 40, sku: 'VP-EXT-002', is_featured: true, is_active: true, cloudinary_images: [], categories: { slug: 'exterieur', name: 'Exterieur Reiniging' } },
  { id: 'p4', category_id: '3', slug: 'vami-ceramic-coating-50ml', name: 'Vami Ceramic Coating 9H 50ml', short_description: 'Keramische coating 3 jaar', description: '9H keramische coating met tot 3 jaar bescherming.', brand: 'Vami Pro', price_cents: 6995, stock: 20, sku: 'VP-COA-001', is_featured: true, is_active: true, cloudinary_images: [], categories: { slug: 'coating', name: 'Coating & Bescherming' } },
  { id: 'p5', category_id: '4', slug: 'vami-leather-care-250ml', name: 'Vami Leather Care 250ml', short_description: 'Lederreiniger & voeding', description: '2-in-1 reiniger en voeding voor leer.', brand: 'Vami Pro', price_cents: 1695, stock: 35, sku: 'VP-INT-002', is_featured: true, is_active: true, cloudinary_images: [], categories: { slug: 'interieur', name: 'Interieur' } },
  { id: 'p6', category_id: '5', slug: 'vami-drying-towel-xl', name: 'Vami Droogdoek XL', short_description: 'Plush droogdoek 1200gsm', description: 'Extra dikke 1200gsm twisted-loop droogdoek.', brand: 'Vami Pro', price_cents: 1995, stock: 45, sku: 'VP-DOE-002', is_featured: true, is_active: true, cloudinary_images: [], categories: { slug: 'doeken', name: 'Doeken & Accessoires' } },
  { id: 'p7', category_id: '6', slug: 'vami-da-polisher-15mm', name: 'Vami DA Polisher 15mm', short_description: 'Excentrische polijstmachine', description: 'Dual-action polijstmachine met 15mm slag.', brand: 'Vami Pro', price_cents: 16995, stock: 12, sku: 'VP-MAC-001', is_featured: true, is_active: true, cloudinary_images: [], categories: { slug: 'machines', name: 'Machines & Gereedschap' } },
];

export const isMock = process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://dummy.supabase.co';

export function getMockProducts(opts?: { category_id?: string; featured?: boolean; limit?: number }) {
  let res = MOCK_PRODUCTS.filter(p => p.is_active);
  if (opts?.category_id) res = res.filter(p => p.category_id === opts.category_id);
  if (opts?.featured) res = res.filter(p => p.is_featured);
  if (opts?.limit) res = res.slice(0, opts.limit);
  return { data: res };
}

export function getMockProduct(slug: string) {
  const p = MOCK_PRODUCTS.find(p => p.slug === slug);
  return { data: p || null };
}

export function getMockCategory(slug: string) {
  const c = MOCK_CATEGORIES.find(c => c.slug === slug);
  return { data: c || null };
}

export function getMockRelated(categoryId: string, excludeId: string, limit = 4) {
  const res = MOCK_PRODUCTS.filter(p => p.category_id === categoryId && p.id !== excludeId && p.is_active).slice(0, limit);
  return { data: res };
}

export const MOCK_ORDERS = [
  { id: 'o1', order_number: 'ORD-1001', status: 'paid', total_cents: 8990, created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: 'o2', order_number: 'ORD-1002', status: 'shipped', total_cents: 4500, created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: 'o3', order_number: 'ORD-1003', status: 'delivered', total_cents: 12050, created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
  { id: 'o4', order_number: 'ORD-1004', status: 'pending', total_cents: 2995, created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() },
];

export function getMockOrders(limit = 10) {
  return { data: MOCK_ORDERS.slice(0, limit) };
}
