import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { searchProducts } from '../utils/productUtils';
import type { Product } from '../data/products';

export const GlobalSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 1) {
      setResults(searchProducts(query));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleSelect = () => {
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="global-search-container" ref={searchRef}>
      <div className="search-input-wrapper">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search products, kits..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="global-search-input"
        />
        {query && (
          <button className="search-clear" onClick={() => setQuery('')}>
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="search-results-dropdown">
          <h4 className="search-results-header">Products ({results.length})</h4>
          <ul className="search-results-list">
            {results.map((product) => (
              <li key={product.id}>
                <Link
                  to={`/products${product.type === 'test-kit' ? '/test-kits/' + product.category.toLowerCase().replace(/ /g, '-') : ''}/${product.slug}`}
                  className="search-result-item"
                  onClick={handleSelect}
                >
                  <div className="sr-img">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="sr-details">
                    <span className="sr-name">{product.name}</span>
                    <span className="sr-category">{product.category}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {isOpen && query.length > 1 && results.length === 0 && (
        <div className="search-results-dropdown p-4 text-sm text-gray-500">
          No products found for "{query}"
        </div>
      )}
    </div>
  );
};
