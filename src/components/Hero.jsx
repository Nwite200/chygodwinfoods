import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Hero({ onShopNow, onBrowseCategories }) {
  return (
    <section className="hero-section">
      <div className="hero-glow-blob"></div>

      <div className="hero-container">
        {/* Left Column: Copy & CTAs */}
        <div>
          <div className="hero-tag">
            <Sparkles size={14} />
            <span>NIGERIAN FOODSTUFFS • FRESH • QUALITY • GLOBAL</span>
          </div>

          <h1 className="hero-title">
            Your Trusted Source<br />
            for Quality <span className="hero-title-highlight">Nigerian Foodstuff</span>
          </h1>

          <p className="hero-description">
            From your favourite local staples to everyday essentials, ChyGodwin Foodstuff Global
            brings you the best Nigerian foodstuff, delivered right to your doorstep.
          </p>

          <div className="hero-cta-group">
            <button className="btn-primary-pill" onClick={onShopNow}>
              Shop Now <ArrowRight size={17} />
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
              <div className="hero-badge-text-title">100% Farm Fresh Guarantee</div>
              <div className="hero-badge-text-sub">Inspected &amp; Cleaned for Pure Quality</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
