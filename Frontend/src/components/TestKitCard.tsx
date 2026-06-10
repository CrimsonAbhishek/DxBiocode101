import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../data/products';

interface TestKitCardProps {
  product: Product;
}

export const TestKitCard: React.FC<TestKitCardProps> = ({ product }) => {
  const categorySlug = product.category.toLowerCase().replace(/ /g, '-');
  
  return (
    <div className="test-kit-card">
      {product.status === 'coming-soon' && (
        <span className="kit-badge soon">Coming Soon</span>
      )}
      <div className="kit-card-img">
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>
      <div className="kit-card-content">
        <span className="kit-card-category">{product.category}</span>
        <h3 className="kit-card-title">{product.name}</h3>
        <p className="kit-card-desc">{product.shortDescription}</p>
        <div className="kit-card-footer">
          <Link to={`/products/test-kits/${categorySlug}/${product.slug}`} className="btn-outline-primary kit-view-btn">
            View Details
          </Link>
        </div>
        <div className="kit-compatible-label">
          <span className="dot"></span> Compatible With: DX 101
        </div>
      </div>
    </div>
  );
};
