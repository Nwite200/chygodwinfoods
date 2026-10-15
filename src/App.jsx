import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import WhatsAppChat from './components/WhatsAppChat';
import { PRODUCTS, INITIAL_ORDERS } from './data/products';
import { Check } from 'lucide-react';
import { isSupabaseConfigured, supabase } from './supabase';

const getIsoTimestamp = () => new Date().toISOString();

export default function App() {
  const [activeView, setActiveView] = useState('home');
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('chygodwin_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.error('Failed to load saved products:', err);
    }
    return PRODUCTS;
  });

  // Persist products to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('chygodwin_products', JSON.stringify(products));
    } catch (err) {
      // localStorage quota exceeded — strip base64 images and retry
      console.warn('localStorage quota exceeded, compacting images…', err);
      try {
        const compact = products.map((p) => {
          // Keep path-based images, strip large data: URLs
          const img = typeof p.image === 'string' && p.image.startsWith('data:') && p.image.length > 80000
            ? '/products/combo.jpg'
            : p.image;
          return { ...p, image: img, thumbnails: [img] };
        });
        localStorage.setItem('chygodwin_products', JSON.stringify(compact));
      } catch (e2) {
        console.error('Failed to save products even after compaction:', e2);
      }
    }
  }, [products]);

  // Cross-tab sync: listen for localStorage changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'chygodwin_products' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed);
          }
        } catch (err) {
          console.error('Failed to sync products from other tab:', err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [selectedProduct, setSelectedProduct] = useState(() => products[0] || PRODUCTS[0]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [cartItems, setCartItems] = useState([]);
  const guestCartRef = useRef(cartItems);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [sharedCartReadyFor, setSharedCartReadyFor] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [wishlist, setWishlist] = useState(['golden-penny-gari-10kg', 'dried-beans-1kg']);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured);
  const [authError, setAuthError] = useState('');
  const authenticatedUserIdRef = useRef(null);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    if (!user?.id) {
      guestCartRef.current = cartItems;
    }
  }, [cartItems, user?.id]);

  const updateAuthSession = useCallback((session) => {
    const nextUser = session?.user ?? null;
    const nextUserId = nextUser?.id ?? null;
    if (authenticatedUserIdRef.current !== nextUserId) {
      authenticatedUserIdRef.current = nextUserId;
      setSharedCartReadyFor(null);
      if (!nextUserId) {
        setCartItems([]);
      }
    }
    setUser(nextUser);
  }, []);

  useEffect(() => {
    if (!supabase) return undefined;

    let isMounted = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      updateAuthSession(session);
      setAuthLoading(false);
    });

    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (!isMounted) return;
        if (error) setAuthError(error.message);
        updateAuthSession(session);
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
  }, [updateAuthSession]);

  useEffect(() => {
    if (!supabase || !user?.id) {
      return undefined;
    }

    const userId = user.id;
    let isMounted = true;

    const loadSharedCart = async () => {
      const { data, error } = await supabase
        .from('cart_items')
        .select('product_id, product_name, product_image, price, quantity')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (!isMounted) return;
      if (error) {
        showToast(`Unable to load your shared cart: ${error.message}`);
        return;
      }

      const rows = [...(data ?? [])];
      const rowsByProductId = new Map(rows.map((row) => [row.product_id, row]));
      const guestItems = guestCartRef.current;
      if (guestItems.length > 0) {
        const rowsToSave = guestItems.map((item) => {
          const existing = rowsByProductId.get(item.id);
          const quantity = Number(existing?.quantity ?? 0) + item.quantity;
          return {
            user_id: userId,
            product_id: item.id,
            product_name: item.name,
            product_image: item.image,
            price: item.price,
            quantity
          };
        });
        guestCartRef.current = [];
        const { error: mergeError } = await supabase.from('cart_items').upsert(rowsToSave);
        if (!isMounted) return;
        if (mergeError) {
          guestCartRef.current = guestItems;
          showToast(`Unable to merge your cart: ${mergeError.message}`);
          return;
        }
        for (const row of rowsToSave) {
          rowsByProductId.set(row.product_id, row);
        }
      }
      const mergedRows = Array.from(rowsByProductId.values());
      setCartItems(mergedRows.map((row) => {
        const product = products.find((item) => item.id === row.product_id) || PRODUCTS.find((item) => item.id === row.product_id);
        return {
          ...(product ?? {}),
          id: row.product_id,
          name: row.product_name,
          image: row.product_image,
          price: Number(row.price),
          quantity: Number(row.quantity)
        };
      }));
      setSharedCartReadyFor(userId);
    };

    const reportLoadError = (error) => {
      if (isMounted) {
        showToast(`Unable to load your shared cart: ${error instanceof Error ? error.message : 'Please try again.'}`);
      }
    };

    void loadSharedCart().catch(reportLoadError);
    const channel = supabase
      .channel(`web-cart-sync-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cart_items', filter: `user_id=eq.${userId}` },
        () => { void loadSharedCart().catch(reportLoadError); }
      )
      .subscribe();

    return () => {
      isMounted = false;
      void channel.unsubscribe();
    };
  }, [showToast, user?.id]);

  const handleAddToCart = async (product) => {
    if (user && supabase) {
      if (sharedCartReadyFor !== user.id) {
        showToast('Your shared cart is still loading. Please try again.');
        return;
      }

      try {
        const { data, error } = await supabase.rpc('add_cart_item', {
          p_product_id: product.id,
          p_product_name: product.name,
          p_product_image: product.image,
          p_price: product.price
        });
        if (error) {
          showToast(`Unable to update your shared cart: ${error.message}`);
          return;
        }

        setCartItems((prev) => {
          const existing = prev.find((item) => item.id === product.id);
          if (existing) {
            return prev.map((item) =>
              item.id === product.id
                ? { ...item, ...product, quantity: Number(data?.quantity ?? existing.quantity + 1) }
                : item
            );
          }
          return [...prev, { ...product, quantity: Number(data?.quantity ?? 1) }];
        });
        showToast(`Added ${product.name} to your shared cart`);
      } catch (error) {
        showToast(`Unable to update your shared cart: ${error instanceof Error ? error.message : 'Please try again.'}`);
      }
      return;
    }

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

  const handleUpdateQuantity = async (productId, newQty) => {
    if (newQty <= 0) {
      await handleRemoveItem(productId);
      return;
    }

    if (user && supabase) {
      if (sharedCartReadyFor !== user.id) {
        showToast('Your shared cart is still loading. Please try again.');
        return;
      }

      try {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: newQty, updated_at: getIsoTimestamp() })
          .eq('user_id', user.id)
          .eq('product_id', productId);
        if (error) {
          showToast(`Unable to update your shared cart: ${error.message}`);
          return;
        }
      } catch (error) {
        showToast(`Unable to update your shared cart: ${error instanceof Error ? error.message : 'Please try again.'}`);
        return;
      }
    }

    setCartItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = async (productId) => {
    if (user && supabase) {
      if (sharedCartReadyFor !== user.id) {
        showToast('Your shared cart is still loading. Please try again.');
        return;
      }
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
        if (error) {
          showToast(`Unable to update your shared cart: ${error.message}`);
          return;
        }
      } catch (error) {
        showToast(`Unable to update your shared cart: ${error instanceof Error ? error.message : 'Please try again.'}`);
        return;
      }
    }

    setCartItems((prev) => prev.filter((item) => item.id !== productId));
    showToast('Item removed from cart');
  };

  const handleClearCart = async () => {
    if (user && supabase) {
      if (sharedCartReadyFor !== user.id) {
        showToast('Your shared cart is still loading. Please try again.');
        return;
      }
      try {
        const { error } = await supabase.from('cart_items').delete().eq('user_id', user.id);
        if (error) {
          showToast(`Unable to clear your shared cart: ${error.message}`);
          return;
        }
      } catch (error) {
        showToast(`Unable to clear your shared cart: ${error instanceof Error ? error.message : 'Please try again.'}`);
        return;
      }
    }
    setCartItems([]);
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

  const handleAddProduct = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Product "${newProduct.name}" added to catalog!`);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p))
    );
    if (selectedProduct?.id === updatedProduct.id) {
      setSelectedProduct((prev) => ({ ...prev, ...updatedProduct }));
    }
    showToast(`Updated "${updatedProduct.name}"!`);
  };

  const handleDeleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product removed from shop catalog');
  };

  const handleResetProducts = () => {
    setProducts(PRODUCTS);
    try {
      localStorage.removeItem('chygodwin_products');
    } catch (err) {
      console.error(err);
    }
    showToast('Catalog reset to official 62 items');
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order #${orderId} marked as ${newStatus}`);
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

  const handleEmailSignIn = async (email, password) => {
    setAuthError('');
    if (!supabase) {
      setAuthError('Email sign-in is not configured for this deployment.');
      return false;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        setAuthError(error.message);
        return false;
      }
      return true;
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Unable to sign in. Please try again.');
      return false;
    }
  };

  const handleEmailRegister = async (email, password) => {
    setAuthError('');
    if (!supabase) {
      setAuthError('Email registration is not configured for this deployment.');
      return false;
    }

    try {
      const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
      if (error) {
        setAuthError(error.message);
        return false;
      }
      if (!data.session) {
        setAuthError('Check your email for a confirmation link, then sign in on both devices with this account.');
        return false;
      }
      return true;
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Unable to create your account. Please try again.');
      return false;
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
            products={products}
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
            products={products}
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
            products={products}
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={wishlist.includes(selectedProduct?.id)}
            onSelectProduct={handleSelectProduct}
            onNavigate={setActiveView}
          />
        )}

        {activeView === 'checkout' && (
          <CheckoutView
            cartItems={cartItems}
            onClearCart={handleClearCart}
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
            onEmailSignIn={handleEmailSignIn}
            onEmailRegister={handleEmailRegister}
            onSignOut={handleSignOut}
            onNavigate={setActiveView}
          />
        )}

        {activeView === 'admin' && (
          <AdminView
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onResetProducts={handleResetProducts}
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onNavigate={setActiveView}
          />
        )}

        {activeView === 'mobile-preview' && (
          <MobilePhoneMockup
            products={products}
            onAddToCart={handleAddToCart}
            cartCount={totalCartCount}
            onSelectProduct={handleSelectProduct}
            onNavigate={setActiveView}
          />
        )}
      </div>

      {/* Global Footer */}
      <Footer onNavigate={setActiveView} />

      {/* Live WhatsApp ordering chat */}
      <WhatsAppChat products={products} cartItems={cartItems} onAddToCart={handleAddToCart} />
    </div>
  );
}
