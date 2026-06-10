import React, { useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { TopBar } from '../components/TopBar';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { TestKitCard } from '../components/TestKitCard';
import { getProductBySlug, getRelatedKits } from '../utils/productUtils';
import { useCartStore } from '../store/cartStore';

export const TestKitDetail: React.FC = () => {
  const { kitId } = useParams<{ category: string; kitId: string }>();
  const addToCart = useCartStore((state) => state.addToCart);
  
  const product = useMemo(() => {
    if (!kitId) return undefined;
    return getProductBySlug(kitId);
  }, [kitId]);

  const relatedKits = useMemo(() => {
    if (!product) return [];
    return getRelatedKits(product.category, product.id, 4);
  }, [product]);

  if (!product) {
    return <Navigate to="/products/test-kits" replace />;
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: 'Quote Only',
      img: product.image,
      category: product.category,
      type: product.type
    });
  };

  return (
    <div className="page-wrapper">
      <TopBar />
      <Navbar />
      
      <main className="main-content">
        <div style={{ background: '#f8fafc', padding: '24px 0 0 0' }}>
          <div className="container">
            <Breadcrumbs />
          </div>
        </div>

        {/* SECTION 1: Hero */}
        <section className="product-detail-hero" style={{ padding: '48px 0 64px 0', background: '#f8fafc' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
              <div className="product-image-container" style={{ background: 'white', padding: '48px', borderRadius: '24px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', aspectRatio: '1/1' }}>
                <img src={product.image} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
              <div className="product-info-container">
                <span className="kit-badge" style={{ display: 'inline-block', marginBottom: '16px' }}>{product.category}</span>
                <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '24px', lineHeight: 1.1 }}>{product.name}</h1>
                <p className="hero-subtitle" style={{ color: '#475569', marginBottom: '32px' }}>{product.shortDescription}</p>
                
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button onClick={handleAddToCart} className="btn-primary" style={{ flex: 1, padding: '16px 32px', fontSize: '1.125rem' }}>
                    Add to Quote Cart
                  </button>
                  <Link to="/contact" className="btn-outline-primary" style={{ flex: 1, padding: '16px 32px', fontSize: '1.125rem', textAlign: 'center' }}>
                    Request Demo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Applicable Device */}
        <section className="applicable-device-section" style={{ padding: '64px 0', borderBottom: '1px solid #e2e8f0' }}>
          <div className="container">
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '24px', padding: '48px', display: 'flex', gap: '48px', alignItems: 'center', color: 'white', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '300px', height: '300px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '50%', filter: 'blur(50px)' }}></div>
              <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                <span style={{ color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Compatible With</span>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 16px 0', color: 'white' }}>DX 101 Analyzer</h2>
                <p style={{ color: '#cbd5e1', fontSize: '1.125rem', margin: '0 0 32px 0', maxWidth: '500px' }}>
                  This test kit is engineered exclusively for the DX 101 Immunofluorescence Quantitative Analyzer, ensuring rapid, highly accurate point-of-care results.
                </p>
                <Link to="/products/dx-101" className="btn-primary" style={{ background: 'white', color: '#0f172a' }}>
                  View DX 101 Details
                </Link>
              </div>
              <div style={{ flex: '0 0 300px', position: 'relative', zIndex: 1 }}>
                <img src="/hero.webp" alt="DX 101 Analyzer" style={{ width: '100%', filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.3))' }} />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 & 4: Intended Use and Specifications */}
        <section className="kit-details-section" style={{ padding: '80px 0' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' }}>
            
            <div className="intended-use">
              <h3 style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', color: '#3b82f6', fontSize: '1rem' }}>ℹ️</span>
                Intended Use
              </h3>
              <div style={{ color: '#475569', fontSize: '1.125rem', lineHeight: 1.8 }}>
                {product.intendedUse ? (
                  <p>{product.intendedUse}</p>
                ) : (
                  <p style={{ fontStyle: 'italic', color: '#94a3b8' }}>Detailed intended use information will be available soon.</p>
                )}
              </div>
            </div>

            <div className="specifications">
              <h3 style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', color: '#3b82f6', fontSize: '1rem' }}>⚙️</span>
                Specifications
              </h3>
              <div className="specs-table-container">
                {product.specifications ? (
                  <table className="specs-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {Object.entries(product.specifications).map(([key, value], index) => (
                        <tr key={key} style={{ borderBottom: '1px solid #e2e8f0', background: index % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                          <td style={{ padding: '16px', fontWeight: 600, color: '#334155', width: '40%' }}>{key}</td>
                          <td style={{ padding: '16px', color: '#475569' }}>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ fontStyle: 'italic', color: '#94a3b8' }}>Detailed specifications will be available soon.</p>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 5: Related Test Kits */}
        {relatedKits.length > 0 && (
          <section className="related-kits-section" style={{ padding: '80px 0', background: '#f8fafc' }}>
            <div className="container">
              <div className="section-title-wrap" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
                <span className="section-eyebrow">Explore More</span>
                <h2 className="section-title">Related {product.category} Kits</h2>
              </div>
              <div className="test-kit-grid" style={{ marginTop: '40px' }}>
                {relatedKits.map(kit => (
                  <TestKitCard key={kit.id} product={kit} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};
