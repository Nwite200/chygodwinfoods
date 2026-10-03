export type Product = {
  id: string;
  name: string;
  category: string;
  categoryName: string;
  brand: string;
  price: number;
  originalPrice: number;
  discount: string;
  rating: number;
  reviewsCount: number;
  image: string;
  thumbnails: string[];
  inStock: boolean;
  stockCount: number;
  badge: string;
  featured: boolean;
  description: string;
  features: string[];
  ingredients: string;
  nutrition: string;
  shippingInfo: string;
};

export const WEBSITE_BASE_URL = 'https://chygodwinfoods.netlify.app';

export const CATEGORIES = [
  { id: 'grains', name: 'Grains & Cereals', icon: '🌾', image: '/products/semovita.jpg' },
  { id: 'yam-cassava', name: 'Yam & Cassava', icon: '🥔', image: '/products/garri.jpg' },
  { id: 'beans-legumes', name: 'Beans & Legumes', icon: '🫘', image: '/products/beans.svg' },
  { id: 'oils-spices', name: 'Oils & Spices', icon: '🫒', image: '/products/palmoil.svg' },
  { id: 'seasonings', name: 'Seasonings', icon: '🧂', image: '/products/maggi.svg' },
  { id: 'frozen-foods', name: 'Frozen Foods', icon: '🐟', image: '/products/catfish.svg' },
  { id: 'drinks', name: 'Drinks & Beverages', icon: '🥤', image: '/products/tigernut.svg' },
  { id: 'others', name: 'Others', icon: '📦', image: '/products/omo.svg' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'honeywell-semovita-5kg',
    name: 'Honeywell Semovita 5kg',
    category: 'grains',
    categoryName: 'Grains & Cereals',
    brand: 'Honeywell',
    price: 12500,
    originalPrice: 14000,
    discount: '-11%',
    rating: 5.0,
    reviewsCount: 24,
    image: '/products/semovita.jpg',
    thumbnails: ['/products/semovita.jpg', '/hero.jpg', '/promo-packaged.jpg'],
    inStock: true,
    stockCount: 42,
    badge: 'Best Seller',
    featured: true,
    description: 'Honeywell Semovita ... perfect for delicious Nigerian swallow meals.',
    features: [
      '100% Natural Premium Granulated Wheat',
      'Rich in nutrients, fibre, and vitamins',
      'Great smooth swallow texture with zero lumps',
    ],
    ingredients: '100% Fortified Granulated Wheat Flour, Vitamin A, Iron, Folic Acid.',
    nutrition: 'Serving size 100g: Calories 360kcal, Carbohydrates 72g, Protein 11g, Fiber 4g.',
    shippingInfo: 'Dispatched within 24 hours. Free delivery in Anambra & Lagos for orders over ₦50,000.',
  },
  {
    id: 'golden-penny-gari-10kg',
    name: 'Golden Penny Gari 10kg',
    category: 'grains',
    categoryName: 'Grains & Cereals',
    brand: 'Golden Penny',
    price: 9000,
    originalPrice: 10500,
    discount: '-14%',
    rating: 4.9,
    reviewsCount: 38,
    image: '/products/garri.jpg',
    thumbnails: ['/products/garri.jpg', '/promo-harvest.jpg'],
    inStock: true,
    stockCount: 28,
    badge: 'Popular',
    featured: true,
    description: 'Finely processed, sand-free crisp Ijebu Garri.',
    features: [
      'Triple-sieved, sand-free guarantee',
      'Exceptional for soaking or hot eba',
      'Long shelf life and easy storage',
    ],
    ingredients: 'Fermented & roasted cassava pulp.',
    nutrition: 'Calories 350 kcal per 100g, sodium 0mg, total sugars 1g.',
    shippingInfo: 'Available for nationwide delivery. Stored in climate-controlled warehouses.',
  },
  {
    id: 'indomie-noodles-70g',
    name: 'Indomie Noodles 70g [Pack]',
    category: 'grains',
    categoryName: 'Grains & Cereals',
    brand: 'Indomie',
    price: 1200,
    originalPrice: 1400,
    discount: '-14%',
    rating: 4.8,
    reviewsCount: 112,
    image: '/products/indomie.jpg',
    thumbnails: ['/products/indomie.jpg', '/promo-packaged.jpg'],
    inStock: true,
    stockCount: 8,
    badge: 'Hot Deal',
    featured: true,
    description: 'Nigeria’s staple fast food favorite with savory seasoning powder and chili oil.',
    features: ['Ready in under 3 minutes', 'Fortified with vitamins', 'Loved by adults and children'],
    ingredients: 'Wheat flour, vegetable oil, iodized salt, chili powder, flavor enhancer, garlic.',
    nutrition: 'Serving size 70g: Calories 320, Fat 14g, Sodium 850mg.',
    shippingInfo: 'Ships within 1-2 business days.',
  },
  {
    id: 'bama-seasoning-100g',
    name: 'Bama Seasoning 100g',
    category: 'seasonings',
    categoryName: 'Seasonings',
    brand: 'Bama',
    price: 650,
    originalPrice: 800,
    discount: '-18%',
    rating: 4.7,
    reviewsCount: 19,
    image: '/products/bama.svg',
    thumbnails: ['/products/bama.svg'],
    inStock: true,
    stockCount: 5,
    badge: 'Kitchen Essential',
    featured: true,
    description: 'Aromatics and herbs for authentic Nigerian jollof, pepper soup and stews.',
    features: ['Rich savory aroma', 'Traditional herbs and garlic extracts', 'Zero artificial colorings'],
    ingredients: 'Coriander, white pepper, onion flakes, sea salt, ginger, thyme, African nutmeg.',
    nutrition: 'Calories: 15 per serving (5g).',
    shippingInfo: 'Standard dispatch.',
  },
  {
    id: 'tigernut-milk-1l',
    name: 'Tigernut Milk 1L (Kunun Aya)',
    category: 'drinks',
    categoryName: 'Drinks & Beverages',
    brand: 'ChyGodwin Select',
    price: 800,
    originalPrice: 1000,
    discount: '-20%',
    rating: 4.9,
    reviewsCount: 45,
    image: '/products/tigernut.svg',
    thumbnails: ['/products/tigernut.svg'],
    inStock: true,
    stockCount: 3,
    badge: 'Fresh & Cold',
    featured: true,
    description: 'Fresh artisanal Kunun Aya blended with dates and ginger.',
    features: ['Dairy-free, vegan-friendly', 'Naturally sweetened with dates', 'Rich in potassium and enzymes'],
    ingredients: 'Tigernuts, dates, ginger, spring water.',
    nutrition: 'Calories 140kcal per 250ml glass, potassium 300mg.',
    shippingInfo: 'Ships in temperature-controlled chill packs.',
  },
  {
    id: 'dried-beans-1kg',
    name: 'Dried Beans 1kg (Oloyin)',
    category: 'beans-legumes',
    categoryName: 'Beans & Legumes',
    brand: 'ChyGodwin Select',
    price: 2300,
    originalPrice: 2600,
    discount: '-12%',
    rating: 4.8,
    reviewsCount: 31,
    image: '/products/beans.svg',
    thumbnails: ['/products/beans.svg'],
    inStock: true,
    stockCount: 50,
    badge: 'Organic',
    featured: true,
    description: 'Premium Nigerian Honey Beans known for sweetness and tenderness.',
    features: ['Naturally sweet honey beans', 'Stone-picked and cleaned', 'High protein and fiber'],
    ingredients: '100% Selected Nigerian Brown Honey Beans.',
    nutrition: 'Protein: 22g per 100g, fiber: 16g, iron: 25% DV.',
    shippingInfo: 'Nationwide shipping available.',
  },
  {
    id: 'tropical-sun-palmoil-1l',
    name: 'Tropical Sun Palm Oil 1L',
    category: 'oils-spices',
    categoryName: 'Oils & Spices',
    brand: 'Tropical Sun',
    price: 1500,
    originalPrice: 1800,
    discount: '-16%',
    rating: 5.0,
    reviewsCount: 52,
    image: '/products/palmoil.svg',
    thumbnails: ['/products/palmoil.svg', '/hero.jpg'],
    inStock: true,
    stockCount: 65,
    badge: '100% Pure',
    featured: false,
    description: 'Unrefined red palm oil extracted from fresh Nigerian oil palm fruits.',
    features: ['Pure red oil without synthetic colorants', 'Beta-carotene and vitamin E', 'Authentic village-press aroma'],
    ingredients: '100% Pure Unadulterated Red Palm Oil.',
    nutrition: 'Vitamin E: 15mg per 15ml, beta-carotene support.',
    shippingInfo: 'Shipped in spill-proof safety sealed containers.',
  },
  {
    id: 'omo-washing-powder-900g',
    name: 'Omo Washing Powder 900g',
    category: 'others',
    categoryName: 'Others',
    brand: 'Omo',
    price: 2800,
    originalPrice: 3200,
    discount: '-12%',
    rating: 4.6,
    reviewsCount: 14,
    image: '/products/omo.svg',
    thumbnails: ['/products/omo.svg'],
    inStock: true,
    stockCount: 19,
    badge: 'Household',
    featured: false,
    description: 'Tough stain removal detergent for kitchen and household fabrics.',
    features: ['Removes grease and stains', 'Gentle on clothes fibers', 'Great floral scent'],
    ingredients: 'Surfactants, builders, optical brighteners, perfume.',
    nutrition: 'N/A - household product.',
    shippingInfo: 'Ships nationwide.',
  },
];

export const getImageUri = (path: string) => {
  if (!path) {
    return `${WEBSITE_BASE_URL}/products/semovita.jpg`;
  }

  return path.startsWith('http') ? path : `${WEBSITE_BASE_URL}${path}`;
};
