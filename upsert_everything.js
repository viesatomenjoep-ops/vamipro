const { createClient } = require('@supabase/supabase-js');
const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: '.env.local' });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const brainDir = '/Users/tomvanbiene/.gemini/antigravity-ide/brain/ed08e06f-f59b-43b4-86d4-a0f649c6d951/';

// Mapped exactly to the images the user provided
const imageMap = {
  'banden-glans-gel': ['media__1782067176366.jpg'],
  'velgen-borstel': ['media__1782067176374.jpg'],
  'shampoo-met-wax': ['media__1782067176382.jpg'],
  'nano-spons': ['media__1782067176383.jpg'],
  'handschoen-blauw': ['media__1782067176398.jpg'],
  'drooghandoek': ['media__1782067187265.jpg'],
  'spray-wax': ['media__1782067187282.jpg'],
  'foam-drukpomp': ['media__1782067187289.jpg'],
  'multi-interior-cleaner': ['media__1782067187297.jpg'],
  'spons-geel': ['media__1782067187299.jpg'],
  'matte-interior-cleaner': ['media__1782067197399.jpg'],
  'velgenreiniger': ['media__1782067197406.jpg'],
  'snow-foam': ['media__1782067197413.jpg'],
  'glas-reiniger': ['media__1782067197420.jpg'],
  'handschoen-grijs': ['media__1782067197422.jpg'],
  'kunstof-glans': ['media__1782067207834.jpg'],
  'insecten-verwijderaar': ['media__1782067207838.jpg'],
  'combinatiedeal-interieur': ['interieur_combi_1782067064217.png'],
  'combinatiedeal-exterieur': ['media__1782067242079.jpg'],
  'drooghandoek-xxl': ['media__1782067284973.jpg', 'media__1782067285012.jpg', 'media__1782067284997.jpg']
};

const products = [
  { name: 'Shampoo met wax', price: 1295, slug: 'shampoo-met-wax', imageKey: 'shampoo-met-wax' },
  { name: 'Velgenreiniger', price: 1395, slug: 'velgenreiniger', imageKey: 'velgenreiniger' },
  { name: 'Glas reiniger', price: 1295, slug: 'glas-reiniger', imageKey: 'glas-reiniger' },
  { name: 'Banden glans gel', price: 1495, slug: 'banden-glans-gel', imageKey: 'banden-glans-gel' },
  { name: 'Insecten verwijderaar', price: 1395, slug: 'insecten-verwijderaar', imageKey: 'insecten-verwijderaar' },
  { name: 'Multi interior cleaner', price: 1395, slug: 'multi-interior-cleaner', imageKey: 'multi-interior-cleaner' },
  { name: 'Matte interior cleaner', price: 1295, slug: 'matte-interior-cleaner', imageKey: 'matte-interior-cleaner' },
  { name: 'Spray wax', price: 1495, slug: 'spray-wax', imageKey: 'spray-wax' },
  { name: 'Snow foam', price: 1395, slug: 'snow-foam', imageKey: 'snow-foam' },
  { name: 'Kunstof glans', price: 1295, slug: 'kunstof-glans', imageKey: 'kunstof-glans' },
  { name: 'Emmer', price: 1795, slug: 'emmer', imageKey: null },
  { name: 'Handschoen blauw', price: 1095, slug: 'handschoen-blauw', imageKey: 'handschoen-blauw' },
  { name: 'Hanschoen geel microvezel', price: 995, slug: 'handschoen-geel-microvezel', imageKey: 'handschoen-grijs' },
  { name: 'Velgen borstel', price: 1095, slug: 'velgen-borstel', imageKey: 'velgen-borstel' },
  { name: 'Spons', price: 395, slug: 'spons', imageKey: 'spons-geel' },
  { name: 'Nano Spons', price: 495, slug: 'vami-nano-spons-magic', imageKey: 'nano-spons' },
  { name: 'Drooghandoek', price: 1795, slug: 'drooghandoek', imageKey: 'drooghandoek' },
  { name: 'Kleine gele droogdoek', price: 795, slug: 'kleine-gele-droogdoek', imageKey: null },
  { name: 'Foam drukpomp', price: 2295, slug: 'foam-drukpomp', imageKey: 'foam-drukpomp' },
  { name: 'Combinatiedeal Interieur', price: 3995, slug: 'combinatiedeal-interieur', imageKey: 'combinatiedeal-interieur', category: 'combinatiedeals' },
  { name: 'Exterieur pakket', price: 5995, slug: 'exterieur-pakket', imageKey: 'combinatiedeal-exterieur', category: 'combinatiedeals', description: 'Exterieur pakket van €69,70 naar 59,95' },
  { name: 'Drooghandoek xxl 1200 GSM', price: 1795, slug: 'drooghandoek-xxl-1200-gsm', imageKey: 'drooghandoek-xxl', category: 'droogdoeken', description: 'Grote super absorberende droogdoek van 1200 GSM, droogt je auto in één keer streeploos af.' }
];

async function run() {
  const { data: categoriesData } = await supabase.from('categories').select('*');
  
  // Ensure categories exist
  let combiCat = categoriesData.find(c => c.slug === 'combinatiedeals');
  if (!combiCat) {
    const { data } = await supabase.from('categories').insert({ slug: 'combinatiedeals', name: 'Combinatiedeals', sort_order: 10 }).select().single();
    combiCat = data;
  }

  let droogCat = categoriesData.find(c => c.slug === 'droogdoeken');
  if (!droogCat) {
    const { data } = await supabase.from('categories').insert({ slug: 'droogdoeken', name: 'Droogdoeken', sort_order: 3 }).select().single();
    droogCat = data;
  }

  for (const prod of products) {
    let imageUrls = [];
    if (prod.imageKey && imageMap[prod.imageKey]) {
      for (const fileName of imageMap[prod.imageKey]) {
        const filePath = brainDir + fileName;
        try {
          console.log(`Uploading ${fileName} for ${prod.name}...`);
          const res = await cloudinary.uploader.upload(filePath, { folder: 'vamipro/products' });
          imageUrls.push(res.secure_url);
        } catch (e) {
          console.error(`Failed to upload ${filePath}:`, e.message);
        }
      }
    }

    const updatePayload = {
      name: prod.name,
      price_cents: prod.price,
      is_active: true,
      description: prod.description || (prod.name + ' - Professionele car care van VaMiPro.')
    };
    
    if (prod.category === 'combinatiedeals' && combiCat) {
      updatePayload.category_id = combiCat.id;
    } else if (prod.category === 'droogdoeken' && droogCat) {
      updatePayload.category_id = droogCat.id;
    }

    if (imageUrls.length > 0) {
      updatePayload.cloudinary_images = imageUrls;
    }

    const { data: existing } = await supabase.from('products').select('id, cloudinary_images').eq('slug', prod.slug).single();
    
    if (existing) {
      // If we already have images in DB and didn't upload new ones, keep them
      if (imageUrls.length === 0 && existing.cloudinary_images?.length > 0) {
        delete updatePayload.cloudinary_images;
      }
      await supabase.from('products').update(updatePayload).eq('id', existing.id);
      console.log(`Updated ${prod.name}`);
    } else {
      await supabase.from('products').insert({
        slug: prod.slug,
        ...updatePayload,
        sku: 'VP-' + Math.floor(Math.random() * 10000)
      });
      console.log(`Inserted ${prod.name}`);
    }
  }
}
run();
