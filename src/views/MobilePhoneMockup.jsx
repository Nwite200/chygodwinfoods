import React, { useState } from 'react';
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  User,
  Search,
  Wifi,
  Battery,
  Sparkles,
  ArrowRight,
  Heart
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/products';

export default function MobilePhoneMockup({
  onAddToCart,
  cartCount,
  onSelectProduct,
  onNavigate
}) {
  const [mobileTab, setMobileTab] = useState('home');
  const [mobileSearch, setMobileSearch] = useState('');

  const featured = PRODUCTS.slice(0, 4);

  return (
    <div className="phone-mockup-wrapper">
      <div className="phone-device-frame">
        {/* Speaker Notch */}
        <div className="phone-speaker-notch"></div>

        {/* Mobile Status Bar */}
        <div
          style={{
            padding: '12px 24px 6px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#FFFFFF',
            zIndex: 110
          }}
        >
          <span>9:41</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Wifi size={13} />
            <Battery size={15} />
          </div>
        </div>

        {/* Mobile Screen Scrollable Area */}
        <div className="phone-screen-content">
          {/* Mobile Header */}
          <div
            style={{
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              background: '#042416'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="brand-emblem" style={{ width: 28, height: 28 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 900 }}>C</span>
              </div>
              <div style={{ lineHeight: 1.1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFF' }}>ChyGodwin</div>
                <div style={{ fontSize: '0.55rem', color: '#22C55E', fontWeight: 700 }}>FOODSTUFF GLOBAL</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => setMobileTab('cart')}
                style={{ position: 'relative', color: '#FFF' }}
              >
                <ShoppingCart size={19} />
                {cartCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -6,
                      background: '#22C55E',
                      color: '#03180E',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      borderRadius: '50%',
                      width: 16,
                      height: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div style={{ padding: '10px 16px' }}>
            <div style={{ position: 'relative' }}>
              <Search
                size={14}
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
              />
              <input
                type="text"
                placeholder="Search foodstuff..."
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 34px',
                  borderRadius: 9999,
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFF',
                  fontSize: '0.8rem'
                }}
                value={mobileSearch}
                onChange={(e) => setMobileSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Mobile Hero Card */}
          <div
            style={{
              margin: '0 16px 16px 16px',
              borderRadius: 18,
              padding: 18,
              background: 'linear-gradient(135deg, #073822 0%, #031D11 100%)',
              border: '1px solid rgba(34, 197, 94, 0.25)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'relative', zIndex: 2 }}>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  color: '#4ADE80',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  display: 'block',
                  marginBottom: 4
                }}
              >
                100% Quality Nigerian Staples
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.2, color: '#FFF', marginBottom: 6 }}>
                Fresh Choices,<br /><span style={{ color: '#22C55E' }}>Better Life</span>
              </h2>
              <p style={{ fontSize: '0.72rem', color: '#D1D5DB', lineHeight: 1.4, marginBottom: 12, maxWidth: 220 }}>
                Premium quality Nigerian foodstuff, delivered fresh to your doorstep.
              </p>
              <button
                className="btn-primary-pill"
                style={{ padding: '8px 16px', fontSize: '0.78rem' }}
                onClick={() => setMobileTab('shop')}
              >
                Shop Now <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Mobile Trust Bar (3 Pills) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 8,
              margin: '0 16px 20px 16px'
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                borderRadius: 10,
                padding: '8px 6px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div style={{ fontSize: '0.9rem' }}>🌿</div>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, marginTop: 2 }}>Fresh Products</div>
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                borderRadius: 10,
                padding: '8px 6px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div style={{ fontSize: '0.9rem' }}>⚡</div>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, marginTop: 2 }}>Fast Delivery</div>
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                borderRadius: 10,
                padding: '8px 6px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div style={{ fontSize: '0.9rem' }}>🔒</div>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, marginTop: 2 }}>Secure Payment</div>
            </div>
          </div>

          {/* Mobile Featured Products */}
          <div style={{ padding: '0 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFF' }}>Featured Products</span>
              <span
                style={{ fontSize: '0.72rem', color: '#22C55E', fontWeight: 700, cursor: 'pointer' }}
                onClick={() => setMobileTab('shop')}
              >
                See all &gt;
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {featured.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 14,
                    padding: 10,
                    color: '#0F172A',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onClick={() => onSelectProduct(p)}
                >
                  <div
                    style={{
                      aspectRatio: '1',
                      background: '#F8FAFC',
                      borderRadius: 8,
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 8
                    }}
                  >
                    <img src={p.image} alt={p.name} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#94A3B8', fontWeight: 700 }}>
                    {p.brand}
                  </div>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      lineHeight: 1.25,
                      margin: '2px 0 6px 0',
                      height: 30,
                      overflow: 'hidden'
                    }}
                  >
                    {p.name}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#062E1D', marginBottom: 8 }}>
                    ₦{p.price.toLocaleString()}
                  </div>
                  <button
                    style={{
                      marginTop: 'auto',
                      background: '#062E1D',
                      color: '#FFF',
                      borderRadius: 9999,
                      padding: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(p);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Mobile Bottom Navigation Bar */}
        <div className="phone-bottom-nav">
          <button
            className={`phone-nav-item ${mobileTab === 'home' ? 'active' : ''}`}
            onClick={() => setMobileTab('home')}
          >
            <Home size={18} />
            <span>Home</span>
          </button>

          <button
            className={`phone-nav-item ${mobileTab === 'shop' ? 'active' : ''}`}
            onClick={() => setMobileTab('shop')}
          >
            <ShoppingBag size={18} />
            <span>Shop</span>
          </button>

          <button
            className={`phone-nav-item ${mobileTab === 'cart' ? 'active' : ''}`}
            onClick={() => setMobileTab('cart')}
          >
            <div style={{ position: 'relative' }}>
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -6,
                    background: '#22C55E',
                    color: '#03180E',
                    fontSize: '0.55rem',
                    fontWeight: 800,
                    borderRadius: '50%',
                    width: 14,
                    height: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {cartCount}
                </span>
              )}
            </div>
            <span>Cart</span>
          </button>

          <button
            className={`phone-nav-item ${mobileTab === 'account' ? 'active' : ''}`}
            onClick={() => setMobileTab('account')}
          >
            <User size={18} />
            <span>Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
