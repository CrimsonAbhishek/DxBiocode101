import React, { useState, useMemo } from 'react';

import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { TopBar } from '../components/TopBar';
import { Breadcrumbs } from '../components/Breadcrumbs';

import { CategoryCard } from '../components/CategoryCard';
import { TestKitCard } from '../components/TestKitCard';
import { getTestKitCategories, searchProducts } from '../utils/productUtils';
import { Search } from 'lucide-react';


export const TestKitsCatalog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const categories = getTestKitCategories();
  
  // Filter all test kits based on local search query
  const displayKits = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    // We only want to search within test kits for the local catalog search
    const results = searchProducts(searchQuery);
    return results.filter(p => p.type === 'test-kit');
  }, [searchQuery]);

  return (
    <div className="page-wrapper">
      <TopBar />
      <Navbar />
      
      <main className="main-content">
        {/* Catalog Hero */}
        <section className="catalog-hero" style={{ padding: '64px 0 32px 0', background: '#f8fafc' }}>
          <div className="container">
            <Breadcrumbs />
            <div className="catalog-hero-content" style={{ marginTop: '24px' }}>
              <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Diagnostic Test Kits</h1>
              <p className="hero-subtitle" style={{ maxWidth: '600px', margin: '0 0 32px 0' }}>
                Explore our comprehensive menu of high-quality immunofluorescence rapid test kits, fully compatible with the DX 101 Analyzer.
              </p>
              
              <div className="catalog-search" style={{ position: 'relative', maxWidth: '500px' }}>
                <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input 
                  type="text" 
                  placeholder="Search test kits by name or parameter..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Search Results or Categories */}
        <section className="catalog-content" style={{ padding: '64px 0' }}>
          <div className="container">
            {searchQuery.trim() ? (
              <div className="search-results-view">
                <h2 className="section-title" style={{ marginBottom: '32px', fontSize: '1.5rem' }}>Search Results ({displayKits.length})</h2>
                {displayKits.length > 0 ? (
                  <div className="test-kit-grid">
                    {displayKits.map(kit => (
                      <TestKitCard key={kit.id} product={kit} />
                    ))}
                  </div>
                ) : (
                  <div className="empty-state" style={{ padding: '48px', textAlign: 'center', background: '#f8fafc', borderRadius: '16px' }}>
                    <p style={{ color: '#64748b', fontSize: '1.1rem' }}>No test kits found matching "{searchQuery}"</p>
                    <button 
                      onClick={() => setSearchQuery('')} 
                      className="btn-outline-primary"
                      style={{ marginTop: '16px' }}
                    >
                      Clear Search
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="categories-view">
                <h2 className="section-title" style={{ marginBottom: '32px', fontSize: '1.5rem' }}>Browse by Category</h2>
                <div className="categories-grid">
                  {categories.map(cat => (
                    <CategoryCard key={cat.name} name={cat.name} count={cat.count} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};
