import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Hero from '../components/Hero';
import TrustBar from '../components/TrustBar';
import CategoryList from '../components/CategoryList';
import ProductCard from '../components/ProductCard';
import DualPromoBanners from '../components/DualPromoBanners';
import { PRODUCTS } from '../data/products';

export default function HomeView({
  onAddToCart,
  onToggleWishlist,
  wishlist,
  onSelectProduct,
  onSelectCategory,
  onNavigate
}) {
  const featuredProducts = PRODUCTS.slice(0, 6);
  const bestSellers = PRODUCTS.slice(6, 12);

  return (
    <div>
      {/* 1. Hero Section */}
      <Hero
        onShopNow={() => onNavigate('shop')}
        onBrowseCategories={() => {
          const el = document.getElementById('categories');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 2. Trust Value Proposition Strip */}
      <TrustBar />

      {/* 3. Shop by Category */}
      <CategoryList
        selectedCategory=""
        onSelectCategory={(catId) => {
          onSelectCategory(catId);
          onNavigate('shop');
        }}
        onViewAll={() => onNavigate('shop')}
      />

      {/* 4. Featured Products Section */}
      <section className="section-pad" style={{ background: '#FFFFFF' }}>
        <div className="section-container">
          <div className="section-header-flex">
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#0C6837', letterSpacing: '0.06em' }}>
                Handpicked Favorites
              </span>
              <h2 className="section-title">Featured Products</h2>
            </div>
            <button className="section-link" onClick={() => onNavigate('shop')}>
              View All Products <ArrowRight size={16} />
            </button>
          </div>

          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlist.includes(product.id)}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Dual Promo Banners */}
      <section style={{ padding: '24px 0 54px 0' }}>
        <DualPromoBanners
          onShopNow={() => onNavigate('shop')}
          onExploreNewArrivals={() => onNavigate('shop')}
        />
      </section>

      {/* 6. Popular Essentials / Best Sellers */}
      <section className="section-pad" style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
        <div className="section-container">
          <div className="section-header-flex">
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#0C6837', letterSpacing: '0.06em' }}>
                Daily Household Staples
              </span>
              <h2 className="section-title">Popular in Nigerian Kitchens</h2>
            </div>
            <button className="section-link" onClick={() => onNavigate('shop')}>
              Explore Catalog <ArrowRight size={16} />
            </button>
          </div>

          <div className="product-grid">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlist.includes(product.id)}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
