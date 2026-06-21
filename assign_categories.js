const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function run() {
  const { data: categories } = await supabase.from('categories').select('id, slug');
  const catMap = {};
  categories.forEach(c => { catMap[c.slug] = c.id; });

  const mapping = {
    'shampoo-met-wax': 'exterieur',
    'velgenreiniger': 'exterieur',
    'glas-reiniger': 'exterieur', // can be both, but usually exterior/windows
    'banden-glans-gel': 'exterieur',
    'insecten-verwijderaar': 'exterieur',
    'spray-wax': 'exterieur',
    'snow-foam': 'exterieur',
    
    'multi-interior-cleaner': 'interieur',
    'matte-interior-cleaner': 'interieur',
    'kunstof-glans': 'interieur',

    'drooghandoek': 'droogdoeken',
    'kleine-gele-droogdoek': 'droogdoeken',
    'drooghandoek-xxl-1200-gsm': 'droogdoeken',

    'handschoen-blauw': 'washandschoenen',
    'handschoen-geel-microvezel': 'washandschoenen',

    'emmer': 'accessoires',
    'velgen-borstel': 'accessoires',
    'spons': 'accessoires',
    'vami-nano-spons-magic': 'accessoires',
    'foam-drukpomp': 'accessoires',
    'vamipro-multifunctionele-handpomp-2-liter': 'accessoires',

    'combinatiedeal-interieur': 'combinatiedeals',
    'exterieur-pakket': 'combinatiedeals'
  };

  const { data: products } = await supabase.from('products').select('id, slug');
  
  for (const prod of products) {
    const targetSlug = mapping[prod.slug];
    if (targetSlug && catMap[targetSlug]) {
      await supabase.from('products').update({ category_id: catMap[targetSlug] }).eq('id', prod.id);
      console.log(`Updated ${prod.slug} to ${targetSlug}`);
    } else {
      console.log(`No mapping for ${prod.slug}`);
    }
  }
}
run();
