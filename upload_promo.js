const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: '.env.local' });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function run() {
  try {
    const result = await cloudinary.uploader.upload('public/images/pakket-xxl.png', {
      folder: 'vamipro/products'
    });
    console.log(`Uploaded to: ${result.secure_url}`);
  } catch (e) {
    console.error("Failed to upload", e);
  }
}

run();
