const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const prices = {
  'vami-bucket-grit-guard': 2495,           // €24.95
  'vami-microvezeldoek-33x65': 895,         // €8.95
  'vami-drying-towel-xl': 2495,             // €24.95
  'vami-droogdoek-500gsm-40x30': 795,       // €7.95
  'vami-wash-mitt-coral-fleece': 1495,      // €14.95
  'vami-wash-mitt-zacht-chenille': 995,     // €9.95
  'vami-nano-spons-magic': 395,             // €3.95
  'vami-houten-paardenhaarborstel': 895,    // €8.95
  'vami-microvezel-wielborstel': 1795       // €17.95
};

async function run() {
  for (const [slug, price] of Object.entries(prices)) {
    const { error } = await supabase.from('products').update({ price_cents: price }).eq('slug', slug);
    if (error) {
      console.error("Error updating", slug, error);
    } else {
      console.log(`Updated ${slug} to €${(price / 100).toFixed(2)}`);
    }
  }
  console.log("Pricing update complete!");
}

run();
