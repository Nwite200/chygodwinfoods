import React, { useState } from 'react';
import {
  Star,
  CheckCircle2,
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { PRODUCTS } from '../data/products';

export default function ProductDetailView({
  product = PRODUCTS[0],
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onSelectProduct,
  onNavigate
}) {
  const [activeThumb, setActiveThumb] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState('details');

  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand)
  ).slice(0, 4);

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
  };

  return (
    <div className="section-pad">
      <div className="section-container">
        {/* Breadcrumbs */}
        <div className="breadcrumbs" style={{ marginBottom: 16 }}>
          <a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Home</a>
          <ChevronRight size={14} />
          <a href="#shop" onClick={(e) => { e.preventDefault(); onNavigate('shop'); }}>Shop</a>
          <ChevronRight size={14} />
          <span>{product.categoryName}</span>
          <ChevronRight size={14} />
          <span className="current">{product.name}</span>
        </div>

        {/* Back link */}
        <button
          onClick={() => onNavigate('shop')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: '#0C6837', fontWeight: 600, marginBottom: 20 }}
        >
          <ArrowLeft size={16} /> Back to Shop
        </button>

        {/* Main Product Card */}
        <div className="product-detail-card">
          {/* Left Column: Gallery */}
          <div>
            <div className="gallery-main-wrap">
              <img
                src={activeThumb || product.image}
                alt={product.name}
                className="gallery-main-img"
              />
              <button
                className={`product-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                onClick={() => onToggleWishlist(product.id)}
                title="Wishlist"
                style={{ top: 16, right: 16 }}
              >
                <Heart size={18} fill={isWishlisted ? '#EF4444' : 'none'} />
              </button>
            </div>

            {/* Thumbnail Strip */}
            <div className="gallery-thumb-strip">
              {(product.thumbnails || [product.image]).map((thumb, idx) => (
                <div
                  key={idx}
                  className={`gallery-thumb-item ${activeThumb === thumb ? 'active' : ''}`}
                  onClick={() => setActiveThumb(thumb)}
                >
                  <img src={thumb} alt={`View ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Info & Actions */}
          <div className="detail-info-block">
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: '#0C6837', letterSpacing: '0.06em' }}>
              {product.brand}
            </span>
            <h1 className="detail-title">{product.name}</h1>

            {/* Reviews */}
            <div className="detail-reviews-row">
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <span className="reviews-count-text">({product.reviewsCount} reviews)</span>
              <span style={{ color: '#CBD5E1' }}>•</span>
              <span style={{ fontSize: '0.82rem', color: '#16A34A', fontWeight: 700 }}>In Stock ({product.stockCount} available)</span>
            </div>

            {/* Price */}
            <div className="detail-price-box">
              <span className="detail-price-main">₦{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="detail-price-crossed">₦{product.originalPrice.toLocaleString()}</span>
              )}
              {product.discount && (
                <span className="detail-discount-pill">{product.discount}</span>
              )}
            </div>

            {/* Short Description */}
            <p className="detail-desc">{product.description}</p>

            {/* Feature Checkpoints */}
            <ul className="detail-features-list">
              {(product.features || [
                '100% Natural and authentic quality',
                'Rich in Nutrients and natural energy',
                'Great taste & smooth swallow texture'
              ]).map((feat, i) => (
                <li key={i} className="detail-feature-item">
                  <CheckCircle2 size={18} className="feature-check-icon" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            {/* Quantity Stepper & Add to Cart */}
            <div className="detail-purchase-row">
              <div className="qty-stepper">
                <button
                  className="qty-stepper-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  -
                </button>
                <span className="qty-stepper-val">{quantity}</span>
                <button
                  className="qty-stepper-btn"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  +
                </button>
              </div>

              <button className="detail-add-btn" onClick={handleAdd}>
                <ShoppingBag size={18} />
                <span>Add To Cart - ₦{(product.price * quantity).toLocaleString()}</span>
              </button>
            </div>

            {/* Accordions */}
            <div className="accordion-group">
              {/* Product Details */}
              <div className="accordion-item">
                <button className="accordion-trigger" onClick={() => toggleAccordion('details')}>
                  <span>Product Details</span>
                  {openAccordion === 'details' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openAccordion === 'details' && (
                  <div className="accordion-body">
                    <p>{product.description}</p>
                    <p style={{ marginTop: 8 }}>
                      Packed under certified hygienic conditions adhering to standard food safety regulations.
                    </p>
                  </div>
                )}
              </div>

              {/* Ingredients */}
              <div className="accordion-item">
                <button className="accordion-trigger" onClick={() => toggleAccordion('ingredients')}>
                  <span>Ingredients</span>
                  {openAccordion === 'ingredients' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openAccordion === 'ingredients' && (
                  <div className="accordion-body">
                    <p>{product.ingredients || '100% wholesome pure Nigerian staple food product.'}</p>
                  </div>
                )}
              </div>

              {/* Nutrition Facts */}
              <div className="accordion-item">
                <button className="accordion-trigger" onClick={() => toggleAccordion('nutrition')}>
                  <span>Nutrition Facts</span>
                  {openAccordion === 'nutrition' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openAccordion === 'nutrition' && (
                  <div className="accordion-body">
                    <p>{product.nutrition || 'Rich in carbohydrates, essential proteins, and minerals.'}</p>
                  </div>
                )}
              </div>

              {/* Shipping & Returns */}
              <div className="accordion-item">
                <button className="accordion-trigger" onClick={() => toggleAccordion('shipping')}>
                  <span>Shipping &amp; Returns</span>
                  {openAccordion === 'shipping' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openAccordion === 'shipping' && (
                  <div className="accordion-body">
                    <p>{product.shippingInfo || 'Nationwide delivery across Nigeria and international dispatch to UK, US, and Canada.'}</p>
                    <p style={{ marginTop: 6, color: '#64748B' }}>
                      Easy 7-day returns on sealed items if damaged during transit.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* You May Also Like Section */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: 56 }}>
            <h2 className="section-title" style={{ marginBottom: 20 }}>You May Also Like</h2>
            <div className="product-grid">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  className="product-card"
                  onClick={() => {
                    onSelectProduct(rel);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <div className="product-thumb-wrap">
                    <img src={rel.image} alt={rel.name} className="product-thumb" />
                  </div>
                  <span className="product-brand">{rel.brand}</span>
                  <h4 className="product-title">{rel.name}</h4>
                  <div className="product-price-row">
                    <span className="product-price">₦{rel.price.toLocaleString()}</span>
                  </div>
                  <button
                    className="product-add-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(rel);
                    }}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
