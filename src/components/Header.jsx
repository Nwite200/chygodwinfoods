import React from 'react';
import { Search, ShoppingCart, User } from 'lucide-react';

export default function Header({
  activeView,
  setActiveView,
  cartCount,
  setIsCartOpen,
  searchTerm,
  setSearchTerm
}) {
  return (
    <header>
      <div className="main-header">
        <div className="header-container">
          {/* Logo */}
          <div className="brand-logo" onClick={() => setActiveView('home')}>
            <div className="brand-emblem">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12"/>
                <path d="M7 12c2.5-3 6-3 8-1s2 5.5-1 7.5c-2.5 1.5-5 .5-6-1.5"/>
                <path d="M12 6v6"/>
              </svg>
            </div>
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
              placeholder="Search for products (Semovita, Garri, Palm Oil...)"
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
              Shop
            </a>
            <a
              href="#categories"
              className="nav-link"
              onClick={(e) => { e.preventDefault(); setActiveView('shop'); }}
            >
              Categories
            </a>
            <a
              href="#about"
              className="nav-link"
              onClick={(e) => { e.preventDefault(); setActiveView('home'); }}
            >
              About Us
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
