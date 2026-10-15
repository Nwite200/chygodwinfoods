import React from 'react';
import { ArrowRight, Sparkles, MapPin, Truck, ShieldCheck } from 'lucide-react';

export default function Hero({ onShopNow, onBrowseCategories }) {
  return (
    <section className="hero-section">
      <div className="hero-glow-blob"></div>

      <div className="hero-container">
        {/* Left Column: Copy & CTAs */}
        <div>
          <div className="hero-tag">
            <Sparkles size={14} />
            <span>NKWELLE LIGHT OF GOD ESTATE • NATIONWIDE &amp; BEYOND WAYBILL</span>
          </div>

          <h1 className="hero-title">
            Quality &amp; Affordable<br />
            <span className="hero-title-highlight">Nigerian Foodstuff</span>
          </h1>

          <p className="hero-description">
            Welcome to <strong>Chygodwin Foodstuffs Global Concept</strong>. Located at Nkwelle Light of God estate, we waybill and deliver quality, affordable Nigerian food staples nationwide and beyond. From whole tubers of yam, pure palm oil, and stone-free rice to Ador Ogbonno, egusi, and family food combos.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, margin: '18px 0 24px 0', fontSize: '0.84rem', color: '#D1D5DB' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.08)', padding: '6px 12px', borderRadius: 9999 }}>
              <MapPin size={14} color="#4ADE80" /> Nkwelle Light of God Estate
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.08)', padding: '6px 12px', borderRadius: 9999 }}>
              <Truck size={14} color="#38BDF8" /> Nationwide &amp; Diaspora Waybill
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.08)', padding: '6px 12px', borderRadius: 9999 }}>
              <ShieldCheck size={14} color="#FBBF24" /> Moniepoint: •••• ••••
            </span>
          </div>

          <div className="hero-cta-group">
            <button className="btn-primary-pill" onClick={onShopNow}>
              Shop 62 Items Now <ArrowRight size={17} />
            </button>
            <button className="btn-secondary-pill" onClick={onBrowseCategories}>
              Browse Categories
            </button>
          </div>
        </div>

        {/* Right Column: Hero Visual Photo */}
        <div className="hero-image-wrap">
          <img
            src="/hero.jpg"
            alt="Authentic Nigerian Foodstuff Basket with Garri, Semovita, Palm Oil, and Yam"
            className="hero-image"
          />
          <div className="hero-badge-overlay">
            <span className="hero-badge-dot"></span>
            <div>
              <div className="hero-badge-text-title">Quality &amp; Affordable Prices</div>
              <div className="hero-badge-text-sub">We Waybill Nationwide &amp; Beyond</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
