const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const newText = `Onmisbaar voor een veilige, krasvrije wasbeurt. Deze stevige wasemmer van hoogwaardig kunststof is ontworpen voor intensief gebruik en bestand tegen sterke reinigingsmiddelen.

De meegeleverde Grit Guard (vuilrooster) zorgt dat zand en vuil naar de bodem zakken. Hierdoor blijft je washandschoen brandschoon en voorkom je swirls op de lak. Ideaal in combinatie met de twee-emmermethode!

Kenmerken:
• Inclusief Grit Guard vuilrooster
• Voorkomt actief krassen en swirls
• Gemaakt van oersterk, duurzaam kunststof
• Perfect voor de twee-emmermethode`;

async function run() {
  const { data, error } = await supabase
    .from('products')
    .update({ 
      description: newText, 
      is_active: true,
      cloudinary_images: ['/images/bucket.jpg']
    })
    .eq('slug', 'vami-bucket-grit-guard');
    
  if (error) console.error("Error:", error);
  else console.log("Success! Updated the bucket product.");
}

run();
