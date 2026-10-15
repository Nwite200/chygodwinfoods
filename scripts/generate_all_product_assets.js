import fs from 'fs';
import path from 'path';

const outDir = './public/products';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Function to generate clean vector illustrations
const createSvg = (bgColor, badgeText, title, subtitle, shapeSvg) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <rect width="400" height="400" fill="#F8FAFC"/>
  <circle cx="200" cy="200" r="145" fill="${bgColor}" opacity="0.45"/>
  ${shapeSvg}
  <!-- Label card -->
  <rect x="110" y="275" width="180" height="70" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))"/>
  <rect x="120" y="283" width="160" height="18" rx="4" fill="#0C6837"/>
  <text x="200" y="296" font-family="system-ui, sans-serif" font-weight="900" font-size="10" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">${badgeText}</text>
  <text x="200" y="322" font-family="system-ui, sans-serif" font-weight="900" font-size="15" fill="#062E1D" text-anchor="middle">${title}</text>
  <text x="200" y="337" font-family="system-ui, sans-serif" font-weight="700" font-size="10" fill="#64748B" text-anchor="middle">${subtitle}</text>
</svg>
`;

const items = {
  'dates.jpg': createSvg('#FEF3C7', 'NATURAL SUPERFOOD', 'DATES SEED / POWDER', 'Rich in Iron & Fiber', `
    <ellipse cx="170" cy="180" rx="40" ry="60" transform="rotate(-15 170 180)" fill="#78350F" stroke="#451A03" stroke-width="3"/>
    <ellipse cx="230" cy="180" rx="42" ry="62" transform="rotate(20 230 180)" fill="#92400E" stroke="#451A03" stroke-width="3"/>
    <circle cx="170" cy="170" r="12" fill="#B45309" opacity="0.6"/>
    <circle cx="230" cy="170" r="14" fill="#B45309" opacity="0.6"/>
    <path d="M 120 230 Q 200 250 280 230" fill="none" stroke="#D97706" stroke-width="12" stroke-linecap="round"/>
  `),

  'soyabeans.jpg': createSvg('#DCFCE7', 'HIGH PROTEIN SEEDS', 'SOYABEANS', 'Selected Healthy Grains', `
    <circle cx="160" cy="165" r="34" fill="#EAB308" stroke="#CA8A04" stroke-width="3"/>
    <circle cx="210" cy="155" r="30" fill="#FACC15" stroke="#CA8A04" stroke-width="3"/>
    <circle cx="240" cy="190" r="32" fill="#EAB308" stroke="#CA8A04" stroke-width="3"/>
    <circle cx="180" cy="205" r="36" fill="#FDE047" stroke="#CA8A04" stroke-width="3"/>
    <circle cx="155" cy="160" r="4" fill="#713F12"/>
    <circle cx="205" cy="150" r="4" fill="#713F12"/>
  `),

  'rice.jpg': createSvg('#E0F2FE', 'STAPLE CEREAL', 'BAGS OF RICE', 'Premium Stone-Free', `
    <path d="M 140 100 Q 200 110 260 100 L 280 260 Q 280 280 200 280 Q 120 280 120 260 Z" fill="#F8FAFC" stroke="#0284C7" stroke-width="4"/>
    <rect x="150" y="140" width="100" height="90" rx="6" fill="#0284C7"/>
    <text x="200" y="175" font-family="system-ui, sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle">RICE</text>
    <text x="200" y="200" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#BAE6FD" text-anchor="middle">50KG / 25KG</text>
  `),

  'cashew.jpg': createSvg('#FEF9C3', 'PREMIUM NUTS', 'CASHEW NUTS', 'Crunchy Roasted Bottle', `
    <rect x="155" y="75" width="90" height="180" rx="14" fill="#FFFBEB" stroke="#D97706" stroke-width="3"/>
    <rect x="170" y="55" width="60" height="22" rx="4" fill="#B45309"/>
    <circle cx="185" cy="130" r="15" fill="#D97706"/>
    <circle cx="215" cy="145" r="16" fill="#F59E0B"/>
    <circle cx="185" cy="175" r="16" fill="#F59E0B"/>
    <circle cx="215" cy="190" r="15" fill="#D97706"/>
    <rect x="160" y="200" width="80" height="40" rx="4" fill="#78350F"/>
    <text x="200" y="225" font-family="system-ui, sans-serif" font-weight="900" font-size="11" fill="#FEF08A" text-anchor="middle">CASHEW</text>
  `),

  'kulikuli.jpg': createSvg('#FFEDD5', 'AUTHENTIC CRUNCH', 'SPICY KULIKULI', 'Groundnut Snack Stick', `
    <rect x="140" y="100" width="30" height="140" rx="15" transform="rotate(-25 140 100)" fill="#9A3412" stroke="#7C2D12" stroke-width="3"/>
    <rect x="200" y="80" width="30" height="150" rx="15" transform="rotate(10 200 80)" fill="#C2410C" stroke="#7C2D12" stroke-width="3"/>
    <rect x="240" y="110" width="30" height="130" rx="15" transform="rotate(35 240 110)" fill="#EA580C" stroke="#7C2D12" stroke-width="3"/>
  `),

  'kilishi.jpg': createSvg('#FEE2E2', 'SAVORY DRIED MEAT', 'SPICY KILISHI', 'Authentic Northern Recipe', `
    <path d="M 130 110 Q 200 90 270 120 Q 285 200 260 250 Q 190 270 130 240 Z" fill="#7F1D1D" stroke="#991B1B" stroke-width="4"/>
    <path d="M 145 130 Q 200 120 250 140 Q 255 190 240 230 Q 185 245 145 220 Z" fill="#991B1B" stroke="#B91C1C" stroke-width="2"/>
    <circle cx="170" cy="160" r="4" fill="#F87171"/>
    <circle cx="210" cy="180" r="4" fill="#F87171"/>
    <circle cx="180" cy="210" r="4" fill="#F87171"/>
    <circle cx="230" cy="150" r="4" fill="#F87171"/>
  `),

  'ogiri.jpg': createSvg('#FEF3C7', 'TRADITIONAL UMAMI', 'OGIRI OKPEI / IGBO', 'Locally Fermented Seasoning', `
    <rect x="135" y="110" width="130" height="140" rx="18" fill="#57380E" stroke="#3D2605" stroke-width="4"/>
    <circle cx="200" cy="180" r="40" fill="#784B15"/>
    <text x="200" y="186" font-family="system-ui, sans-serif" font-weight="900" font-size="16" fill="#FDE68A" text-anchor="middle">OGIRI</text>
    <path d="M 125 105 Q 200 95 275 105" stroke="#166534" stroke-width="8" stroke-linecap="round"/>
  `),

  'granola.jpg': createSvg('#FEF3C7', 'CRUNCHY BREAKFAST', 'HONEY GRANOLA', 'Oats, Nuts & Dried Fruits', `
    <rect x="145" y="90" width="110" height="170" rx="16" fill="#F59E0B" stroke="#B45309" stroke-width="3"/>
    <circle cx="200" cy="160" r="35" fill="#FFFBEB"/>
    <circle cx="185" cy="150" r="6" fill="#92400E"/>
    <circle cx="215" cy="155" r="7" fill="#B45309"/>
    <circle cx="195" cy="175" r="5" fill="#D97706"/>
    <text x="200" y="235" font-family="system-ui, sans-serif" font-weight="900" font-size="12" fill="#FFFFFF" text-anchor="middle">GRANOLA</text>
  `),

  'yogurt.jpg': createSvg('#F0FDF4', 'HEALTH & PROBIOTIC', 'GREEK YOGURT', 'Sweetened & Unsweetened', `
    <path d="M 150 110 L 250 110 L 235 250 Q 200 265 165 250 Z" fill="#FFFFFF" stroke="#0C6837" stroke-width="4"/>
    <ellipse cx="200" cy="110" rx="50" ry="16" fill="#DCFCE7" stroke="#0C6837" stroke-width="3"/>
    <rect x="160" y="150" width="80" height="60" rx="6" fill="#0C6837"/>
    <text x="200" y="176" font-family="system-ui, sans-serif" font-weight="900" font-size="13" fill="#FFFFFF" text-anchor="middle">GREEK</text>
    <text x="200" y="195" font-family="system-ui, sans-serif" font-weight="700" font-size="10" fill="#86EFAC" text-anchor="middle">YOGURT</text>
  `),

  'kpomo.jpg': createSvg('#FEF2F2', 'PROTEIN DELIGHT', 'SOFT KPOMO', 'Clean & Tender Cow Skin', `
    <path d="M 140 120 Q 230 110 260 160 Q 230 240 150 220 Q 120 170 140 120 Z" fill="#B45309" stroke="#78350F" stroke-width="4"/>
    <path d="M 160 140 Q 220 135 240 170 Q 215 220 165 200 Z" fill="#D97706" opacity="0.8"/>
  `),

  'stockfish.jpg': createSvg('#F1F5F9', 'TRADITIONAL BROTH', 'STOCKFISH HEAD', 'Authentic Okporoko', `
    <path d="M 130 180 Q 180 110 270 160 Q 260 230 180 240 Z" fill="#94A3B8" stroke="#475569" stroke-width="4"/>
    <circle cx="235" cy="165" r="7" fill="#1E293B"/>
    <path d="M 160 190 Q 200 170 240 200" stroke="#CBD5E1" stroke-width="3" fill="none"/>
  `),

  'spaghetti.jpg': createSvg('#FEF9C3', 'PASTA FAVORITE', 'SPAGHETTI PACK', 'Golden Terra & IRS Brand', `
    <rect x="140" y="70" width="120" height="200" rx="8" fill="#F59E0B" stroke="#B45309" stroke-width="3"/>
    <line x1="160" y1="80" x2="160" y2="260" stroke="#FEF08A" stroke-width="3"/>
    <line x1="180" y1="80" x2="180" y2="260" stroke="#FEF08A" stroke-width="3"/>
    <line x1="200" y1="80" x2="200" y2="260" stroke="#FEF08A" stroke-width="3"/>
    <line x1="220" y1="80" x2="220" y2="260" stroke="#FEF08A" stroke-width="3"/>
    <rect x="150" y="145" width="100" height="50" rx="6" fill="#DC2626"/>
    <text x="200" y="175" font-family="system-ui, sans-serif" font-weight="900" font-size="12" fill="#FFFFFF" text-anchor="middle">SPAGHETTI</text>
  `),

  'tomatoes.jpg': createSvg('#FEE2E2', 'RICH RED STEW', 'TIN TOMATOES', 'Sonia • Tiger • Party Jollof', `
    <rect x="145" y="90" width="110" height="160" rx="14" fill="#DC2626" stroke="#991B1B" stroke-width="4"/>
    <ellipse cx="200" cy="90" rx="55" ry="14" fill="#E2E8F0" stroke="#991B1B" stroke-width="2"/>
    <circle cx="200" cy="170" r="32" fill="#FEF2F2"/>
    <text x="200" y="168" font-family="system-ui, sans-serif" font-weight="900" font-size="12" fill="#DC2626" text-anchor="middle">TOMATO</text>
    <text x="200" y="184" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="#15803D" text-anchor="middle">PASTE</text>
  `),

  'leaves.jpg': createSvg('#DCFCE7', 'SUN-DRIED VEGETABLES', 'DRIED LEAVES', 'Ugu • Utazi • Uziza • Zobo', `
    <path d="M 200 90 Q 260 140 240 220 Q 200 260 160 220 Q 140 140 200 90 Z" fill="#15803D" stroke="#166534" stroke-width="3"/>
    <line x1="200" y1="90" x2="200" y2="250" stroke="#86EFAC" stroke-width="3"/>
    <line x1="200" y1="140" x2="230" y2="120" stroke="#86EFAC" stroke-width="2"/>
    <line x1="200" y1="170" x2="170" y2="150" stroke="#86EFAC" stroke-width="2"/>
    <line x1="200" y1="200" x2="225" y2="185" stroke="#86EFAC" stroke-width="2"/>
  `),

  'pap.jpg': createSvg('#FEF9C3', 'NURTURING CEREAL', 'DEHYDRATED YELLOW PAP', 'Pure Ogi / Akamu Powder', `
    <rect x="145" y="95" width="110" height="165" rx="12" fill="#FACC15" stroke="#CA8A04" stroke-width="3"/>
    <circle cx="200" cy="165" r="30" fill="#FEF08A"/>
    <text x="200" y="170" font-family="system-ui, sans-serif" font-weight="900" font-size="14" fill="#713F12" text-anchor="middle">YELLOW PAP</text>
  `),

  'flour.jpg': createSvg('#FEF3C7', 'FINE MILLED FLOUR', 'BEANS / OKPA / CORCORAN', 'Smooth & Quick Swallow', `
    <path d="M 140 100 Q 200 110 260 100 L 275 250 Q 200 270 125 250 Z" fill="#FDE68A" stroke="#D97706" stroke-width="3"/>
    <ellipse cx="200" cy="100" rx="60" ry="16" fill="#FEF3C7" stroke="#D97706" stroke-width="2"/>
    <rect x="150" y="145" width="100" height="60" rx="6" fill="#B45309"/>
    <text x="200" y="175" font-family="system-ui, sans-serif" font-weight="900" font-size="13" fill="#FFFFFF" text-anchor="middle">SPECIAL</text>
    <text x="200" y="193" font-family="system-ui, sans-serif" font-weight="800" font-size="11" fill="#FDE68A" text-anchor="middle">FLOUR</text>
  `),

  'crayfish.jpg': createSvg('#FFEDD5', 'SAVORY SOUP SPICE', 'CALABAR CRAYFISH', 'Oron Crayfish Dried Clean', `
    <path d="M 160 140 Q 200 110 240 140 Q 250 190 200 230 Q 150 190 160 140 Z" fill="#EA580C" stroke="#C2410C" stroke-width="3"/>
    <line x1="200" y1="120" x2="170" y2="90" stroke="#C2410C" stroke-width="2"/>
    <line x1="200" y1="120" x2="230" y2="90" stroke="#C2410C" stroke-width="2"/>
    <circle cx="185" cy="140" r="4" fill="#000"/>
    <circle cx="215" cy="140" r="4" fill="#000"/>
  `),

  'onions.jpg': createSvg('#FCE7F3', 'FRESH AROMATIC', 'PENTERS OF ONIONS', 'Sweet Red Nigerian Onions', `
    <ellipse cx="170" cy="180" rx="36" ry="42" fill="#9D174D" stroke="#831843" stroke-width="3"/>
    <ellipse cx="230" cy="180" rx="38" ry="44" fill="#BE185D" stroke="#831843" stroke-width="3"/>
    <path d="M 170 138 L 170 125" stroke="#047857" stroke-width="4"/>
    <path d="M 230 136 L 230 120" stroke="#047857" stroke-width="4"/>
  `),

  'ogbono.jpg': createSvg('#FEF3C7', 'DRAW SOUP ESSENTIAL', 'ADOR OGBONNO', 'High-Draw Premium Seeds', `
    <circle cx="165" cy="170" r="32" fill="#78350F" stroke="#451A03" stroke-width="3"/>
    <circle cx="225" cy="165" r="34" fill="#92400E" stroke="#451A03" stroke-width="3"/>
    <circle cx="195" cy="215" r="35" fill="#B45309" stroke="#451A03" stroke-width="3"/>
    <text x="200" y="175" font-family="system-ui, sans-serif" font-weight="900" font-size="12" fill="#FDE68A" text-anchor="middle">OGBONO</text>
  `),

  'egusi.jpg': createSvg('#FEF9C3', 'SOUP PERFECTION', 'PEELED EGUSI', 'Machine & Handpeel Melon', `
    <ellipse cx="160" cy="160" rx="20" ry="34" transform="rotate(-30 160 160)" fill="#FEF08A" stroke="#CA8A04" stroke-width="2"/>
    <ellipse cx="210" cy="150" rx="20" ry="34" transform="rotate(15 210 150)" fill="#FEF9C3" stroke="#CA8A04" stroke-width="2"/>
    <ellipse cx="240" cy="190" rx="20" ry="34" transform="rotate(45 240 190)" fill="#FEF08A" stroke="#CA8A04" stroke-width="2"/>
    <ellipse cx="180" cy="210" rx="20" ry="34" transform="rotate(-15 180 210)" fill="#FEF9C3" stroke="#CA8A04" stroke-width="2"/>
  `),

  'spices.jpg': createSvg('#FFEDD5', 'AROMATIC BLEND', 'NATURAL SPICES', 'Curry • Ginger • Garlic • Suya', `
    <rect x="145" y="85" width="110" height="175" rx="14" fill="#D97706" stroke="#92400E" stroke-width="3"/>
    <circle cx="200" cy="150" r="30" fill="#FEF3C7"/>
    <text x="200" y="155" font-family="system-ui, sans-serif" font-weight="900" font-size="12" fill="#78350F" text-anchor="middle">SPICE</text>
    <rect x="160" y="195" width="80" height="20" rx="4" fill="#92400E"/>
    <text x="200" y="209" font-family="system-ui, sans-serif" font-weight="700" font-size="9" fill="#FFF" text-anchor="middle">PURE NATURAL</text>
  `),

  'abacha.jpg': createSvg('#FEF3C7', 'EASTERN DELICACY', 'ABACHA CASSAVA', 'Shredded Sun-Dried Salad', `
    <path d="M 130 130 Q 160 110 200 130 Q 240 110 270 130 L 260 230 Q 200 260 140 230 Z" fill="#FFFBEB" stroke="#B45309" stroke-width="3"/>
    <path d="M 150 150 Q 180 160 210 150" stroke="#D97706" stroke-width="3" fill="none"/>
    <path d="M 160 180 Q 200 190 240 180" stroke="#D97706" stroke-width="3" fill="none"/>
    <path d="M 170 210 Q 195 215 220 210" stroke="#D97706" stroke-width="3" fill="none"/>
  `),

  'honey.jpg': createSvg('#FEF9C3', 'UNPROCESSED SWEET', 'PURE NATURAL HONEY', 'Direct From Farm Apiary', `
    <rect x="150" y="80" width="100" height="175" rx="16" fill="#F59E0B" stroke="#B45309" stroke-width="3"/>
    <rect x="165" y="60" width="70" height="22" rx="4" fill="#78350F"/>
    <circle cx="200" cy="150" r="32" fill="#FEF3C7"/>
    <text x="200" y="155" font-family="system-ui, sans-serif" font-weight="900" font-size="14" fill="#B45309" text-anchor="middle">HONEY</text>
  `),

  'combo.jpg': createSvg('#DCFCE7', 'FAMILY MEGA PACK', 'FOOD COMBO PACK', 'Complete Kitchen Provision', `
    <rect x="125" y="90" width="150" height="170" rx="14" fill="#0C6837" stroke="#062E1D" stroke-width="4"/>
    <rect x="135" y="100" width="130" height="30" rx="4" fill="#22C55E"/>
    <text x="200" y="120" font-family="system-ui, sans-serif" font-weight="900" font-size="13" fill="#042416" text-anchor="middle">SUPER COMBO</text>
    <circle cx="200" cy="190" r="36" fill="#FFFFFF"/>
    <text x="200" y="188" font-family="system-ui, sans-serif" font-weight="900" font-size="14" fill="#0C6837" text-anchor="middle">VALUE</text>
    <text x="200" y="204" font-family="system-ui, sans-serif" font-weight="800" font-size="11" fill="#DC2626" text-anchor="middle">PACK</text>
  `),

  'oil-terra.jpg': createSvg('#FEF9C3', 'CHOLESTEROL FREE', 'VEGETABLE OIL', 'Golden Terra • BTF • WGO', `
    <rect x="150" y="70" width="100" height="190" rx="14" fill="#FDE047" stroke="#CA8A04" stroke-width="3"/>
    <rect x="175" y="45" width="50" height="26" rx="4" fill="#A16207"/>
    <rect x="160" y="140" width="80" height="60" rx="6" fill="#15803D"/>
    <text x="200" y="165" font-family="system-ui, sans-serif" font-weight="900" font-size="11" fill="#FEF08A" text-anchor="middle">PURE</text>
    <text x="200" y="182" font-family="system-ui, sans-serif" font-weight="900" font-size="12" fill="#FFFFFF" text-anchor="middle">COOKING OIL</text>
  `)
};

for (const [filename, svg] of Object.entries(items)) {
  const filePath = path.join(outDir, filename);
  fs.writeFileSync(filePath, svg.trim());
}

console.log('Generated all 25 vector assets in /public/products!');
