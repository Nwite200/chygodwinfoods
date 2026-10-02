import React, { useState, useMemo } from 'react';
import { ChevronRight, Filter, X, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { CATEGORIES, BRANDS, PRODUCTS } from '../data/products';

export default function ShopView({
  selectedCategory,
  onSelectCategory,
  searchTerm,
  setSearchTerm,
  onAddToCart,
  onToggleWishlist,
  wishlist,
  onSelectProduct,
  onNavigate
}) {
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = useState('popularity');
  const [currentPage, setCurrentPage] = useState(1);

  const priceRanges = [
    { id: 'all', label: 'All Prices' },
    { id: '0-1000', label: '₦0 - ₦1,000', min: 0, max: 1000 },
    { id: '1001-5000', label: '₦1,001 - ₦5,000', min: 1001, max: 5000 },
    { id: '5001-10000', label: '₦5,001 - ₦10,000', min: 5001, max: 10000 },
    { id: '10001+', label: '₦10,001+', min: 10001, max: 999999 }
  ];

  const handleBrandToggle = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    onSelectCategory('');
    setSelectedPriceRange('all');
    setSelectedBrands([]);
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Category filter
      if (selectedCategory && p.category !== selectedCategory) {
        return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesBrand = p.brand.toLowerCase().includes(query);
        const matchesCat = p.categoryName.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesCat) return false;
      }

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false;
      }

      // Price filter
      if (selectedPriceRange !== 'all') {
        const range = priceRanges.find((r) => r.id === selectedPriceRange);
        if (range && (p.price < range.min || p.price > range.max)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: popularity / reviews
      return b.reviewsCount - a.reviewsCount;
    });
  }, [selectedCategory, searchTerm, selectedBrands, selectedPriceRange, sortBy]);

  const totalResults = filteredProducts.length;

  return (
    <div>
      {/* Banner */}
      <div className="shop-header-banner">
        <div className="section-container">
          <h1>Our Shop</h1>
          <p>Quality Nigerian foodstuff, fresh and affordable.</p>
          <div className="breadcrumbs">
            <a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Home</a>
            <ChevronRight size={14} />
            <span className="current">Shop</span>
            {selectedCategory && (
              <>
                <ChevronRight size={14} />
                <span className="current">
                  {CATEGORIES.find((c) => c.id === selectedCategory)?.name || selectedCategory}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="section-container">
        <div className="shop-layout">
          {/* Left Sidebar Filter Column */}
          <aside className="shop-sidebar">
            {/* Active filters pill box if any active */}
            {(selectedCategory || selectedPriceRange !== 'all' || selectedBrands.length > 0 || searchTerm) && (
              <div className="filter-block" style={{ background: '#F0FDF4', borderColor: '#BBF7D0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#166534' }}>Active Filters</span>
                  <button
                    onClick={clearAllFilters}
                    style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 700 }}
                  >
                    Clear All
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selectedCategory && (
                    <span style={{ background: '#DCFCE7', color: '#166534', padding: '3px 8px', borderRadius: 9999, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                      {CATEGORIES.find((c) => c.id === selectedCategory)?.name}
                      <X size={12} style={{ cursor: 'pointer' }} onClick={() => onSelectCategory('')} />
                    </span>
                  )}
                  {selectedPriceRange !== 'all' && (
                    <span style={{ background: '#DCFCE7', color: '#166534', padding: '3px 8px', borderRadius: 9999, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                      {priceRanges.find((r) => r.id === selectedPriceRange)?.label}
                      <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedPriceRange('all')} />
                    </span>
                  )}
                  {selectedBrands.map((b) => (
                    <span key={b} style={{ background: '#DCFCE7', color: '#166534', padding: '3px 8px', borderRadius: 9999, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                      {b}
                      <X size={12} style={{ cursor: 'pointer' }} onClick={() => handleBrandToggle(b)} />
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Categories Filter */}
            <div className="filter-block">
              <h3 className="filter-title">
                Categories
                {selectedCategory && (
                  <button
                    onClick={() => onSelectCategory('')}
                    style={{ fontSize: '0.72rem', color: '#0C6837', fontWeight: 600 }}
                  >
                    Reset
                  </button>
                )}
              </h3>
              <ul className="filter-list">
                <li>
                  <button
                    className={`filter-item-btn ${!selectedCategory ? 'active' : ''}`}
                    onClick={() => { onSelectCategory(''); setCurrentPage(1); }}
                  >
                    <span>All Categories</span>
                    <span className="filter-count">{PRODUCTS.length}</span>
                  </button>
                </li>
                {CATEGORIES.map((cat) => (
                  <li key={cat.id}>
                    <button
                      className={`filter-item-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                      onClick={() => { onSelectCategory(cat.id); setCurrentPage(1); }}
                    >
                      <span>{cat.name}</span>
                      <span className="filter-count">
                        {PRODUCTS.filter((p) => p.category === cat.id).length}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Filter by Price */}
            <div className="filter-block">
              <h3 className="filter-title">Filter by Price</h3>
              <ul className="filter-list">
                {priceRanges.map((range) => (
                  <li key={range.id}>
                    <button
                      className={`filter-item-btn ${selectedPriceRange === range.id ? 'active' : ''}`}
                      onClick={() => { setSelectedPriceRange(range.id); setCurrentPage(1); }}
                    >
                      <span>{range.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Brand Filter */}
            <div className="filter-block">
              <h3 className="filter-title">Brand</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {BRANDS.map((brand) => (
                  <label key={brand} className="filter-checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Product Grid Area */}
          <main>
            <div className="shop-top-controls">
              <span className="shop-results-count">
                Showing {totalResults > 0 ? `1-${Math.min(totalResults, 12)}` : '0'} of {totalResults} products
              </span>

              <div className="shop-sort-wrap">
                <span style={{ color: '#64748B' }}>Sort By:</span>
                <select
                  className="shop-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="popularity">Popularity</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>
            </div>

            {totalResults === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: 16 }}>
                <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#062E1D', marginBottom: 8 }}>
                  No foodstuff items found matching your filters.
                </p>
                <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: 20 }}>
                  Try resetting your search query or selecting a different price range.
                </p>
                <button className="btn-primary-pill" onClick={clearAllFilters}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="product-grid">
                {filteredProducts.map((product) => (
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
            )}

            {/* Pagination matching reference [1] [2] [3] [4] [5] > */}
            {totalResults > 0 && (
              <div className="pagination-bar">
                {[1, 2, 3, 4, 5].map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage((p) => Math.min(5, p + 1))}
                  title="Next Page"
                >
                  &gt;
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
