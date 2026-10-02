import fs from 'fs';
import path from 'path';

const outDir = './public/products';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const svgItems = {
  'palmoil.jpg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <rect width="400" height="400" fill="#F8FAFC"/>
  <circle cx="200" cy="200" r="140" fill="#FEF3C7" opacity="0.4"/>
  <!-- Bottle Shape -->
  <rect x="155" y="70" width="90" height="35" rx="6" fill="#F59E0B"/>
  <rect x="180" y="45" width="40" height="28" rx="4" fill="#B45309"/>
  <path d="M 155 105 Q 120 160 125 320 Q 125 350 200 350 Q 275 350 275 320 Q 280 160 245 105 Z" fill="#DC2626"/>
  <!-- Liquid glow -->
  <path d="M 140 160 Q 132 230 135 320 Q 160 340 200 340 Q 240 340 265 320 Q 268 230 260 160 Z" fill="#EA580C"/>
  <path d="M 150 170 Q 145 230 148 310 Q 170 325 200 325 Q 230 325 252 310 Q 255 230 250 170 Z" fill="#F97316"/>
  <!-- Reflection highlight -->
  <path d="M 145 150 Q 140 220 142 300" stroke="#FFF" stroke-width="6" stroke-linecap="round" opacity="0.4" fill="none"/>
  <!-- Label -->
  <rect x="135" y="190" width="130" height="95" rx="8" fill="#FBBF24" stroke="#D97706" stroke-width="2"/>
  <rect x="142" y="196" width="116" height="24" rx="4" fill="#047857"/>
  <text x="200" y="213" font-family="system-ui, sans-serif" font-weight="900" font-size="12" fill="#FFFFFF" text-anchor="middle">TROPICAL SUN</text>
  <text x="200" y="240" font-family="system-ui, sans-serif" font-weight="900" font-size="16" fill="#991B1B" text-anchor="middle">PALM OIL</text>
  <text x="200" y="258" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#78350F" text-anchor="middle">100% PURE &amp; NATURAL</text>
  <rect x="175" y="265" width="50" height="15" rx="7" fill="#DC2626"/>
  <text x="200" y="276" font-family="system-ui, sans-serif" font-weight="800" font-size="9" fill="#FFF" text-anchor="middle">1 LITRE</text>
</svg>`,

  'bama.jpg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <rect width="400" height="400" fill="#F8FAFC"/>
  <circle cx="200" cy="200" r="140" fill="#DCFCE7" opacity="0.4"/>
  <!-- Jar -->
  <rect x="160" y="70" width="80" height="35" rx="8" fill="#15803D"/>
  <rect x="135" y="105" width="130" height="225" rx="20" fill="#FEF08A" stroke="#E2E8F0" stroke-width="2"/>
  <!-- Label -->
  <rect x="140" y="145" width="120" height="135" rx="10" fill="#166534"/>
  <circle cx="200" cy="180" r="22" fill="#FACC15"/>
  <text x="200" y="186" font-family="system-ui, sans-serif" font-weight="900" font-size="18" fill="#15803D" text-anchor="middle">B</text>
  <text x="200" y="222" font-family="system-ui, sans-serif" font-weight="900" font-size="20" fill="#FFFFFF" text-anchor="middle">BAMA</text>
  <text x="200" y="242" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#FEF08A" text-anchor="middle">SEASONING</text>
  <rect x="165" y="252" width="70" height="18" rx="9" fill="#FACC15"/>
  <text x="200" y="265" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="#166534" text-anchor="middle">100g SPICE</text>
</svg>`,

  'tigernut.jpg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <rect width="400" height="400" fill="#F8FAFC"/>
  <circle cx="200" cy="200" r="140" fill="#F1F5F9" opacity="0.5"/>
  <!-- Glass bottle -->
  <rect x="175" y="45" width="50" height="25" rx="4" fill="#B45309"/>
  <path d="M 170 70 L 230 70 L 235 110 L 255 140 L 255 330 Q 255 345 240 345 L 160 345 Q 145 345 145 330 L 145 140 L 165 110 Z" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="3"/>
  <!-- Milk Liquid -->
  <path d="M 150 145 L 250 145 L 250 330 Q 250 340 240 340 L 160 340 Q 150 340 150 330 Z" fill="#FEF3C7"/>
  <!-- Label -->
  <rect x="155" y="195" width="90" height="95" rx="8" fill="#78350F"/>
  <text x="200" y="222" font-family="system-ui, sans-serif" font-weight="900" font-size="12" fill="#FDE68A" text-anchor="middle">CHYGODWIN</text>
  <text x="200" y="242" font-family="system-ui, sans-serif" font-weight="900" font-size="14" fill="#FFFFFF" text-anchor="middle">TIGERNUT</text>
  <text x="200" y="258" font-family="system-ui, sans-serif" font-weight="800" font-size="12" fill="#FBBF24" text-anchor="middle">MILK 1L</text>
  <text x="200" y="275" font-family="system-ui, sans-serif" font-weight="600" font-size="9" fill="#FFF" text-anchor="middle">KUNUN AYA</text>
</svg>`,

  'beans.jpg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <rect width="400" height="400" fill="#F8FAFC"/>
  <circle cx="200" cy="200" r="140" fill="#FEF3C7" opacity="0.4"/>
  <!-- Sack bag -->
  <path d="M 150 110 Q 200 120 250 110 L 275 310 Q 275 345 200 345 Q 125 345 125 310 Z" fill="#D97706" stroke="#B45309" stroke-width="4"/>
  <!-- Sack fold top -->
  <ellipse cx="200" cy="115" rx="55" ry="18" fill="#F59E0B" stroke="#B45309" stroke-width="3"/>
  <rect x="150" y="180" width="100" height="90" rx="8" fill="#FFF" opacity="0.9"/>
  <text x="200" y="210" font-family="system-ui, sans-serif" font-weight="900" font-size="15" fill="#78350F" text-anchor="middle">DRIED BEANS</text>
  <text x="200" y="230" font-family="system-ui, sans-serif" font-weight="700" font-size="12" fill="#B45309" text-anchor="middle">EWA OLOYIN</text>
  <text x="200" y="252" font-family="system-ui, sans-serif" font-weight="900" font-size="14" fill="#047857" text-anchor="middle">1KG</text>
</svg>`,

  'omo.jpg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <rect width="400" height="400" fill="#F8FAFC"/>
  <circle cx="200" cy="200" r="140" fill="#DBEAFE" opacity="0.5"/>
  <!-- Box / Pouch -->
  <rect x="135" y="80" width="130" height="250" rx="14" fill="#2563EB" stroke="#1D4ED8" stroke-width="3"/>
  <!-- Color splash -->
  <circle cx="200" cy="180" r="48" fill="#EF4444"/>
  <circle cx="200" cy="180" r="38" fill="#F59E0B"/>
  <text x="200" y="192" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="#FFFFFF" text-anchor="middle">OMO</text>
  <text x="200" y="255" font-family="system-ui, sans-serif" font-weight="800" font-size="12" fill="#FFFFFF" text-anchor="middle">FAST ACTION</text>
  <text x="200" y="275" font-family="system-ui, sans-serif" font-weight="700" font-size="13" fill="#FEF08A" text-anchor="middle">900g</text>
</svg>`,

  'cornedbeef.jpg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <rect width="400" height="400" fill="#F8FAFC"/>
  <circle cx="200" cy="200" r="140" fill="#FEE2E2" opacity="0.4"/>
  <!-- Trapezoid tin can -->
  <polygon points="145,95 255,95 270,305 130,305" fill="#991B1B" stroke="#7F1D1D" stroke-width="4"/>
  <ellipse cx="200" cy="95" rx="55" ry="12" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2"/>
  <!-- Key tab -->
  <rect x="195" y="65" width="10" height="25" fill="#94A3B8"/>
  <circle cx="200" cy="65" r="8" fill="#94A3B8"/>
  <rect x="145" y="150" width="110" height="90" rx="6" fill="#FBBF24"/>
  <text x="200" y="180" font-family="system-ui, sans-serif" font-weight="900" font-size="14" fill="#991B1B" text-anchor="middle">CORNED</text>
  <text x="200" y="202" font-family="system-ui, sans-serif" font-weight="900" font-size="18" fill="#991B1B" text-anchor="middle">BEEF</text>
  <text x="200" y="224" font-family="system-ui, sans-serif" font-weight="800" font-size="11" fill="#78350F" text-anchor="middle">340g NET</text>
</svg>`,

  'maggi.jpg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <rect width="400" height="400" fill="#F8FAFC"/>
  <circle cx="200" cy="200" r="140" fill="#FEF08A" opacity="0.5"/>
  <!-- Cube Box -->
  <rect x="130" y="100" width="140" height="200" rx="14" fill="#EAB308" stroke="#CA8A04" stroke-width="4"/>
  <rect x="130" y="145" width="140" height="110" fill="#DC2626"/>
  <!-- Star -->
  <polygon points="200,160 206,178 225,178 210,190 216,208 200,196 184,208 190,190 175,178 194,178" fill="#FBBF24"/>
  <text x="200" y="235" font-family="system-ui, sans-serif" font-weight="900" font-size="24" fill="#FFFFFF" text-anchor="middle">MAGGI</text>
  <text x="200" y="280" font-family="system-ui, sans-serif" font-weight="800" font-size="12" fill="#713F12" text-anchor="middle">STAR CUBES 100PK</text>
</svg>`,

  'redbull.jpg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <rect width="400" height="400" fill="#F8FAFC"/>
  <circle cx="200" cy="200" r="140" fill="#DBEAFE" opacity="0.4"/>
  <!-- Can -->
  <rect x="155" y="80" width="90" height="240" rx="16" fill="#1E3A8A" stroke="#CBD5E1" stroke-width="3"/>
  <ellipse cx="200" cy="80" rx="45" ry="12" fill="#E2E8F0"/>
  <!-- Silver-blue squares -->
  <polygon points="155,140 245,100 245,170 155,210" fill="#CBD5E1"/>
  <!-- Sun & bulls -->
  <circle cx="200" cy="190" r="24" fill="#FACC15"/>
  <text x="200" y="235" font-family="system-ui, sans-serif" font-weight="900" font-size="15" fill="#DC2626" text-anchor="middle">Red Bull</text>
  <text x="200" y="275" font-family="system-ui, sans-serif" font-weight="800" font-size="11" fill="#FFFFFF" text-anchor="middle">ENERGY DRINK 250ml</text>
</svg>`,

  'milo.jpg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <rect width="400" height="400" fill="#F8FAFC"/>
  <circle cx="200" cy="200" r="140" fill="#DCFCE7" opacity="0.4"/>
  <!-- Green pack -->
  <rect x="135" y="80" width="130" height="240" rx="16" fill="#15803D" stroke="#166534" stroke-width="4"/>
  <circle cx="200" cy="180" r="42" fill="#78350F"/>
  <text x="200" y="190" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="#FACC15" text-anchor="middle">MILO</text>
  <rect x="150" y="235" width="100" height="22" rx="11" fill="#FACC15"/>
  <text x="200" y="250" font-family="system-ui, sans-serif" font-weight="900" font-size="11" fill="#15803D" text-anchor="middle">ACTIV-GO</text>
  <text x="200" y="285" font-family="system-ui, sans-serif" font-weight="700" font-size="12" fill="#FFFFFF" text-anchor="middle">400g Refill</text>
</svg>`,

  'catfish.jpg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <rect width="400" height="400" fill="#F8FAFC"/>
  <circle cx="200" cy="200" r="140" fill="#FEF3C7" opacity="0.4"/>
  <!-- Smoked fish pack -->
  <rect x="125" y="80" width="150" height="240" rx="14" fill="#451A03" stroke="#292524" stroke-width="3"/>
  <circle cx="200" cy="160" r="32" fill="#78350F"/>
  <!-- Fish icon -->
  <path d="M 175 160 Q 200 145 220 160 Q 200 175 175 160 Z" fill="#F59E0B"/>
  <text x="200" y="220" font-family="system-ui, sans-serif" font-weight="900" font-size="13" fill="#FDE68A" text-anchor="middle">SMOKED CATFISH</text>
  <text x="200" y="240" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#E2E8F0" text-anchor="middle">Oven-Dried • Clean</text>
  <rect x="165" y="258" width="70" height="20" rx="10" fill="#15803D"/>
  <text x="200" y="272" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="#FFF" text-anchor="middle">PACK OF 4</text>
</svg>`,

  'yam.jpg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <rect width="400" height="400" fill="#F8FAFC"/>
  <circle cx="200" cy="200" r="140" fill="#FEF9C3" opacity="0.4"/>
  <!-- Yam tubers -->
  <ellipse cx="170" cy="210" rx="35" ry="95" transform="rotate(-15 170 210)" fill="#78350F" stroke="#451A03" stroke-width="3"/>
  <ellipse cx="230" cy="210" rx="38" ry="95" transform="rotate(15 230 210)" fill="#92400E" stroke="#451A03" stroke-width="3"/>
  <rect x="140" y="270" width="120" height="35" rx="8" fill="#15803D"/>
  <text x="200" y="288" font-family="system-ui, sans-serif" font-weight="900" font-size="12" fill="#FFFFFF" text-anchor="middle">ABUJA YAM</text>
  <text x="200" y="300" font-family="system-ui, sans-serif" font-weight="700" font-size="9" fill="#DCFCE7" text-anchor="middle">3 LARGE TUBERS</text>
</svg>`
};

for (const [filename, svg] of Object.entries(svgItems)) {
  const filePath = path.join(outDir, filename);
  // write SVG content to this file (browsers will render SVG even with .jpg or we can keep .svg)
  fs.writeFileSync(filePath, svg.trim());
}

console.log('All product mock assets generated successfully!');
