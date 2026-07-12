import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing env vars in fix-slugs.ts");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function slugify(text: string) {
  return (text || '').toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function run() {
  const { data: products } = await supabase.from('products').select('id, name, slug');
  if (products) {
    console.log("Found products:");
    for (const p of products) {
      const fixed = slugify(p.slug || p.name);
      console.log(`- ID: ${p.id} | Name: "${p.name}" | Current Slug: "${p.slug}" -> Target Slug: "${fixed}"`);
      if (fixed !== p.slug) {
        console.log(`  Updating...`);
        const { error } = await supabase.from('products').update({ slug: fixed }).eq('id', p.id);
        if (error) console.error(`  Error updating:`, error);
      }
    }
    console.log("Done fixing product slugs");
  } else {
    console.log("No products found.");
  }
}
run();
