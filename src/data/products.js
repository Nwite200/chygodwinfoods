export const CATEGORIES = [
  { id: 'grains', name: 'Grains & Cereals', icon: '🌾', count: 18, image: '/products/semovita.jpg' },
  { id: 'yam-cassava', name: 'Yam & Cassava', icon: '🥔', count: 12, image: '/products/garri.jpg' },
  { id: 'beans-legumes', name: 'Beans & Legumes', icon: '🫘', count: 8, image: '/products/beans.svg' },
  { id: 'oils-spices', name: 'Oils & Spices', icon: '🫒', count: 14, image: '/products/palmoil.svg' },
  { id: 'seasonings', name: 'Seasonings', icon: '🧂', count: 11, image: '/products/maggi.svg' },
  { id: 'frozen-foods', name: 'Frozen Foods', icon: '🐟', count: 9, image: '/products/catfish.svg' },
  { id: 'drinks', name: 'Drinks & Beverages', icon: '🥤', count: 15, image: '/products/tigernut.svg' },
  { id: 'others', name: 'Others', icon: '📦', count: 7, image: '/products/omo.svg' }
];

export const BRANDS = [
  'Honeywell',
  'Golden Penny',
  'Indomie',
  'Tropical Sun',
  'Bama',
  'Maggi',
  'Milo',
  'Red Bull',
  'Omo',
  'ChyGodwin Select'
];

export const PRODUCTS = [
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
    thumbnails: [
      '/products/semovita.jpg',
      '/hero.jpg',
      '/promo-packaged.jpg'
    ],
    inStock: true,
    stockCount: 42,
    badge: 'Best Seller',
    featured: true,
    description: 'Honeywell Semovita is made from high quality, locally sourced cassava and premium granulated wheat. It is perfect for preparing delicious Nigerian swallow meals like eba, moi moi, and swallow.',
    features: [
      '100% Natural Premium Granulated Wheat',
      'Rich in Nutrients, Fibre, and Vitamins',
      'Great smooth swallow texture with zero lumps'
    ],
    ingredients: '100% Fortified Granulated Wheat Flour, Vitamin A, Iron, Folic Acid.',
    nutrition: 'Serving size 100g: Calories 360kcal, Carbohydrates 72g, Protein 11g, Dietary Fiber 4g, Fat 1.5g.',
    shippingInfo: 'Dispatched within 24 hours. Free delivery in Anambra & Lagos for orders over ₦50,000.'
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
    thumbnails: [
      '/products/garri.jpg',
      '/promo-harvest.jpg'
    ],
    inStock: true,
    stockCount: 28,
    badge: 'Popular',
    featured: true,
    description: 'Finely processed, sand-free crisp Ijebu Garri. Made from fresh mature cassava tubers. Exceptional for soaking with groundnuts, sugar, and milk, or prepared into firm hot Eba.',
    features: [
      'Triple-sieved, 100% sand-free guarantee',
      'Crisp pleasant sour tang characteristic of genuine Ijebu Garri',
      'Long shelf life, packed in food-grade moisture barrier sacks'
    ],
    ingredients: 'Fermented & roasted cassava pulp.',
    nutrition: 'Calories: 350 kcal per 100g, Sodium: 0mg, Total Sugars: 1g.',
    shippingInfo: 'Available for nationwide delivery. Stored in climate-controlled warehouses.'
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
    thumbnails: [
      '/products/indomie.jpg',
      '/promo-packaged.jpg'
    ],
    inStock: true,
    stockCount: 8, // triggers low stock alert in admin!
    badge: 'Hot Deal',
    featured: true,
    description: 'Nigeria’s staple fast food favorite! Indomie Instant Chicken Flavor noodles come with savory seasoning powder and seasoned chili oil for that irresistible authentic taste.',
    features: [
      'Ready in under 3 minutes',
      'Fortified with Vitamin A, B1, B6, B12 and minerals',
      'Loved by children and adults alike'
    ],
    ingredients: 'Wheat flour, vegetable oil, iodized salt, chili powder, flavor enhancer, garlic.',
    nutrition: 'Serving size 70g: Calories 320, Total Fat 14g, Sodium 850mg.',
    shippingInfo: 'Ships within 1-2 business days.'
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
    description: 'Special culinary aromatic spice blend formulated for authentic Nigerian jollof rice, pepper soup, tomato stews, and roasted chicken marinades.',
    features: [
      'Deep rich savory aroma',
      'Contains traditional herbs and garlic extracts',
      'Zero artificial colorings'
    ],
    ingredients: 'Coriander, white pepper, onion flakes, sea salt, ginger, thyme, African nutmeg.',
    nutrition: 'Calories: 15 per serving (5g).',
    shippingInfo: 'Standard dispatch.'
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
    description: 'Fresh artisanal Kunun Aya (Tigernut milk) blended with organic dates and spicy ginger. Lactose-free, creamy, and super nourishing plant-based refreshment.',
    features: [
      'Dairy-free, vegan-friendly superfood beverage',
      'Naturally sweetened with pressed dates (Dabino)',
      'Rich in potassium, magnesium, and healthy enzymes'
    ],
    ingredients: 'Tigernuts (Aya), Deglet Noor Dates, Fresh Ginger, Pure Spring Water.',
    nutrition: 'Calories 140kcal per 250ml glass, Potassium 300mg.',
    shippingInfo: 'Ships in temperature-controlled chill packs for maximum freshness.'
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
    description: 'Premium Nigerian Honey Beans (Ewa Oloyin) known for their distinctive sweetness, tender skin, and velvety texture when cooked. Perfect for porridge beans, moi moi, or akara.',
    features: [
      'Naturally sweet Honey Beans variety',
      'Thoroughly stone-picked and cleaned',
      'High protein, slow-burning complex carbs'
    ],
    ingredients: '100% Selected Nigerian Brown Honey Beans.',
    nutrition: 'Protein: 22g per 100g, Dietary Fiber: 16g, Iron: 25% DV.',
    shippingInfo: 'Nationwide shipping available.'
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
    description: 'Unrefined, virgin cold-pressed red palm oil extracted from farm-fresh Nigerian oil palm fruits. Essential for Banga soup, Ogbono, Egusi, and Ofe Onugbu.',
    features: [
      'Pure red oil without synthetic colorants or water dilution',
      'Packed with beta-carotene and Vitamin E Tocotrienols',
      'Authentic village-press aroma and deep crimson hue'
    ],
    ingredients: '100% Pure Unadulterated Red Palm Oil.',
    nutrition: 'Vitamin E: 15mg per 15ml, Vitamin A precursor beta-carotene.',
    shippingInfo: 'Shipped in spill-proof safety sealed containers.'
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
    description: 'Tough stain removal detergent with active enzymes. Keeps kitchen aprons and household linens pristine and fresh with lasting floral scent.',
    features: [
      'Removes stubborn grease and food stains in 1 wash',
      'Gentle on clothes fibers',
      'Suitable for handwash and top-load machines'
    ],
    ingredients: 'Surfactants, builders, optical brighteners, perfume.',
    nutrition: 'N/A - Non-food household item.',
    shippingInfo: 'Ships nationwide.'
  },
  {
    id: 'corned-beef-340g',
    name: 'Corned Beef 340g',
    category: 'seasonings',
    categoryName: 'Seasonings',
    brand: 'ChyGodwin Select',
    price: 1200,
    originalPrice: 1500,
    discount: '-20%',
    rating: 4.8,
    reviewsCount: 26,
    image: '/products/cornedbeef.svg',
    thumbnails: ['/products/cornedbeef.svg'],
    inStock: true,
    stockCount: 34,
    badge: 'Canned Meat',
    featured: false,
    description: 'Classic savory canned beef loaf. Great for making rich Nigerian corned beef stew for rice, yam chips, or breakfast egg omelette.',
    features: [
      'Tender cured beef seasoned with spices',
      'Easy-open key can',
      'Long ambient shelf life'
    ],
    ingredients: 'Cooked beef, beef broth, salt, sodium nitrite, sugar.',
    nutrition: 'Protein: 14g per serving, Iron: 12% DV.',
    shippingInfo: 'Safe ambient delivery.'
  },
  {
    id: 'maggi-cube-star-pack',
    name: 'Maggi Cube Star Pack (100 cubes)',
    category: 'seasonings',
    categoryName: 'Seasonings',
    brand: 'Maggi',
    price: 1500,
    originalPrice: 1750,
    discount: '-14%',
    rating: 5.0,
    reviewsCount: 89,
    image: '/products/maggi.svg',
    thumbnails: ['/products/maggi.svg'],
    inStock: true,
    stockCount: 75,
    badge: 'Iconic',
    featured: false,
    description: 'The heartbeat of West African cooking! Maggi Star Cubes bring that legendary umami depth to every pot of jollof rice, soup, and sauce.',
    features: [
      'Fortified with iron and iodine',
      'Disintegrates effortlessly in hot broth',
      'Rich caramelized onion and spice aroma'
    ],
    ingredients: 'Iodized salt, sugar, flavor enhancers, soy sauce, vegetable fat, caramel color.',
    nutrition: 'Sodium: 880mg per cube, Iron: 15% NRV.',
    shippingInfo: 'Ships nationwide.'
  },
  {
    id: 'red-bull-250ml',
    name: 'Red Bull Energy Drink 250ml',
    category: 'drinks',
    categoryName: 'Drinks & Beverages',
    brand: 'Red Bull',
    price: 1000,
    originalPrice: 1200,
    discount: '-17%',
    rating: 4.7,
    reviewsCount: 33,
    image: '/products/redbull.svg',
    thumbnails: ['/products/redbull.svg'],
    inStock: true,
    stockCount: 40,
    badge: 'Chilled',
    featured: false,
    description: 'Vitalizes body and mind! The world-famous energy drink with taurine and B-group vitamins to power your active workday.',
    features: [
      'Contains 80mg of caffeine per can',
      'Taurine, B-group vitamins B3, B5, B6, B12',
      'Best served ice cold'
    ],
    ingredients: 'Carbonated water, sucrose, glucose, citric acid, taurine, sodium citrates, caffeine.',
    nutrition: 'Calories: 110 per 250ml can.',
    shippingInfo: 'Ships safely.'
  },
  {
    id: 'milo-refill-400g',
    name: 'Milo Refill Pack 400g',
    category: 'drinks',
    categoryName: 'Drinks & Beverages',
    brand: 'Milo',
    price: 1400,
    originalPrice: 1650,
    discount: '-15%',
    rating: 4.9,
    reviewsCount: 78,
    image: '/products/milo.svg',
    thumbnails: ['/products/milo.svg'],
    inStock: true,
    stockCount: 22,
    badge: 'Breakfast Favorite',
    featured: false,
    description: 'The champion chocolate malt drink nourishing generations. Packed with Activ-Go, malt extract, cocoa, and 9 essential micronutrients.',
    features: [
      'Rich malted barley and cocoa flavour',
      'Formulated with Activ-Go for steady energy release',
      'Mixes hot or cold with milk'
    ],
    ingredients: 'Malt extract, sugar, skimmed milk powder, cocoa, palm olein, minerals, vitamins.',
    nutrition: 'Energy 160 kcal per serving with milk.',
    shippingInfo: 'Delivered in sealed moisture barrier pack.'
  },
  {
    id: 'gari-5kg-white',
    name: 'White Gari 5kg (Bendel)',
    category: 'grains',
    categoryName: 'Grains & Cereals',
    brand: 'ChyGodwin Select',
    price: 4500,
    originalPrice: 5000,
    discount: '-10%',
    rating: 4.8,
    reviewsCount: 41,
    image: '/products/garri.jpg',
    thumbnails: ['/products/garri.jpg'],
    inStock: true,
    stockCount: 30,
    badge: 'Local Harvest',
    featured: false,
    description: 'Pure white cassava gari from Bendel, crispy and dry. Exceptional swell ratio when drenched in boiling water for firm eba.',
    features: [
      'Zero sand, thoroughly washed before grating',
      'High swell volume',
      'Perfect for swallow or cold water snacks'
    ],
    ingredients: 'Cassava roots.',
    nutrition: '100% natural carbohydrates.',
    shippingInfo: 'Ships in sealed sack.'
  },
  {
    id: 'smoked-catfish-pack',
    name: 'Oven-Dried Smoked Catfish (Pack of 4)',
    category: 'frozen-foods',
    categoryName: 'Frozen Foods',
    brand: 'ChyGodwin Fresh',
    price: 5200,
    originalPrice: 6000,
    discount: '-13%',
    rating: 5.0,
    reviewsCount: 62,
    image: '/products/catfish.svg',
    thumbnails: ['/products/catfish.svg'],
    inStock: true,
    stockCount: 15,
    badge: 'Delicacy',
    featured: true,
    description: 'Cleanly gut-stripped, de-finned, and oven-smoked whole Nigerian catfish. Infuses Egusi, Bitterleaf, and Native Jollof rice with mouthwatering smoky depth.',
    features: [
      'Zero sand or soot, smoked with clean hardwood sawdust',
      'Bone-dry to prevent mold without refrigeration',
      'Tenderizes quickly in hot water'
    ],
    ingredients: 'Freshwater Catfish (Clarias gariepinus), sea salt.',
    nutrition: 'Omega-3 fatty acids, 24g protein per fish.',
    shippingInfo: 'Vacuum sealed for freshness.'
  },
  {
    id: 'abuja-yam-tubers',
    name: 'Abuja Yam Tubers (Pack of 3 Large)',
    category: 'yam-cassava',
    categoryName: 'Yam & Cassava',
    brand: 'ChyGodwin Select',
    price: 8500,
    originalPrice: 9500,
    discount: '-11%',
    rating: 4.9,
    reviewsCount: 47,
    image: '/products/yam.svg',
    thumbnails: ['/products/yam.svg'],
    inStock: true,
    stockCount: 20,
    badge: 'Farm Fresh',
    featured: false,
    description: 'Grade-A mature white yam tubers straight from northern Nigerian farms. Highly starchy and dry, ideal for pounding, boiling, frying, or roasting.',
    features: [
      'Solid heavy tubers, guaranteed rot-free',
      'Pounds easily into stretchy smooth pounded yam (Iyan)',
      'Sweet natural taste'
    ],
    ingredients: '100% Fresh White Dioscorea Yam Tubers.',
    nutrition: 'Potassium: 816mg per cup, Dietary fiber: 5g.',
    shippingInfo: 'Packed in cushioned crates.'
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'CSF20250930',
    date: 'Sep 30, 2025',
    customer: 'John Doe',
    email: 'john@example.com',
    items: [
      { name: 'Honeywell Semovita 5kg', qty: 1, price: 12500 },
      { name: 'Indomie Noodles 70g [Pack]', qty: 2, price: 1200 },
      { name: 'Tropical Sun Palm Oil 1L', qty: 1, price: 1500 }
    ],
    total: 16700,
    status: 'Delivered',
    paymentMethod: 'Card (Mastercard)',
    tracking: 'TRK-NG-982410'
  },
  {
    id: 'CSF20250921',
    date: 'Sep 21, 2025',
    customer: 'Chinedu Okeke',
    email: 'chinedu.o@gmail.com',
    items: [
      { name: 'Golden Penny Gari 10kg', qty: 1, price: 9000 },
      { name: 'Maggi Cube Star Pack', qty: 2, price: 1500 }
    ],
    total: 12000,
    status: 'In Transit',
    paymentMethod: 'Bank Transfer',
    tracking: 'TRK-NG-884210'
  },
  {
    id: 'CSF20250912',
    date: 'Sep 12, 2025',
    customer: 'Ngozi Eze',
    email: 'ngozi.eze@outlook.com',
    items: [
      { name: 'Smoked Dried Catfish (Pack of 4)', qty: 2, price: 5200 },
      { name: 'Abuja Yam Tubers (Pack of 3 Large)', qty: 1, price: 8500 }
    ],
    total: 18900,
    status: 'Processing',
    paymentMethod: 'Card (Visa)',
    tracking: 'TRK-NG-773199'
  }
];

export const PROMO_CODES = {
  CHY10: { type: 'percent', value: 10, label: '10% Discount Applied' },
  FREESHIP: { type: 'shipping', value: 1500, label: 'Free Standard Shipping' },
  NAIJA20: { type: 'percent', value: 20, label: '20% Naija Independence Promo' }
};
