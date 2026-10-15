import React, { useState } from 'react';
import { Search, ShoppingCart, User, ShieldCheck, MapPin, Truck, Phone, Sun, Moon } from 'lucide-react';
import { STORE_INFO } from '../data/products';
import StoreLogo from './StoreLogo';
import { toggleTheme } from '../utils/theme';

export default function Header({
  activeView,
  setActiveView,
  cartCount,
  setIsCartOpen,
  searchTerm,
  setSearchTerm
}) {
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'light');

  return (
    <header>
      {/* Top Business & Delivery Announcement Bar */}
      <div style={{ background: '#042416', color: '#D1D5DB', fontSize: '0.78rem', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#4ADE80', fontWeight: 700 }}>
              <MapPin size={13} /> Located at Nkwelle Light of God estate
            </span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Truck size={13} color="#38BDF8" /> We waybill &amp; deliver Nationwide &amp; beyond
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Phone size={12} color="#FBBF24" /> Call / WhatsApp: <strong style={{ color: '#FFF' }}>08063654393</strong>
            </span>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ color: '#A7F3D0' }}>
              Quality &amp; affordable prices
            </span>
          </div>
        </div>
      </div>

      <div className="main-header">
        <div className="header-container">
          {/* Logo */}
          <div className="brand-logo" onClick={() => setActiveView('home')} style={{ cursor: 'pointer' }}>
            <StoreLogo size={46} />
            <div className="brand-text-block">
              <span className="brand-title">ChyGodwin</span>
              <span className="brand-subtitle">Foodstuff Global</span>
            </div>
          </div>

          {/* Search Box */}
          <div className="header-search-wrap">
            <Search size={18} className="header-search-icon" />
            <input
              type="text"
              className="header-search-input"
              placeholder="Search 62 staples (Dates powder, Ogbono, Palm Oil, Garri, Yams...)"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value.trim() && activeView !== 'shop') {
                  setActiveView('shop');
                }
              }}
            />
          </div>

          {/* Nav Links */}
          <nav className="header-nav">
            <a
              href="#home"
              className={`nav-link ${activeView === 'home' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveView('home'); }}
            >
              Home
            </a>
            <a
              href="#shop"
              className={`nav-link ${activeView === 'shop' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveView('shop'); }}
            >
              Shop All
            </a>
            <a
              href="#categories"
              className="nav-link"
              onClick={(e) => { e.preventDefault(); setActiveView('shop'); }}
            >
              Categories
            </a>
            <a
              href="#admin"
              className={`nav-link ${activeView === 'admin' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveView('admin'); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                color: activeView === 'admin' ? 'var(--text-green)' : 'var(--text-strong)',
                fontWeight: 800
              }}
            >
              <ShieldCheck size={16} color="#0C6837" />
              Admin
            </a>
            <a
              href="#contact"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
              }}
            >
              Contact
            </a>
          </nav>

          {/* Action Icons */}
          <div className="header-actions">
            <button
              className="header-btn"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle color theme"
              onClick={() => setTheme(toggleTheme())}
            >
              {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            <button
              className="header-btn"
              title="Admin Dashboard (Product Upload &amp; Price Changes)"
              onClick={() => setActiveView('admin')}
              style={{
                background: activeView === 'admin' ? 'var(--surface-green-tint)' : 'var(--surface-raised)',
                color: activeView === 'admin' ? 'var(--text-green-strong)' : 'var(--text-strong)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 9999,
                fontSize: '0.8rem',
                fontWeight: 800
              }}
            >
              <ShieldCheck size={16} color="#16A34A" />
              <span>Admin Panel</span>
            </button>

            <button
              className="header-btn"
              title="User Account"
              onClick={() => setActiveView('account')}
            >
              <User size={19} />
            </button>

            <button
              className="header-btn"
              title="Cart Drawer"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart size={19} />
              {cartCount > 0 && <span className="header-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
