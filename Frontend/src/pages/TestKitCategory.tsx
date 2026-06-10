import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { TopBar } from '../components/TopBar';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { TestKitCard } from '../components/TestKitCard';
import { getProductsByCategory, getTestKitCategories } from '../utils/productUtils';
import { ChevronRight } from 'lucide-react';

export const TestKitCategory: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  
  // Clean the URL param back to a displayable name
  const categoryName = useMemo(() => {
    if (!category) return '';
    const formatted = category.replace(/-/g, ' ');
    // Simple title case
    return formatted.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }, [category]);

  const kits = useMemo(() => getProductsByCategory(categoryName), [categoryName]);
  const allCategories = getTestKitCategories();
  
  // If no kits found, this category might not exist in our data
  if (kits.length === 0 && category) {
    return <Navigate to="/products/test-kits" replace />;
  }

  return (
    <div className="page-wrapper">
      <TopBar />
      <Navbar />
      
      <main className="main-content">
        <section className="category-hero" style={{ padding: '64px 0 48px 0', background: 'linear-gradient(to right, #f8fafc, #eff6ff)' }}>
          <div className="container">
            <Breadcrumbs />
            <div className="category-header" style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
              <div>
                <span className="section-eyebrow">Category Overview</span>
                <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{categoryName}</h1>
                <p className="hero-subtitle" style={{ maxWidth: '600px', margin: 0 }}>
                  Explore our highly accurate {categoryName.toLowerCase()} test kits designed exclusively for the DX 101 Immunofluorescence Quantitative Analyzer.
                </p>
              </div>
              <div className="category-meta" style={{ background: 'white', padding: '16px 24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>{kits.length}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>Available Parameters</div>
              </div>
            </div>
          </div>
        </section>

        <section className="category-content" style={{ padding: '64px 0' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '48px', alignItems: 'start' }}>
            
            {/* Main Content: Kits Grid */}
            <div className="category-main">
              <div className="test-kit-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {kits.map(kit => (
                  <TestKitCard key={kit.id} product={kit} />
                ))}
              </div>
            </div>
            
            {/* Sidebar: Related Categories */}
            <aside className="category-sidebar" style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', position: 'sticky', top: '100px' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', marginBottom: '20px' }}>Other Categories</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {allCategories.map(cat => {
                  if (cat.name === categoryName) return null;
                  const catSlug = cat.name.toLowerCase().replace(/ /g, '-');
                  return (
                    <li key={cat.name}>
                      <Link 
                        to={`/products/test-kits/${catSlug}`}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'white', borderRadius: '8px', color: '#334155', textDecoration: 'none', fontWeight: 500, transition: 'all 0.2s ease' }}
                        className="sidebar-cat-link"
                      >
                        {cat.name}
                        <ChevronRight size={16} color="#94a3b8" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </aside>
            
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};
