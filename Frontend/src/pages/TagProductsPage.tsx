import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { TopBar } from '../components/TopBar';
import { TestKitCard } from '../components/TestKitCard';
import { products } from '../data/products';

export const TagProductsPage: React.FC = () => {
  const { tagSlug } = useParams<{ tagSlug: string }>();

  const matchedProducts = useMemo(() => {
    if (!tagSlug) return [];
    return products.filter(product => {
      if (!product.tags) return false;
      return product.tags.some(tag => {
        const productTagSlug = tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        return productTagSlug === tagSlug;
      });
    });
  }, [tagSlug]);

  const displayTagName = useMemo(() => {
    if (matchedProducts.length > 0 && matchedProducts[0].tags && tagSlug) {
      const originalTag = matchedProducts[0].tags.find(tag => {
        const slug = tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        return slug === tagSlug;
      });
      return originalTag || tagSlug.replace(/-/g, ' ');
    }
    return tagSlug?.replace(/-/g, ' ') || 'Tag';
  }, [matchedProducts, tagSlug]);

  return (
    <div className="page-wrapper">
      <TopBar />
      <Navbar />
      
      <main className="main-content">
        <section className="catalog-hero" style={{ padding: '64px 0', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <div className="container">
            <div style={{ marginBottom: '16px' }}>
              <Link to="/products" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>&larr; Back to Products</Link>
            </div>
            <span style={{ color: '#3b82f6', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem' }}>Tag</span>
            <h1 style={{ fontSize: '3rem', fontWeight: 700, color: '#0f172a', margin: '8px 0 16px 0' }}>#{displayTagName}</h1>
            <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '600px' }}>
              Showing {matchedProducts.length} product{matchedProducts.length !== 1 ? 's' : ''} associated with this tag.
            </p>
          </div>
        </section>

        <section style={{ padding: '64px 0' }}>
          <div className="container">
            {matchedProducts.length > 0 ? (
              <div className="test-kit-grid">
                {matchedProducts.map(product => (
                  <TestKitCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div style={{ padding: '64px 0', textAlign: 'center', background: '#f8fafc', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '16px' }}>No products found</h3>
                <p style={{ color: '#64748b', marginBottom: '24px' }}>There are no products associated with the tag "{displayTagName}".</p>
                <Link to="/products" className="btn-primary">Browse All Products</Link>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};
