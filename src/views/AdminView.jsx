import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  RefreshCw,
  Truck,
  Eye,
  EyeOff,
  Check,
  Lock,
  Unlock,
  Upload,
  Image as ImageIcon,
  BarChart2,
  Activity,
  Flame,
  Calendar,
  Layers
} from 'lucide-react';
import { CATEGORIES, STORE_INFO } from '../data/products';

export default function AdminView({
  products = [],
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetProducts,
  orders = [],
  onUpdateOrderStatus,
  onNavigate
}) {
  // Authentication State
  // No credentials live in the browser. Login is verified server-side by
  // netlify/functions/admin-login.mjs (scrypt + 5-fail/15-min IP & email lockout
  // persisted in Netlify Blobs) via POST /api/admin-login.
  const LOGIN_ENDPOINT = '/api/admin-login';
  const SESSION_KEY = 'chygodwin_admin_token';
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionChecking, setSessionChecking] = useState(true);
  const [adminSessionEmail, setAdminSessionEmail] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Restore session: token is HMAC-signed by the server (forging it client-side
  // is impossible), so this check also runs against the function.
  useEffect(() => {
    let cancelled = false;
    let token = null;
    try {
      token = sessionStorage.getItem(SESSION_KEY);
      sessionStorage.removeItem('chygodwin_admin_auth'); // legacy insecure flag
    } catch {
      // ignore
    }
    if (!token) {
      setSessionChecking(false);
      return () => {
        cancelled = true;
      };
    }
    fetch(LOGIN_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'verify', token }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data?.ok) {
          setIsAuthenticated(true);
          setAdminSessionEmail(data.email || '');
        } else {
          try {
            sessionStorage.removeItem(SESSION_KEY);
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {
        // Function unreachable (e.g. plain `npm run dev`) — require a fresh login.
        try {
          sessionStorage.removeItem(SESSION_KEY);
        } catch {
          // ignore
        }
      })
      .finally(() => {
        if (!cancelled) setSessionChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'analytics', 'orders', 'business'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [inlinePriceId, setInlinePriceId] = useState(null);
  const [inlinePriceVal, setInlinePriceVal] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Graph / Analytics timeframe
  const [timeframe, setTimeframe] = useState('30d'); // '7d', '30d', '12m'
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // File Upload Ref
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Form State for Upload & Edit
  const initialForm = {
    name: '',
    category: 'grains-tubers',
    brand: 'Chygodwin Select',
    price: '',
    originalPrice: '',
    stockCount: 25,
    inStock: true,
    badge: 'Popular',
    image: '/products/combo.jpg',
    description: '',
    features: '',
    ingredients: '',
    nutrition: '',
    shippingInfo: 'Waybilled and delivered Nationwide and beyond from Nkwelle Light of God estate.'
  };

  const [formData, setFormData] = useState(initialForm);

  const showFeedback = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  // Preset image choices
  const imagePresets = [
    { label: 'Food Combo', path: '/products/combo.jpg' },
    { label: 'Palm Oil', path: '/products/palmoil.jpg' },
    { label: 'Cooking Oil', path: '/products/oil-terra.jpg' },
    { label: 'Rice Sack', path: '/products/rice.jpg' },
    { label: 'Yam Tubers', path: '/products/yam.jpg' },
    { label: 'White Garri', path: '/products/garri.jpg' },
    { label: 'Beans & Seeds', path: '/products/beans.jpg' },
    { label: 'Dates / Superfood', path: '/products/dates.jpg' },
    { label: 'Tigernuts', path: '/products/tigernut.jpg' },
    { label: 'Soyabeans', path: '/products/soyabeans.jpg' },
    { label: 'Cashew Nuts', path: '/products/cashew.jpg' },
    { label: 'Smoked Fish', path: '/products/catfish.jpg' },
    { label: 'Stockfish Head', path: '/products/stockfish.jpg' },
    { label: 'Egusi Melon', path: '/products/egusi.jpg' },
    { label: 'Ador Ogbonno', path: '/products/ogbono.jpg' },
    { label: 'Crayfish', path: '/products/crayfish.jpg' },
    { label: 'Spices & Pepper', path: '/products/spices.jpg' },
    { label: 'Dried Leaves', path: '/products/leaves.jpg' },
    { label: 'Spaghetti', path: '/products/spaghetti.jpg' },
    { label: 'Tomatoes', path: '/products/tomatoes.jpg' },
    { label: 'Yellow Pap', path: '/products/pap.jpg' },
    { label: 'Special Flour', path: '/products/flour.jpg' },
    { label: 'Crunchy Kulikuli', path: '/products/kulikuli.jpg' },
    { label: 'Spicy Kilishi', path: '/products/kilishi.jpg' },
    { label: 'Soft Kpomo', path: '/products/kpomo.jpg' },
    { label: 'Pure Honey', path: '/products/honey.jpg' },
    { label: 'Granola', path: '/products/granola.jpg' },
    { label: 'Greek Yoghurt', path: '/products/yogurt.jpg' },
    { label: 'Abacha Salad', path: '/products/abacha.jpg' },
    { label: 'Onions Penter', path: '/products/onions.jpg' },
    { label: 'Traditional Ogiri', path: '/products/ogiri.jpg' },
    { label: 'Knorr Maggi', path: '/products/maggi.jpg' }
  ];

  // Handle Admin Login — verification is 100% server-side. One generic error
  // for a wrong email and a wrong password; the lockout (5 fails / 15 min per
  // IP + per email, persisted in Netlify Blobs) is enforced by the function.
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      const res = await fetch(LOGIN_ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok && data?.token) {
        try {
          sessionStorage.setItem(SESSION_KEY, data.token);
        } catch {
          // ignore
        }
        setIsAuthenticated(true);
        setAdminSessionEmail(data.email || '');
        setAuthPassword('');
        showFeedback('Welcome, Admin! Management Console unlocked.');
        return;
      }
      // 401 (bad credentials) and 429 (locked out) both come back as one
      // safe-to-display message from the server.
      setAuthError(data?.error || 'Invalid email or password. Access denied.');
    } catch {
      setAuthError('Could not reach the login service. Check your connection and try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminSessionEmail('');
    setAuthEmail('');
    setAuthPassword('');
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
    showFeedback('You have logged out of the Admin Console.');
  };

  // Handle File Input Change (PNG / JPEG)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPEG, JPG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const rawBase64 = event.target?.result;
      if (!rawBase64) return;
      // Compress image to max 400×400 JPEG @ 0.7 quality to avoid localStorage quota overflow
      const img = new window.Image();
      img.onload = () => {
        const MAX = 400;
        let w = img.width;
        let h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
          else       { w = Math.round(w * MAX / h); h = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL('image/jpeg', 0.7);
        setFormData((prev) => ({ ...prev, image: compressed }));
        setImagePreview(compressed);
        showFeedback(`Image "${file.name}" loaded & optimized!`);
      };
      img.onerror = () => {
        // Fallback: use raw base64 if Image() fails for some reason
        setFormData((prev) => ({ ...prev, image: rawBase64 }));
        setImagePreview(rawBase64);
        showFeedback(`Image "${file.name}" loaded successfully!`);
      };
      img.src = rawBase64;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Open upload modal
  const handleOpenUpload = () => {
    setEditingProduct(null);
    setFormData(initialForm);
    setImagePreview(initialForm.image);
    setShowUploadModal(true);
  };

  // Open edit modal
  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    const initialImg = product.image || '/products/combo.jpg';
    setFormData({
      name: product.name,
      category: product.category,
      brand: product.brand || 'Chygodwin Select',
      price: product.price,
      originalPrice: product.originalPrice || '',
      stockCount: product.stockCount ?? 20,
      inStock: product.inStock !== false,
      badge: product.badge || 'Popular',
      image: initialImg,
      description: product.description || '',
      features: Array.isArray(product.features) ? product.features.join('\n') : product.features || '',
      ingredients: product.ingredients || '',
      nutrition: product.nutrition || '',
      shippingInfo: product.shippingInfo || 'Waybilled and delivered Nationwide and beyond from Nkwelle Light of God estate.'
    });
    setImagePreview(initialImg);
    setShowUploadModal(true);
  };

  // Save product
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      alert('Please fill in product name and price.');
      return;
    }

    const priceNum = Number(formData.price);
    const origPriceNum = formData.originalPrice ? Number(formData.originalPrice) : Math.round(priceNum * 1.15);
    const discountStr = origPriceNum > priceNum ? `-${Math.round(((origPriceNum - priceNum) / origPriceNum) * 100)}%` : '';

    const categoryObj = CATEGORIES.find((c) => c.id === formData.category);
    const featuresList = formData.features
      ? formData.features.split('\n').map((f) => f.trim()).filter(Boolean)
      : ['Fresh farm-sourced quality', 'Carefully cleaned & packed', 'Waybilled nationwide'];

    const productPayload = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: formData.name.trim(),
      category: formData.category,
      categoryName: categoryObj ? categoryObj.name : 'Nigerian Foodstuff',
      brand: formData.brand.trim() || 'Chygodwin Select',
      price: priceNum,
      originalPrice: origPriceNum,
      discount: discountStr,
      stockCount: Number(formData.stockCount) || 20,
      inStock: Boolean(formData.inStock),
      badge: formData.badge,
      image: formData.image,
      thumbnails: [formData.image],
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewsCount: editingProduct ? editingProduct.reviewsCount : 12,
      description: formData.description.trim() || `Premium authentic ${formData.name.trim()} sourced directly from trusted farmers. Prepared clean and fresh for your family cooking.`,
      features: featuresList,
      ingredients: formData.ingredients.trim() || `100% Selected ${formData.name.trim()}.`,
      nutrition: formData.nutrition.trim() || 'Rich in natural vitamins, minerals, and healthy dietary energy.',
      shippingInfo: formData.shippingInfo.trim() || 'Waybilled and delivered Nationwide and beyond from Nkwelle Light of God estate.'
    };

    if (editingProduct) {
      if (onUpdateProduct) onUpdateProduct(productPayload);
      showFeedback(`Successfully updated "${productPayload.name}"!`);
    } else {
      if (onAddProduct) onAddProduct(productPayload);
      showFeedback(`Successfully uploaded "${productPayload.name}" to store catalog!`);
    }

    setShowUploadModal(false);
  };

  // Inline price edit
  const handleSaveInlinePrice = (product) => {
    const newPrice = Number(inlinePriceVal);
    if (isNaN(newPrice) || newPrice <= 0) {
      alert('Please enter a valid price in Naira.');
      return;
    }
    const updated = {
      ...product,
      price: newPrice,
      originalPrice: product.originalPrice && product.originalPrice > newPrice ? product.originalPrice : Math.round(newPrice * 1.15)
    };
    if (onUpdateProduct) onUpdateProduct(updated);
    setInlinePriceId(null);
    showFeedback(`Price for "${product.name}" changed to ₦${newPrice.toLocaleString()}!`);
  };

  const handleToggleStock = (product) => {
    const updated = { ...product, inStock: !product.inStock };
    if (onUpdateProduct) onUpdateProduct(updated);
    showFeedback(`${product.name} marked as ${updated.inStock ? 'In Stock' : 'Out of Stock'}.`);
  };

  const handleQuickRestock = (product, count = 20) => {
    const updated = { ...product, stockCount: (Number(product.stockCount) || 0) + count, inStock: true };
    if (onUpdateProduct) onUpdateProduct(updated);
    showFeedback(`Added ${count} units to ${product.name}! New stock: ${updated.stockCount}`);
  };

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesBrand = p.brand?.toLowerCase().includes(query);
        const matchesCat = p.categoryName?.toLowerCase().includes(query);
        const matchesDesc = p.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesCat && !matchesDesc) return false;
      }
      return true;
    });
  }, [products, selectedCategory, searchTerm]);

  // Inventory & Stock Metrics
  const stockMetrics = useMemo(() => {
    const totalUnits = products.reduce((acc, p) => acc + (Number(p.stockCount) || 0), 0);
    const outOfStock = products.filter((p) => !p.inStock || p.stockCount === 0);
    const lowStock = products.filter((p) => p.inStock && p.stockCount > 0 && p.stockCount <= 15);
    const healthyStock = products.filter((p) => p.inStock && p.stockCount > 15);
    const totalVal = products.reduce((acc, p) => acc + (Number(p.price) || 0) * (Number(p.stockCount) || 0), 0);
    return { totalUnits, outOfStock, lowStock, healthyStock, totalVal };
  }, [products]);

  // Trending Stock / Fast-Moving Items
  const trendingStock = useMemo(() => {
    const priorities = [
      'food-combo-70k',
      'dates-powder',
      'pure-palm-oil',
      'tubers-of-yams',
      'white-garri-crisp',
      'ador-ogbonno-seeds',
      'handpeel-egusi',
      'bags-of-rice-50kg',
      'calabar-crayfish-blended',
      'tigernuts-healthy-mix-powder',
      'spicy-kilishi',
      'pure-natural-honey-1l'
    ];
    return products
      .filter((p) => priorities.includes(p.id) || p.badge?.includes('Best') || p.badge?.includes('Popular'))
      .slice(0, 8)
      .map((p, idx) => ({
        ...p,
        monthlyVelocity: 120 - idx * 10,
        runwayDays: Math.max(3, Math.round((p.stockCount || 20) / (idx === 0 ? 3 : 2))),
        trendStatus: idx < 3 ? '🔥 High Demand' : idx < 6 ? '⚡ Fast Mover' : '📈 Rising Staple'
      }));
  }, [products]);

  // Graph Data Plot for "How the Business is Going"
  const graphDatasets = {
    '7d': {
      title: 'Last 7 Days Sales Trend',
      totalRevenue: '₦685,000',
      totalOrders: '38 orders',
      growth: '+18.4%',
      points: [
        { label: 'Mon', rev: 72000, orders: 4 },
        { label: 'Tue', rev: 95000, orders: 5 },
        { label: 'Wed', rev: 84000, orders: 4 },
        { label: 'Thu', rev: 110000, orders: 7 },
        { label: 'Fri', rev: 135000, orders: 8 },
        { label: 'Sat', rev: 104000, orders: 6 },
        { label: 'Sun', rev: 85000, orders: 4 }
      ]
    },
    '30d': {
      title: 'Last 30 Days Business Performance',
      totalRevenue: '₦2,845,600',
      totalOrders: '142 orders',
      growth: '+28.5%',
      points: [
        { label: 'Week 1', rev: 590000, orders: 28 },
        { label: 'Week 2', rev: 720000, orders: 36 },
        { label: 'Week 3', rev: 685000, orders: 34 },
        { label: 'Week 4', rev: 850600, orders: 44 }
      ]
    },
    '12m': {
      title: '12 Months Annual Growth & Waybill Volume',
      totalRevenue: '₦28,400,000',
      totalOrders: '1,420 orders',
      growth: '+42.1%',
      points: [
        { label: 'Nov', rev: 1800000, orders: 90 },
        { label: 'Dec', rev: 3200000, orders: 160 },
        { label: 'Jan', rev: 1950000, orders: 98 },
        { label: 'Feb', rev: 2100000, orders: 105 },
        { label: 'Mar', rev: 2400000, orders: 120 },
        { label: 'Apr', rev: 2350000, orders: 118 },
        { label: 'May', rev: 2600000, orders: 130 },
        { label: 'Jun', rev: 2500000, orders: 125 },
        { label: 'Jul', rev: 2750000, orders: 138 },
        { label: 'Aug', rev: 2680000, orders: 134 },
        { label: 'Sep', rev: 2850000, orders: 142 },
        { label: 'Oct', rev: 3220000, orders: 160 }
      ]
    }
  };

  const activeGraph = graphDatasets[timeframe];

  // SVG Graph Coordinate Computation
  const svgWidth = 720;
  const svgHeight = 260;
  const paddingX = 45;
  const paddingY = 35;
  const maxRev = Math.max(...activeGraph.points.map((p) => p.rev)) * 1.15;

  const getCoordinates = (points) => {
    return points.map((p, index) => {
      const x = paddingX + (index / (points.length - 1)) * (svgWidth - paddingX * 2);
      const y = svgHeight - paddingY - (p.rev / maxRev) * (svgHeight - paddingY * 2);
      return { x, y, ...p };
    });
  };

  const coords = getCoordinates(activeGraph.points);
  const pathD = coords.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${svgHeight - paddingY} L ${coords[0].x} ${svgHeight - paddingY} Z`;

  // IF NOT AUTHENTICATED: Display Password-Protected Login Gate
  if (!isAuthenticated) {
    // Still verifying an existing session token — avoid flashing the form.
    if (sessionChecking) {
      return (
        <div className="section-pad" style={{ background: '#062E1D', minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: '#BBF7D0', fontWeight: 700, letterSpacing: '0.04em' }}>Checking session…</div>
        </div>
      );
    }
    return (
      <div className="section-pad" style={{ background: '#062E1D', minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 440, padding: 16 }}>
          <div
            style={{
              background: 'var(--surface-card)',
              borderRadius: 20,
              padding: 36,
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
              border: '1px solid var(--border-green)',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'var(--surface-green-tint)',
                color: 'var(--text-green-strong)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}
            >
              <Lock size={32} />
            </div>

            <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-green)', letterSpacing: '0.08em' }}>
              Restricted Management Area
            </span>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: 'var(--text-heading)', margin: '6px 0 8px 0' }}>
              Admin Console Login
            </h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: 24 }}>
              Enter your authorized store credentials to manage products, pricing, picture uploads, and inventory graphs.
            </p>

            {authError && (
              <div
                style={{
                  background: 'var(--surface-danger)',
                  border: '1px solid var(--text-danger)',
                  color: 'var(--text-danger)',
                  borderRadius: 10,
                  padding: '10px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  marginBottom: 18,
                  textAlign: 'left'
                }}
              >
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
              <div className="form-field" style={{ marginBottom: 16 }}>
                <label className="form-label">Admin Email Address</label>
                <input
                  type="email"
                  required
                  autoComplete="username"
                  placeholder="Enter admin email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '0.9rem' }}
                />
              </div>

              <div className="form-field" style={{ marginBottom: 20 }}>
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="Enter admin password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="form-input"
                    style={{ fontSize: '0.9rem', paddingRight: 40 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary-pill"
                disabled={isLoggingIn}
                style={{ width: '100%', padding: '12px', fontSize: '0.95rem', fontWeight: 800, justifyContent: 'center', opacity: isLoggingIn ? 0.7 : 1, cursor: isLoggingIn ? 'wait' : 'pointer' }}
              >
                <Unlock size={17} /> {isLoggingIn ? 'Verifying…' : 'Unlock Admin Console'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED: Display Full Management Suite
  return (
    <div className="section-pad" style={{ background: 'var(--surface-subtle)', minHeight: '85vh' }}>
      <div className="section-container">
        {/* Feedback Alert Toast */}
        {feedbackMsg && (
          <div
            style={{
              position: 'fixed',
              top: 80,
              right: 24,
              background: '#062E1D',
              color: '#FFFFFF',
              padding: '12px 20px',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              zIndex: 3000,
              border: '1px solid #22C55E'
            }}
          >
            <CheckCircle2 size={18} color="#22C55E" />
            <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>{feedbackMsg}</span>
          </div>
        )}

        {/* Top Header Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-green)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Store Management • Nkwelle Light of God Estate
              </span>
              <span style={{ background: 'var(--surface-green-tint)', color: 'var(--text-green-strong)', padding: '2px 8px', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 800 }}>
                Admin Verified
              </span>
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-heading)', margin: '4px 0 0 0' }}>
              Chygodwin Control Console
            </h1>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Signed in as Console Admin (browser keeps no email or hash)
            </span>

            <button
              className="btn-primary-pill"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', fontSize: '0.85rem' }}
              onClick={handleOpenUpload}
            >
              <Plus size={16} /> Upload New Product
            </button>

            <button
              onClick={() => onNavigate && onNavigate('shop')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 9999,
                background: 'var(--surface-card)',
                border: '1px solid var(--border-strong)',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--text-body)'
              }}
            >
              <Eye size={15} /> Customer Shop
            </button>

            <button
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 9999,
                background: 'var(--surface-danger)',
                border: '1px solid var(--text-danger)',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--text-danger)',
                cursor: 'pointer'
              }}
              title="Lock Admin Console"
            >
              <Lock size={14} /> Lock &amp; Logout
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="admin-metric-grid" style={{ marginBottom: 28 }}>
          <div className="admin-card">
            <div className="admin-card-header">
              <span className="stat-title">Catalog Inventory</span>
              <Package size={20} color="#0C6837" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-heading)' }}>{products.length} Products</div>
            <div style={{ marginTop: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--text-success)', fontWeight: 700 }}>{stockMetrics.totalUnits.toLocaleString()} total units</span> in warehouse
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <span className="stat-title">Trending &amp; Fast Movers</span>
              <Flame size={20} color="#F97316" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-warn)' }}>{trendingStock.length} Staples</div>
            <div style={{ marginTop: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              High customer reorder rate
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <span className="stat-title">Stock Health &amp; Alerts</span>
              <AlertTriangle size={20} color="#DC2626" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: stockMetrics.lowStock.length > 0 ? 'var(--text-danger)' : 'var(--text-success)' }}>
              {stockMetrics.lowStock.length} Low Stock
            </div>
            <div style={{ marginTop: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {stockMetrics.outOfStock.length} items out of stock
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <span className="stat-title">Monthly Sales Growth</span>
              <TrendingUp size={20} color="#16A34A" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-heading)' }}>{activeGraph.growth}</div>
            <div style={{ marginTop: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Gross Volume: <strong style={{ color: 'var(--text-green)' }}>{activeGraph.totalRevenue}</strong>
            </div>
          </div>
        </div>

        {/* Main Tab Navigation */}
        <div style={{ display: 'flex', gap: 10, borderBottom: '2px solid var(--border-light)', paddingBottom: 12, marginBottom: 24, overflowX: 'auto' }}>
          <button
            onClick={() => setActiveTab('inventory')}
            style={{
              padding: '9px 20px',
              borderRadius: 8,
              fontSize: '0.88rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: activeTab === 'inventory' ? '#0C6837' : 'var(--surface-card)',
              color: activeTab === 'inventory' ? '#FFFFFF' : 'var(--text-body)',
              boxShadow: activeTab === 'inventory' ? '0 2px 8px rgba(12,104,55,0.25)' : 'none'
            }}
          >
            <Package size={16} /> Products &amp; Price Changes ({filteredProducts.length})
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            style={{
              padding: '9px 20px',
              borderRadius: 8,
              fontSize: '0.88rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: activeTab === 'analytics' ? '#0C6837' : 'var(--surface-card)',
              color: activeTab === 'analytics' ? '#FFFFFF' : 'var(--text-body)',
              boxShadow: activeTab === 'analytics' ? '0 2px 8px rgba(12,104,55,0.25)' : 'none'
            }}
          >
            <BarChart2 size={16} /> Inventory &amp; Business Graph Plots
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '9px 20px',
              borderRadius: 8,
              fontSize: '0.88rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: activeTab === 'orders' ? '#0C6837' : 'var(--surface-card)',
              color: activeTab === 'orders' ? '#FFFFFF' : 'var(--text-body)'
            }}
          >
            <Truck size={16} /> Store Orders &amp; Waybill Tracking ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('business')}
            style={{
              padding: '9px 20px',
              borderRadius: 8,
              fontSize: '0.88rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: activeTab === 'business' ? '#0C6837' : 'var(--surface-card)',
              color: activeTab === 'business' ? '#FFFFFF' : 'var(--text-body)'
            }}
          >
            🏢 Moniepoint &amp; Location Profile
          </button>
        </div>

        {/* TAB 1: PRODUCTS, PRICE CHANGES & PICTURE UPLOAD */}
        {activeTab === 'inventory' && (
          <div>
            {/* Filter and Search Bar */}
            <div
              style={{
                background: 'var(--surface-card)',
                borderRadius: 14,
                padding: '16px 20px',
                border: '1px solid var(--border-light)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 14,
                marginBottom: 20
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 260 }}>
                <Search size={18} style={{ color: 'var(--text-light)' }} />
                <input
                  type="text"
                  placeholder="Search products by name, description, brand..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.9rem' }}
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} style={{ color: 'var(--text-light)' }} title="Clear search">
                    <X size={16} />
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--border-strong)',
                    fontSize: '0.85rem',
                    background: 'var(--surface-subtle)',
                    fontWeight: 600,
                    color: 'var(--text-strong)'
                  }}
                >
                  <option value="">All Categories ({products.length})</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({products.filter((p) => p.category === c.id).length})
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleOpenUpload}
                  className="btn-primary-pill"
                  style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                >
                  <Plus size={15} /> Upload Product &amp; Picture
                </button>

                {onResetProducts && (
                  <button
                    onClick={() => {
                      if (confirm('Reset store catalog to the official 62 items list?')) {
                        onResetProducts();
                      }
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--border-light)',
                      background: 'var(--surface-raised)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: 'var(--text-body)',
                      cursor: 'pointer'
                    }}
                    title="Restore fresh 62 products catalog"
                  >
                    <RefreshCw size={14} style={{ display: 'inline', marginRight: 4 }} /> Reset Defaults
                  </button>
                )}
              </div>
            </div>

            {/* Products Table */}
            <div className="form-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="orders-table" style={{ margin: 0 }}>
                  <thead style={{ background: 'var(--surface-subtle)' }}>
                    <tr>
                      <th style={{ width: 70 }}>Picture</th>
                      <th>Product Name &amp; Description</th>
                      <th>Category</th>
                      <th>Price (₦) [Quick Edit]</th>
                      <th>Inventory Stock</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                          No products found matching "{searchTerm}". Try clearing your filters or upload a new item.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <div
                              style={{
                                width: 50,
                                height: 50,
                                borderRadius: 8,
                                background: 'var(--surface-subtle)',
                                border: '1px solid var(--border-light)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                padding: 2
                              }}
                            >
                              <img
                                src={p.image}
                                alt={p.name}
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                onError={(e) => { e.target.src = '/hero.jpg'; }}
                              />
                            </div>
                          </td>

                          <td style={{ maxWidth: 280 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <strong style={{ color: 'var(--text-heading)', fontSize: '0.9rem' }}>{p.name}</strong>
                              {p.badge && (
                                <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: 'var(--surface-green-tint)', color: 'var(--text-green-strong)' }}>
                                  {p.badge}
                                </span>
                              )}
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.76rem', margin: '4px 0 0 0', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {p.description}
                            </p>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>Brand: {p.brand || 'Chygodwin Select'}</span>
                          </td>

                          <td>
                            <span style={{ fontSize: '0.8rem', background: 'var(--surface-raised)', color: 'var(--text-body)', padding: '4px 8px', borderRadius: 6, fontWeight: 600 }}>
                              {p.categoryName || p.category}
                            </span>
                          </td>

                          {/* Quick Price Editor */}
                          <td>
                            {inlinePriceId === p.id ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ fontWeight: 800, color: 'var(--text-green)' }}>₦</span>
                                <input
                                  type="number"
                                  autoFocus
                                  value={inlinePriceVal}
                                  onChange={(e) => setInlinePriceVal(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveInlinePrice(p);
                                    if (e.key === 'Escape') setInlinePriceId(null);
                                  }}
                                  style={{
                                    width: 100,
                                    padding: '4px 8px',
                                    borderRadius: 6,
                                    border: '2px solid #0C6837',
                                    fontSize: '0.88rem',
                                    fontWeight: 700
                                  }}
                                />
                                <button
                                  onClick={() => handleSaveInlinePrice(p)}
                                  style={{ background: '#0C6837', color: '#FFF', padding: '4px 8px', borderRadius: 6, border: 'none', cursor: 'pointer' }}
                                  title="Save Price"
                                >
                                  <Check size={14} />
                                </button>
                                <button
                                  onClick={() => setInlinePriceId(null)}
                                  style={{ background: 'var(--surface-raised)', color: 'var(--text-body)', padding: '4px 8px', borderRadius: 6, border: 'none', cursor: 'pointer' }}
                                  title="Cancel"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div>
                                  <div style={{ fontSize: '0.98rem', fontWeight: 900, color: 'var(--text-heading)' }}>
                                    ₦{Number(p.price).toLocaleString()}
                                  </div>
                                  {p.originalPrice && p.originalPrice > p.price && (
                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                                      ₦{Number(p.originalPrice).toLocaleString()}
                                    </div>
                                  )}
                                </div>
                                <button
                                  onClick={() => {
                                    setInlinePriceId(p.id);
                                    setInlinePriceVal(p.price);
                                  }}
                                  style={{
                                    background: 'var(--surface-mint)',
                                    border: '1px solid var(--border-green)',
                                    borderRadius: 6,
                                    padding: '3px 8px',
                                    fontSize: '0.72rem',
                                    color: 'var(--text-green)',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                  }}
                                  title="Quick change price"
                                >
                                  Edit Price
                                </button>
                              </div>
                            )}
                          </td>

                          {/* Inventory Stock Status */}
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <button
                                  onClick={() => handleToggleStock(p)}
                                  style={{
                                    background: p.inStock ? 'var(--surface-green-tint)' : 'var(--surface-danger)',
                                    color: p.inStock ? 'var(--text-green-strong)' : 'var(--text-danger)',
                                    padding: '2px 8px',
                                    borderRadius: 9999,
                                    fontSize: '0.72rem',
                                    fontWeight: 800,
                                    border: 'none',
                                    cursor: 'pointer'
                                  }}
                                  title="Click to toggle stock status"
                                >
                                  {p.inStock ? '● In Stock' : '✕ Out of Stock'}
                                </button>
                                <span style={{ fontSize: '0.75rem', color: p.stockCount <= 15 ? 'var(--text-danger)' : 'var(--text-muted)', fontWeight: p.stockCount <= 15 ? 800 : 500 }}>
                                  ({p.stockCount ?? 20} left)
                                </span>
                              </div>
                              {p.stockCount <= 15 && (
                                <button
                                  onClick={() => handleQuickRestock(p, 20)}
                                  style={{
                                    fontSize: '0.68rem',
                                    color: 'var(--text-green)',
                                    fontWeight: 700,
                                    textDecoration: 'underline',
                                    textAlign: 'left',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0
                                  }}
                                >
                                  + Restock 20 units
                                </button>
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: 6 }}>
                              <button
                                onClick={() => handleOpenEdit(p)}
                                style={{
                                  background: 'var(--surface-raised)',
                                  color: 'var(--text-heading)',
                                  padding: '6px 10px',
                                  borderRadius: 6,
                                  border: '1px solid var(--border-strong)',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4
                                }}
                                title="Edit details, price, description & picture"
                              >
                                <Edit2 size={13} /> Edit / Change Picture
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete "${p.name}" from the store catalog?`)) {
                                    if (onDeleteProduct) onDeleteProduct(p.id);
                                    showFeedback(`Deleted "${p.name}".`);
                                  }
                                }}
                                style={{
                                  background: 'var(--surface-danger)',
                                  color: 'var(--text-danger)',
                                  padding: '6px 8px',
                                  borderRadius: 6,
                                  border: '1px solid var(--text-danger)',
                                  cursor: 'pointer'
                                }}
                                title="Delete product"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY ANALYTICS & BUSINESS GRAPH PLOTS */}
        {activeTab === 'analytics' && (
          <div>
            {/* Top Graph Container */}
            <div className="form-card" style={{ marginBottom: 24, padding: '24px 28px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 20 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Activity size={18} color="#0C6837" />
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-green)', letterSpacing: '0.06em' }}>
                      Revenue &amp; Waybill Trajectory
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-heading)', margin: '4px 0 0 0' }}>
                    {activeGraph.title}
                  </h2>
                </div>

                {/* Timeframe Buttons */}
                <div style={{ display: 'flex', gap: 6, background: 'var(--surface-raised)', padding: 4, borderRadius: 10 }}>
                  <button
                    onClick={() => setTimeframe('7d')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 6,
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      background: timeframe === '7d' ? 'var(--surface-card)' : 'transparent',
                      color: timeframe === '7d' ? 'var(--text-green)' : 'var(--text-muted)',
                      boxShadow: timeframe === '7d' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    7 Days
                  </button>
                  <button
                    onClick={() => setTimeframe('30d')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 6,
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      background: timeframe === '30d' ? 'var(--surface-card)' : 'transparent',
                      color: timeframe === '30d' ? 'var(--text-green)' : 'var(--text-muted)',
                      boxShadow: timeframe === '30d' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    30 Days
                  </button>
                  <button
                    onClick={() => setTimeframe('12m')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 6,
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      background: timeframe === '12m' ? 'var(--surface-card)' : 'transparent',
                      color: timeframe === '12m' ? 'var(--text-green)' : 'var(--text-muted)',
                      boxShadow: timeframe === '12m' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    12 Months
                  </button>
                </div>
              </div>

              {/* Chart Summary Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24, padding: 14, background: 'var(--surface-subtle)', borderRadius: 12, border: '1px solid var(--border-light)' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Gross Sales Volume</span>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-heading)', marginTop: 2 }}>{activeGraph.totalRevenue}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Orders Fulfilled</span>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0284C7', marginTop: 2 }}>{activeGraph.totalOrders}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Average Order Value</span>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-success)', marginTop: 2 }}>₦20,040</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Nationwide Delivery Rate</span>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-accent)', marginTop: 2 }}>99.2%</div>
                </div>
              </div>

              {/* Responsive SVG Area & Line Plot */}
              <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  style={{ width: '100%', height: 'auto', minWidth: 500, overflow: 'visible' }}
                >
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#16A34A" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#16A34A" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  {[0.25, 0.5, 0.75, 1].map((ratio, i) => {
                    const y = svgHeight - paddingY - ratio * (svgHeight - paddingY * 2);
                    const val = Math.round((ratio * maxRev) / 1000) * 1000;
                    return (
                      <g key={i}>
                        <line
                          x1={paddingX}
                          y1={y}
                          x2={svgWidth - paddingX}
                          y2={y}
                          style={{ stroke: 'var(--border-light)' }}
                          strokeDasharray="4 4"
                          strokeWidth="1"
                        />
                        <text
                          x={paddingX - 8}
                          y={y + 4}
                          textAnchor="end"
                          fontSize="10"
                          style={{ fill: 'var(--text-light)' }}
                          fontFamily="sans-serif"
                        >
                          ₦{(val / 1000).toFixed(0)}k
                        </text>
                      </g>
                    );
                  })}

                  {/* Shaded Area fill */}
                  <path d={areaD} fill="url(#revenueGradient)" />

                  {/* Smooth Line Path */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#0C6837"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data Points */}
                  {coords.map((pt, i) => {
                    const isHovered = hoveredPoint?.label === pt.label;
                    return (
                      <g key={i}>
                        {/* Vertical line indicator on hover */}
                        {isHovered && (
                          <line
                            x1={pt.x}
                            y1={paddingY}
                            x2={pt.x}
                            y2={svgHeight - paddingY}
                            stroke="#0C6837"
                            strokeWidth="1.5"
                            strokeDasharray="3 3"
                          />
                        )}

                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isHovered ? 7 : 5}
                          stroke="#0C6837"
                          strokeWidth={isHovered ? 3 : 2.5}
                          style={{ fill: 'var(--surface-card)', cursor: 'pointer', transition: 'all 0.15s ease' }}
                          onMouseEnter={() => setHoveredPoint(pt)}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />

                        {/* X-Axis Labels */}
                        <text
                          x={pt.x}
                          y={svgHeight - 12}
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight="700"
                          style={{ fill: 'var(--text-muted)' }}
                          fontFamily="sans-serif"
                        >
                          {pt.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Floating Interactive Tooltip */}
                {hoveredPoint && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 20,
                      background: '#062E1D',
                      color: '#FFFFFF',
                      padding: '8px 14px',
                      borderRadius: 8,
                      fontSize: '0.82rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      pointerEvents: 'none'
                    }}
                  >
                    <div style={{ fontWeight: 800, color: '#4ADE80' }}>{hoveredPoint.label}</div>
                    <div>Revenue: <strong>₦{hoveredPoint.rev.toLocaleString()}</strong></div>
                    <div style={{ fontSize: '0.74rem', color: '#CBD5E1' }}>Orders: {hoveredPoint.orders} parcels</div>
                  </div>
                )}
              </div>
            </div>

            {/* 2 Columns: Trending Fast-Moving Stock & Category Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
              {/* Trending Stock */}
              <div className="form-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Flame size={20} color="#EA580C" />
                    <h3 className="form-title" style={{ margin: 0 }}>Trending &amp; High Velocity Staples</h3>
                  </div>
                  <span style={{ fontSize: '0.72rem', background: 'var(--surface-warn)', color: 'var(--text-warn)', padding: '3px 8px', borderRadius: 9999, fontWeight: 800 }}>
                    Fastest Selling
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {trendingStock.map((item, idx) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 12,
                        background: 'var(--surface-subtle)',
                        borderRadius: 10,
                        border: '1px solid var(--border-light)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            background: idx < 3 ? '#0C6837' : 'var(--surface-raised)',
                            color: idx < 3 ? '#FFF' : 'var(--text-body)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 800
                          }}
                        >
                          #{idx + 1}
                        </div>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'contain', background: 'var(--surface-card)', border: '1px solid var(--border-light)' }}
                          onError={(e) => { e.target.src = '/hero.jpg'; }}
                        />
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-heading)' }}>{item.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            ₦{Number(item.price).toLocaleString()} • {item.stockCount} in stock
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: 'var(--surface-green-tint)', color: 'var(--text-green-strong)', display: 'inline-block' }}>
                          {item.trendStatus}
                        </span>
                        <div style={{ fontSize: '0.72rem', color: item.runwayDays <= 5 ? 'var(--text-danger)' : 'var(--text-muted)', fontWeight: 700, marginTop: 4 }}>
                          ~{item.runwayDays} days runway
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Sales Distribution */}
              <div className="form-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Layers size={20} color="#0C6837" />
                    <h3 className="form-title" style={{ margin: 0 }}>Category Revenue Contribution</h3>
                  </div>
                  <span style={{ fontSize: '0.72rem', background: 'var(--surface-info)', color: 'var(--text-info)', padding: '3px 8px', borderRadius: 9999, fontWeight: 800 }}>
                    Market Share
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    { name: 'Mega Food Combos (70k & 160k)', pct: 36, rev: '₦1,024,400', color: 'var(--text-green)' },
                    { name: 'Grains, Flours & Swallows', pct: 24, rev: '₦682,900', color: 'var(--text-success)' },
                    { name: 'Cooking & Palm Oils', pct: 18, rev: '₦512,200', color: 'var(--text-amber)' },
                    { name: 'Soup Essentials & Egusi', pct: 12, rev: '₦341,500', color: '#0284C7' },
                    { name: 'Healthy Mixes, Dates & Snacks', pct: 10, rev: '₦284,600', color: 'var(--text-accent)' }
                  ].map((cat, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, color: 'var(--text-strong)' }}>{cat.name}</span>
                        <span style={{ fontWeight: 800, color: cat.color }}>{cat.rev} ({cat.pct}%)</span>
                      </div>
                      <div style={{ width: '100%', height: 8, background: 'var(--surface-raised)', borderRadius: 9999, overflow: 'hidden' }}>
                        <div style={{ width: `${cat.pct}%`, height: '100%', background: cat.color, borderRadius: 9999 }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Logistics Fulfillment Insight */}
                <div style={{ marginTop: 24, padding: 16, background: 'var(--surface-mint)', borderRadius: 12, border: '1px solid var(--border-green)' }}>
                  <div style={{ fontWeight: 800, color: 'var(--text-green-strong)', fontSize: '0.85rem' }}>
                    🚚 Nationwide Waybill Summary
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-body)', marginTop: 4, lineHeight: '1.5' }}>
                    Waybills originating from Nkwelle Light of God estate maintain an average transit time of <strong>2.1 business days</strong> to Lagos, Abuja, Port Harcourt, and diaspora freight hubs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STORE ORDERS & WAYBILLS */}
        {activeTab === 'orders' && (
          <div className="form-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 className="form-title" style={{ margin: 0 }}>Recent Customer Orders &amp; Waybills</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  Waybilled nationwide from Nkwelle Light of God estate with tracking codes.
                </p>
              </div>
              <span style={{ fontSize: '0.8rem', background: 'var(--surface-green-tint)', color: 'var(--text-green-strong)', padding: '4px 12px', borderRadius: 9999, fontWeight: 700 }}>
                {orders.length} Total Orders
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Waybill Tracking</th>
                    <th>Items Ordered</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr key={ord.id}>
                      <td><strong style={{ color: 'var(--text-heading)' }}>#{ord.id}</strong></td>
                      <td>
                        <strong>{ord.customer}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.email}</div>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, background: 'var(--surface-raised)', padding: '3px 8px', borderRadius: 4, color: 'var(--text-green)' }}>
                          {ord.tracking || 'TRK-NG-WAYBILL'}
                        </span>
                      </td>
                      <td style={{ maxWidth: 220, fontSize: '0.8rem' }}>
                        {ord.items && ord.items.length > 0
                          ? ord.items.map((i) => `${i.name} (x${i.quantity || 1})`).join(', ')
                          : 'Foodstuff Provision Pack'}
                      </td>
                      <td><strong style={{ color: 'var(--text-heading)' }}>₦{ord.total.toLocaleString()}</strong></td>
                      <td>
                        <span style={{ fontSize: '0.78rem', background: 'var(--surface-mint)', color: 'var(--text-green-strong)', padding: '3px 8px', borderRadius: 4, fontWeight: 700 }}>
                          {ord.paymentMethod || 'Moniepoint Transfer'}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            ord.status === 'Delivered'
                              ? 'status-delivered'
                              : ord.status === 'In Transit'
                              ? 'status-transit'
                              : 'status-processing'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td>
                        <select
                          value={ord.status}
                          onChange={(e) => {
                            if (onUpdateOrderStatus) onUpdateOrderStatus(ord.id, e.target.value);
                            showFeedback(`Order #${ord.id} marked as ${e.target.value}`);
                          }}
                          style={{
                            padding: '4px 8px',
                            borderRadius: 6,
                            border: '1px solid var(--border-strong)',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}
                        >
                          <option value="Processing">Processing</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: MONIEPOINT & BUSINESS PROFILE */}
        {activeTab === 'business' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {/* Bank Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, #062E1D 0%, #0C6837 100%)',
                color: '#FFFFFF',
                borderRadius: 20,
                padding: 28,
                boxShadow: '0 10px 25px rgba(12,104,55,0.25)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4ADE80' }}>
                  Official Bank Account
                </span>
                <span style={{ background: '#22C55E', color: '#042416', padding: '4px 10px', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 900 }}>
                  Active Moniepoint
                </span>
              </div>

              <div style={{ fontSize: '0.82rem', color: '#D1D5DB' }}>Account Number:</div>
              <div style={{ fontSize: '2.1rem', fontWeight: 900, letterSpacing: '0.06em', color: '#FEF08A', margin: '4px 0 16px 0' }}>
                {STORE_INFO.bank.accountNumber || '•••• ••••'}
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 14 }}>
                <div style={{ fontSize: '0.82rem', color: '#D1D5DB' }}>Account Name:</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', marginTop: 2 }}>
                  {STORE_INFO.bank.accountName || 'Chygodwin Foodstuffs Global Concept'}
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: '0.82rem', color: '#D1D5DB' }}>Bank Name:</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#86EFAC', marginTop: 2 }}>
                  {STORE_INFO.bank.bankName || 'Moniepoint Microfinance Bank'}
                </div>
              </div>

              <div style={{ marginTop: 20, background: 'rgba(255,255,255,0.1)', padding: 12, borderRadius: 10, fontSize: '0.78rem', color: '#E2E8F0' }}>
                All payments made during checkout go straight into this Moniepoint account. Customers submit transfer receipts via WhatsApp to {STORE_INFO.phone}.
              </div>
            </div>

            {/* Address & Waybill Card */}
            <div className="form-card">
              <h3 className="form-title">Physical Shop Address</h3>
              <div style={{ background: 'var(--surface-subtle)', padding: 16, borderRadius: 12, border: '1px solid var(--border-light)', marginBottom: 20 }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Store Location:</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-heading)', marginTop: 4 }}>
                  Nkwelle Light of God estate
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-body)', marginTop: 2 }}>
                  Anambra State, Nigeria
                </div>
              </div>

              <h3 className="form-title">Nationwide Logistics &amp; Waybill</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-body)', lineHeight: '1.6' }}>
                <strong>We waybill and deliver Nationwide and beyond.</strong> High-volume foodstuff parcels, bags of rice, yam tubers, pure palm oil jerrycans, and delicate dried leaves are safely packaged and sent across all 36 Nigerian states and international diaspora destinations.
              </p>

              <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: 6 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Primary Phone / WhatsApp:</span>
                  <strong>{STORE_INFO.phone}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: 6 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Value Proposition:</span>
                  <strong>Quality &amp; affordable prices</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Authorized Admin:</span>
                  <strong>{adminSessionEmail || 'Verified session'}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCT UPLOAD & EDIT MODAL (WITH PNG/JPEG PICTURE UPLOAD) */}
        {showUploadModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3500,
              padding: 16
            }}
            onClick={() => setShowUploadModal(false)}
          >
            <div
              style={{
                background: 'var(--surface-card)',
                borderRadius: 20,
                width: '100%',
                maxWidth: 720,
                maxHeight: '92vh',
                overflowY: 'auto',
                padding: 32,
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowUploadModal(false)}
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  background: 'var(--surface-raised)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} style={{ color: 'var(--text-muted)' }} />
              </button>

              <div style={{ marginBottom: 20 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-green)', textTransform: 'uppercase' }}>
                  {editingProduct ? 'Inventory & Picture Update' : 'New Product Upload'}
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-heading)', margin: '4px 0 0 0' }}>
                  {editingProduct ? `Edit "${editingProduct.name}"` : 'Upload Foodstuff Product & Image'}
                </h2>
              </div>

              <form onSubmit={handleSaveProduct}>
                {/* 1. PRODUCT PICTURE UPLOAD ZONE (PNG / JPEG) */}
                <div style={{ marginBottom: 22, background: 'var(--surface-subtle)', padding: 18, borderRadius: 14, border: '1px solid var(--border-light)' }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <ImageIcon size={16} color="#0C6837" />
                    <strong>Product Picture (Upload PNG / JPEG / WEBP) *</strong>
                  </label>

                  <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Live Image Box Preview */}
                    <div
                      style={{
                        width: 110,
                        height: 110,
                        borderRadius: 12,
                        background: 'var(--surface-card)',
                        border: '2px solid var(--border-strong)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        padding: 6,
                        flexShrink: 0
                      }}
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          onError={(e) => { e.target.src = '/hero.jpg'; }}
                        />
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>No Image</span>
                      )}
                    </div>

                    {/* Drag-and-drop or select button */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      style={{
                        flex: 1,
                        minWidth: 240,
                        padding: 16,
                        borderRadius: 10,
                        border: `2px dashed ${isDragging ? '#0C6837' : 'var(--border-strong)'}`,
                        background: isDragging ? 'var(--surface-green-tint)' : 'var(--surface-card)',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                      />
                      <Upload size={24} color="#0C6837" style={{ margin: '0 auto 6px auto' }} />
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-strong)' }}>
                        Click to browse or drag &amp; drop picture here
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        Supports PNG, JPG, JPEG, and WebP (Automatically sized to fit the store)
                      </div>
                    </div>
                  </div>

                  {/* Preset Quick Selectors */}
                  <div style={{ marginTop: 14 }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                      Or choose from popular staple presets:
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 90, overflowY: 'auto' }}>
                      {imagePresets.slice(0, 14).map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, image: preset.path }));
                            setImagePreview(preset.path);
                          }}
                          style={{
                            padding: '3px 8px',
                            borderRadius: 4,
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: formData.image === preset.path ? '#0C6837' : 'var(--surface-card)',
                            color: formData.image === preset.path ? '#FFFFFF' : 'var(--text-body)',
                            border: '1px solid var(--border-strong)'
                          }}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Product Name */}
                <div className="form-field" style={{ marginBottom: 16 }}>
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dates powder, Tubers of yams, Pure palm oil..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                  />
                </div>

                {/* Category & Brand Grid */}
                <div className="form-grid-2" style={{ marginBottom: 16 }}>
                  <div className="form-field">
                    <label className="form-label">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="form-input"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="form-label">Brand</label>
                    <input
                      type="text"
                      placeholder="e.g. Chygodwin Select, Golden Terra..."
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Price & Original Price Grid */}
                <div className="form-grid-2" style={{ marginBottom: 16 }}>
                  <div className="form-field">
                    <label className="form-label">Sale Price (₦) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 3500"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Original / Compare Price (₦)</label>
                    <input
                      type="number"
                      placeholder="e.g. 4200 (optional strikethrough)"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Stock Count & Badge Grid */}
                <div className="form-grid-2" style={{ marginBottom: 16 }}>
                  <div className="form-field">
                    <label className="form-label">Stock Quantity</label>
                    <input
                      type="number"
                      value={formData.stockCount}
                      onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Product Badge</label>
                    <select
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="form-input"
                    >
                      <option value="Popular">Popular</option>
                      <option value="Best Seller">Best Seller</option>
                      <option value="Fresh Batch">Fresh Batch</option>
                      <option value="100% Pure">100% Pure</option>
                      <option value="Hot Deal">Hot Deal</option>
                      <option value="Organic">Organic</option>
                      <option value="Mega Value">Mega Value</option>
                    </select>
                  </div>
                </div>

                {/* In Stock Checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                  <input
                    type="checkbox"
                    id="inStockCheckModal"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    style={{ width: 18, height: 18, accentColor: '#0C6837' }}
                  />
                  <label htmlFor="inStockCheckModal" style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-strong)', cursor: 'pointer' }}>
                    Available in Stock for immediate nationwide waybill
                  </label>
                </div>

                {/* Product Description */}
                <div className="form-field" style={{ marginBottom: 16 }}>
                  <label className="form-label">Product Description *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter detailed description of the foodstuff item, origins, texture, preparation guide, and culinary benefits..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="form-input"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {/* Key Features */}
                <div className="form-field" style={{ marginBottom: 16 }}>
                  <label className="form-label">Key Highlights / Features (One per line)</label>
                  <textarea
                    rows={3}
                    placeholder="Stone-free and 100% natural&#10;Rich in essential nutrients&#10;Cooks fast and tender"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="form-input"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {/* Ingredients & Shipping */}
                <div className="form-grid-2" style={{ marginBottom: 24 }}>
                  <div className="form-field">
                    <label className="form-label">Ingredients</label>
                    <input
                      type="text"
                      placeholder="e.g. 100% Selected Sun-Dried Dates"
                      value={formData.ingredients}
                      onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Shipping Notice</label>
                    <input
                      type="text"
                      value={formData.shippingInfo}
                      onChange={(e) => setFormData({ ...formData, shippingInfo: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Submit & Cancel Buttons */}
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: 9999,
                      background: 'var(--surface-raised)',
                      border: '1px solid var(--border-strong)',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: 'var(--text-body)',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn-primary-pill"
                    style={{ padding: '10px 28px', fontSize: '0.88rem' }}
                  >
                    {editingProduct ? 'Save Product Changes' : 'Upload Product & Picture'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
