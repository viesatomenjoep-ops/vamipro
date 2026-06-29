import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing env vars in fix-slugs.ts");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function slugify(text: string) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function run() {
  const { data: products } = await supabase.from('products').select('id, slug');
  if (products) {
    for (const p of products) {
      const fixed = slugify(p.slug);
      if (fixed !== p.slug) {
        console.log(`Fixing slug for ${p.id}: "${p.slug}" -> "${fixed}"`);
        await supabase.from('products').update({ slug: fixed }).eq('id', p.id);
      }
    }
    console.log("Done fixing product slugs");
  }

  const { data: categories } = await supabase.from('categories').select('id, slug');
  if (categories) {
    for (const c of categories) {
      const fixed = slugify(c.slug);
      if (fixed !== c.slug) {
        console.log(`Fixing slug for ${c.id}: "${c.slug}" -> "${fixed}"`);
        await supabase.from('categories').update({ slug: fixed }).eq('id', c.id);
      }
    }
    console.log("Done fixing category slugs");
  }
}
run();
