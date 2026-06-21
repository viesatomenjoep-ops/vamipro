const fs = require('fs');
const path = require('path');

const files = [
  'components/shop/MobileMenu.tsx',
  'components/shop/ChatbotWidget.tsx',
  'components/shop/Footer.tsx',
  'components/shop/Header.tsx'
];

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  let content = fs.readFileSync(fullPath, 'utf8');
  if (content.includes('logo.svg')) {
    content = content.replace(/logo\.svg/g, 'logo.jpg');
    content = content.replace(/Fami Pro/g, 'VaMiPro'); // Also fix alt text
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${file}`);
  }
});
