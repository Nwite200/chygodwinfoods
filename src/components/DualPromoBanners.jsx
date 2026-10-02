import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function DualPromoBanners({ onShopNow, onExploreNewArrivals }) {
  return (
    <div className="section-container">
      <div className="promo-banners-grid">
        {/* Banner 1: Authentic Foodstuffs */}
        <div className="promo-banner-card">
          <img
            src="/promo-harvest.jpg"
            alt="Authentic Nigerian Harvest"
            className="promo-banner-img"
          />
          <div className="promo-banner-overlay"></div>
          <div className="promo-banner-content">
            <span className="promo-banner-subtitle">
              <Sparkles size={12} style={{ display: 'inline', marginRight: 4 }} />
              Farm Direct
            </span>
            <h3 className="promo-banner-title">
              Authentic Nigerian Foodstuffs, Delivered To Your Doorstep.
            </h3>
            <button className="btn-primary-pill" style={{ padding: '10px 20px', fontSize: '0.85rem' }} onClick={onShopNow}>
              Shop Now <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Banner 2: New Arrivals */}
        <div className="promo-banner-card">
          <img
            src="/promo-packaged.jpg"
            alt="New Arrivals & Spices"
            className="promo-banner-img"
          />
          <div className="promo-banner-overlay"></div>
          <div className="promo-banner-content">
            <span className="promo-banner-subtitle">
              Fresh In Stock
            </span>
            <h3 className="promo-banner-title">
              New Arrivals<br />Check out our latest products
            </h3>
            <button className="btn-secondary-pill" style={{ padding: '9px 18px', fontSize: '0.85rem' }} onClick={onExploreNewArrivals}>
              Explore <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
