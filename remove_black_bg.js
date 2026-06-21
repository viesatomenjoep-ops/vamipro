const sharp = require('sharp');

async function processImage() {
  try {
    const { data, info } = await sharp('public/images/logo.jpg')
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Make black/dark pixels transparent
    // With anti-aliasing in mind, we can do a gradual transparency
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      const maxVal = Math.max(r, g, b);
      
      // If it's very dark (black background)
      if (maxVal < 25) {
        // Linear fade for edges
        const alpha = Math.max(0, Math.min(255, (maxVal / 25) * 255));
        data[i + 3] = Math.round(alpha);
      }
    }

    await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4
      }
    })
    .png()
    .toFile('public/images/logo.png');
    
    console.log("Successfully created logo.png with transparent background!");
  } catch (err) {
    console.error(err);
  }
}

processImage();
