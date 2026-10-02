import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../data/products';

export default function CategoryList({ selectedCategory, onSelectCategory, onViewAll }) {
  return (
    <section className="section-pad" id="categories">
      <div className="section-container">
        <div className="section-header-flex">
          <h2 className="section-title">Shop by Category</h2>
          <button className="section-link" onClick={onViewAll}>
            View All Categories <ArrowRight size={16} />
          </button>
        </div>

        <div className="category-grid">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className={`category-card ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <div className="category-img-box">
                <img src={cat.image} alt={cat.name} className="category-img" />
              </div>
              <span className="category-name">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
