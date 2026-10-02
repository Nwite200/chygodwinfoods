import React, { useState } from 'react';
import { Heart, ShoppingBag, Check } from 'lucide-react';

export default function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onSelectProduct
}) {
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    onToggleWishlist(product.id);
  };

  return (
    <div className="product-card" onClick={() => onSelectProduct(product)}>
      {/* Badge */}
      {product.badge && (
        <span
          className={`product-badge ${
            product.badge.toLowerCase().includes('sale') || product.badge.toLowerCase().includes('hot')
              ? 'product-badge-sale'
              : product.badge.toLowerCase().includes('best')
              ? 'product-badge-best'
              : 'product-badge-popular'
          }`}
        >
          {product.badge}
        </span>
      )}

      {/* Wishlist Button */}
      <button
        className={`product-wishlist-btn ${isWishlisted ? 'active' : ''}`}
        onClick={handleWishlist}
        title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart size={16} fill={isWishlisted ? '#EF4444' : 'none'} />
      </button>

      {/* Thumbnail */}
      <div className="product-thumb-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-thumb"
          loading="lazy"
        />
      </div>

      {/* Brand & Title */}
      <span className="product-brand">{product.brand}</span>
      <h3 className="product-title" title={product.name}>
        {product.name}
      </h3>

      {/* Price */}
      <div className="product-price-row">
        <span className="product-price">₦{product.price.toLocaleString()}</span>
        {product.originalPrice && (
          <span className="product-price-original">₦{product.originalPrice.toLocaleString()}</span>
        )}
      </div>

      {/* Add To Cart Button */}
      <button
        className={`product-add-btn ${justAdded ? 'added' : ''}`}
        onClick={handleAdd}
      >
        {justAdded ? (
          <>
            <Check size={16} /> Added!
          </>
        ) : (
          <>
            <ShoppingBag size={15} /> Add to Cart
          </>
        )}
      </button>
    </div>
  );
}
