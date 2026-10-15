import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Hero from '../components/Hero';
import TrustBar from '../components/TrustBar';
import CategoryList from '../components/CategoryList';
import ProductCard from '../components/ProductCard';
import DualPromoBanners from '../components/DualPromoBanners';
import { PRODUCTS } from '../data/products';

export default function HomeView({
  products = PRODUCTS,
  onAddToCart,
  onToggleWishlist,
  wishlist,
  onSelectProduct,
  onSelectCategory,
  onNavigate
}) {
  const featuredProducts = products.filter((p) => p.featured).slice(0, 8);
  const bestSellers = products.slice(8, 16);

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
                Handpicked Favorites from Nkwelle Light of God Estate
              </span>
              <h2 className="section-title">Featured Nigerian Foodstuffs</h2>
            </div>
            <button className="section-link" onClick={() => onNavigate('shop')}>
              View All {products.length} Products <ArrowRight size={16} />
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
                Daily Kitchen Staples
              </span>
              <h2 className="section-title">Popular in Nigerian Kitchens</h2>
            </div>
            <button className="section-link" onClick={() => onNavigate('shop')}>
              Explore Full Catalog <ArrowRight size={16} />
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
