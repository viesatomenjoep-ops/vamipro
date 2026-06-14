const cloudinary = require('cloudinary').v2;
const { createClient } = require('@supabase/supabase-js');
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

const imagesToUpload = [
  { slug: 'vami-bucket-grit-guard', file: 'public/images/bucket.jpg' },
  { slug: 'vami-microvezeldoek-33x65-3pack', file: 'public/images/microfiber.jpg' },
  { slug: 'vami-drying-towel-xl', file: 'public/images/drying_towel.jpg' },
  { slug: 'vami-droogdoek-500gsm-40x30-2pack', file: 'public/images/droogdoek_500gsm.jpg' },
  { slug: 'vami-wash-mitt-coral-fleece', file: 'public/images/wash_mitt.jpg' },
  { slug: 'vami-wash-mitt-zacht-chenille', file: 'public/images/wash_mitt_chenille.jpg' },
  { slug: 'vami-nano-spons-magic-5pack', file: 'public/images/nano_spons.jpg' },
  { slug: 'vami-houten-paardenhaarborstel', file: 'public/images/paardenhaarborstel.jpg' },
  { slug: 'vami-microvezel-wielborstel', file: 'public/images/wielborstel.jpg' }
];

async function run() {
  for (const item of imagesToUpload) {
    try {
      console.log(`Uploading ${item.file} to Cloudinary...`);
      const result = await cloudinary.uploader.upload(item.file, {
        folder: 'vamipro/products'
      });
      
      console.log(`Uploaded ${item.slug}: ${result.secure_url}`);
      
      // Update Supabase
      const { error } = await supabase
        .from('products')
        .update({ cloudinary_images: [result.secure_url] })
        .eq('slug', item.slug);
        
      if (error) {
        console.error("Error updating DB for", item.slug, error);
      } else {
        console.log("DB updated for", item.slug);
      }
    } catch (e) {
      console.error("Failed to upload", item.file, e);
    }
  }
  console.log("All done!");
}

run();
