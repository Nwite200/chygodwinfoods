import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './views/HomeView';
import ShopView from './views/ShopView';
import ProductDetailView from './views/ProductDetailView';
import CartDrawer from './views/CartDrawer';
import CheckoutView from './views/CheckoutView';
import AccountView from './views/AccountView';
import AdminView from './views/AdminView';
import MobilePhoneMockup from './views/MobilePhoneMockup';
import { PRODUCTS, INITIAL_ORDERS } from './data/products';
import { Check } from 'lucide-react';
import { isSupabaseConfigured, supabase } from './supabase';

export default function App() {
  const [activeView, setActiveView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]); // Honeywell Semovita 5kg
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Cart initialized with the 3 items shown in Screen 4 of the visual reference!
  const [cartItems, setCartItems] = useState([
    {
      ...PRODUCTS[0], // Honeywell Semovita 5kg
      quantity: 1
    },
    {
      ...PRODUCTS[2], // Indomie Noodles 70g
      quantity: 1
    },
    {
      ...PRODUCTS[6], // Tropical Sun Palm Oil 1L
      quantity: 1
    }
  ]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [wishlist, setWishlist] = useState(['golden-penny-gari-10kg', 'dried-beans-1kg']);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (!supabase) return undefined;

    let isMounted = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (!isMounted) return;
        if (error) setAuthError(error.message);
        setUser(session?.user ?? null);
        setAuthLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setAuthError('Unable to check your sign-in status. Please try again.');
        setAuthLoading(false);
      });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`Added ${product.name} to your cart`);
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
    showToast('Item removed from cart');
  };

  const handleToggleWishlist = (productId) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed item from Wishlist');
        return prev.filter((id) => id !== productId);
      }
      showToast('Saved to Wishlist ❤️');
      return [...prev, productId];
    });
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setActiveView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderPlaced = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    showToast(`Order #${newOrder.id} successfully created!`);
  };

  const handleGoogleSignIn = async () => {
    setAuthError('');
    if (!supabase) {
      setAuthError('Google sign-in is not configured for this deployment.');
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) setAuthError(error.message);
    } catch {
      setAuthError('Unable to start Google sign-in. Please try again.');
    }
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) {
      setAuthError(error.message);
      return;
    }
    setActiveView('home');
  };

  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: '#062E1D',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            zIndex: 2000,
            border: '1px solid #22C55E',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#22C55E', color: '#042416', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Check size={14} strokeWidth={3} />
          </div>
          <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{toast}</span>
        </div>
      )}

      {/* Global Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        cartCount={totalCartCount}
        setIsCartOpen={setIsCartOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedCheckout={() => setActiveView('checkout')}
        promoCode={promoCode}
        setPromoCode={setPromoCode}
        discountAmount={discountAmount}
        setDiscountAmount={setDiscountAmount}
      />

      {/* Primary Dynamic Views */}
      <div style={{ flex: 1 }}>
        {activeView === 'home' && (
          <HomeView
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlist={wishlist}
            onSelectProduct={handleSelectProduct}
            onSelectCategory={(catId) => {
              setSelectedCategory(catId);
              setActiveView('shop');
            }}
            onNavigate={setActiveView}
          />
        )}

        {activeView === 'shop' && (
          <ShopView
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlist={wishlist}
            onSelectProduct={handleSelectProduct}
            onNavigate={setActiveView}
          />
        )}

        {activeView === 'product-detail' && (
          <ProductDetailView
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={wishlist.includes(selectedProduct.id)}
            onSelectProduct={handleSelectProduct}
            onNavigate={setActiveView}
          />
        )}

        {activeView === 'checkout' && (
          <CheckoutView
            cartItems={cartItems}
            onClearCart={() => setCartItems([])}
            onNavigate={setActiveView}
            onOrderPlaced={handleOrderPlaced}
          />
        )}

        {activeView === 'account' && (
          <AccountView
            orders={user?.email
              ? orders.filter((order) => order.email?.toLowerCase() === user.email.toLowerCase())
              : []}
            cartCount={totalCartCount}
            wishlist={wishlist}
            user={user}
            authLoading={authLoading}
            authConfigured={isSupabaseConfigured}
            authError={authError}
            onGoogleSignIn={handleGoogleSignIn}
            onSignOut={handleSignOut}
            onNavigate={setActiveView}
          />
        )}

        {activeView === 'admin' && (
          <AdminView orders={orders} />
        )}

        {activeView === 'mobile-preview' && (
          <MobilePhoneMockup
            onAddToCart={handleAddToCart}
            cartCount={totalCartCount}
            onSelectProduct={handleSelectProduct}
            onNavigate={setActiveView}
          />
        )}
      </div>

      {/* Global Footer */}
      <Footer onNavigate={setActiveView} />
    </div>
  );
}
