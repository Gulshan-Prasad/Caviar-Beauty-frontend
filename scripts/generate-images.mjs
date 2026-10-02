import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public', 'images');

const products = [
  { slug: 'diamond-quilted-shoulder-bag', name: 'Diamond Quilted Shoulder Bag', category: 'handbags', colors: ['#1a1a2e', '#f5e6cc', '#800020'] },
  { slug: 'signature-leather-tote', name: 'Signature Leather Tote', category: 'handbags', colors: ['#8B7355', '#1a1a1a', '#1B3B6F'] },
  { slug: 'silk-evening-clutch', name: 'Silk Evening Clutch', category: 'handbags', colors: ['#0a0a0a', '#E8D5B7', '#1a1a2e'] },
  { slug: 'leather-ankle-boots', name: 'Leather Ankle Boots', category: 'footwear', colors: ['#1a1a1a', '#5C4033', '#2a1a1a'] },
  { slug: 'crystal-embellished-heels', name: 'Crystal-Embellished Heels', category: 'footwear', colors: ['#C0C0C0', '#FFD700', '#1a1a2e'] },
  { slug: 'aviator-sunglasses', name: 'Aviator Sunglasses', category: 'eyewear', colors: ['#1a1a1a', '#C0C0C0', '#2d5a27'] },
  { slug: 'cat-eye-optical-frame', name: 'Cat-Eye Optical Frame', category: 'eyewear', colors: ['#8B6914', '#1a1a1a', '#87CEEB'] },
  { slug: 'cashmere-wrap', name: 'Cashmere Wrap', category: 'accessories', colors: ['#36454F', '#C19A6B', '#800020'] },
  { slug: 'leather-belt', name: 'Leather Belt', category: 'accessories', colors: ['#1a1a1a', '#8B7355', '#1B3B6F'] },
  { slug: 'pearl-drop-earrings', name: 'Pearl Drop Earrings', category: 'accessories', colors: ['#F5F5F5', '#FFD700', '#F5F5DC'] },
  { slug: 'digital-gift-card', name: 'Digital Gift Card', category: 'gift-cards', colors: ['#1a1a1a', '#d4af37', '#800020'] },
  { slug: 'limited-edition-silk-scarf', name: 'Limited Edition Silk Scarf', category: 'limited-edition', colors: ['#8B0000', '#1a1a1a', '#2d5a27'] },
  { slug: 'patent-leather-loafers', name: 'Patent Leather Loafers', category: 'footwear', colors: ['#0a0a0a', '#5C4033', '#1a1a2e'] },
  { slug: 'leather-crossbody-bag', name: 'Leather Crossbody Bag', category: 'handbags', colors: ['#1a1a1a', '#F5D6C6', '#8FBC8F'] },
];

const categories = [
  { slug: 'handbags', name: 'Handbags', color: '#1a1a2e' },
  { slug: 'footwear', name: 'Footwear', color: '#1a1a1a' },
  { slug: 'eyewear', name: 'Eyewear', color: '#C0C0C0' },
  { slug: 'accessories', name: 'Accessories', color: '#36454F' },
  { slug: 'gift-cards', name: 'Gift Cards', color: '#d4af37' },
  { slug: 'limited', name: 'Limited Edition', color: '#8B0000' },
];

const luxuryIcons = {
  handbags: `<path d="M12 4L4 12v8h16v-8L12 4z" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M8 12h8" stroke="currentColor" stroke-width="1.2"/><circle cx="12" cy="16" r="1.5" fill="currentColor"/>`,
  footwear: `<path d="M6 18c0-2 1-6 6-6s6 4 6 6H6z" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M8 18v-4" stroke="currentColor" stroke-width="1"/><path d="M16 18v-4" stroke="currentColor" stroke-width="1"/>`,
  eyewear: `<path d="M4 14c0-2 2-4 4-4h2c2 0 4 2 4 4s-2 4-4 4H8c-2 0-4-2-4-4z" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M14 14c0-2 2-4 4-4h2c2 0 4 2 4 4s-2 4-4 4h-2c-2 0-4-2-4-4z" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M10 14h4" stroke="currentColor" stroke-width="1.2"/>`,
  accessories: `<circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="1.2"/><circle cx="12" cy="12" r="2" fill="currentColor"/>`,
  'gift-cards': `<rect x="4" y="8" width="16" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M12 8v12M8 8c0-2 2-3 4-1 2-2 4-1 4 1" fill="none" stroke="currentColor" stroke-width="1"/>`,
  'limited-edition': `<polygon points="12,4 14,10 20,10 15,14 17,20 12,16 7,20 9,14 4,10 10,10" fill="none" stroke="currentColor" stroke-width="1.2"/>`,
};

function generateProductSVG(slug, name, color, isPrimary) {
  const bg = color || '#1a1a1a';
  const accent = '#d4af37';
  const textColor = '#ffffff';

  const pattern = isPrimary ? `
    <defs>
      <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="10" cy="10" r="0.5" fill="${accent}" opacity="0.15"/>
      </pattern>
    </defs>
    <rect width="800" height="1000" fill="${bg}"/>
    <rect width="800" height="1000" fill="url(#dots)"/>
    <line x1="40" y1="60" x2="200" y2="60" stroke="${accent}" stroke-width="1" opacity="0.5"/>
    <text x="400" y="200" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="${accent}" opacity="0.6" letter-spacing="4">CAVIAR BEAUTY</text>
    <g transform="translate(400, 480)" stroke="${accent}" fill="none" stroke-width="1.5" opacity="0.8">
      <path d="M-60,-80 L60,-80 L80,60 L-80,60 Z"/>
      <path d="M-30,-80 L0,-140 L30,-80" stroke-width="1.2"/>
      <circle cx="0" cy="-20" r="8" fill="${accent}" opacity="0.3"/>
    </g>
    <text x="400" y="680" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="${textColor}" opacity="0.9">${name}</text>
    <text x="400" y="720" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="${textColor}" opacity="0.4" letter-spacing="3">LUXURY COLLECTION</text>
    <line x1="350" y1="760" x2="450" y2="760" stroke="${accent}" stroke-width="1"/>
    <line x1="40" y1="940" x2="760" y2="940" stroke="${textColor}" opacity="0.1" stroke-width="1"/>
  ` : `
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${bg};stop-opacity:1"/>
        <stop offset="100%" style="stop-color:${adjustColor(bg, -30)};stop-opacity:1"/>
      </linearGradient>
    </defs>
    <rect width="800" height="1000" fill="url(#bg)"/>
    <rect x="50" y="50" width="700" height="900" fill="none" stroke="${accent}" stroke-width="0.5" opacity="0.15"/>
    <text x="400" y="200" text-anchor="middle" font-family="Georgia, serif" font-size="12" fill="${accent}" opacity="0.5" letter-spacing="6">DETAIL VIEW</text>
    <g transform="translate(400, 480)" stroke="${accent}" fill="none" stroke-width="1" opacity="0.6">
      <rect x="-100" y="-120" width="200" height="240" rx="4"/>
      <circle cx="0" cy="0" r="40" stroke-dasharray="4,4"/>
      <line x1="-60" y1="-80" x2="-60" y2="80"/>
      <line x1="60" y1="-80" x2="60" y2="80"/>
    </g>
    <text x="400" y="780" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="${textColor}" opacity="0.3" letter-spacing="4">HANDCRAFTED IN ITALY</text>
  `;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
  ${pattern}
</svg>`;
}

function generateCategorySVG(slug, name, color) {
  const icon = luxuryIcons[slug] || '';
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1"/>
      <stop offset="100%" style="stop-color:${adjustColor(color, -40)};stop-opacity:1"/>
    </linearGradient>
    <pattern id="grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
      <line x1="60" y1="0" x2="60" y2="60" stroke="#ffffff" stroke-width="0.3" opacity="0.05"/>
      <line x1="0" y1="60" x2="60" y2="60" stroke="#ffffff" stroke-width="0.3" opacity="0.05"/>
    </pattern>
  </defs>
  <rect width="800" height="1000" fill="url(#bg)"/>
  <rect width="800" height="1000" fill="url(#grid)"/>
  <text x="400" y="120" text-anchor="middle" font-family="Georgia, serif" font-size="12" fill="#d4af37" opacity="0.5" letter-spacing="6">CAVIAR BEAUTY</text>
  <g transform="translate(400, 420)" stroke="#d4af37" fill="none" stroke-width="2" opacity="0.6">
    ${icon}
  </g>
  <text x="400" y="600" text-anchor="middle" font-family="Georgia, serif" font-size="42" fill="#ffffff" font-weight="bold">${name}</text>
  <line x1="350" y1="630" x2="450" y2="630" stroke="#d4af37" stroke-width="1.5"/>
  <text x="400" y="670" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#ffffff" opacity="0.4" letter-spacing="3">EXPLORE THE COLLECTION</text>
</svg>`;
}

function adjustColor(hex, amount) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Generate product images
products.forEach((product) => {
  for (let i = 1; i <= 4; i++) {
    const isPrimary = i === 1;
    const color = product.colors[i - 1] || product.colors[0];
    const svg = generateProductSVG(product.slug, product.name, color, isPrimary);
    const filename = join(publicDir, 'products', `${product.slug}-${i}.jpg`);
    // We write as .jpg but it's actually SVG - browsers render it fine
    writeFileSync(filename.replace('.jpg', '.svg'), svg);
    console.log(`Created ${filename.replace('.jpg', '.svg')}`);
  }
});

// Generate category images  
categories.forEach((cat) => {
  const svg = generateCategorySVG(cat.slug, cat.name, cat.color);
  const filename = join(publicDir, 'categories', `${cat.slug}.svg`);
  writeFileSync(filename, svg);
  console.log(`Created ${filename}`);
});

console.log(`\nGenerated ${products.length * 4 + categories.length} images successfully!`);
