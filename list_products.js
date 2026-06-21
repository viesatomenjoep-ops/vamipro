const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function run() {
  const { data, error } = await supabase.from('products').select('slug, name, price_cents');
  if (error) console.error(error);
  else console.table(data);
}
run();
