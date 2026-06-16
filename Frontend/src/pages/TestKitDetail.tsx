import React, { useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { TopBar } from '../components/TopBar';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { TestKitCard } from '../components/TestKitCard';
import { getProductBySlug, getRelatedKits } from '../utils/productUtils';
import { useCartStore } from '../store/cartStore';
import { ProductImagePlaceholder } from '../components/ProductImagePlaceholder';
import { SEOSchema } from '../components/SEOSchema';

export const TestKitDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const addToCart = useCartStore((state) => state.addToCart);
  
  const product = useMemo(() => {
    if (!slug) return undefined;
    return getProductBySlug(slug);
  }, [slug]);

  const relatedKits = useMemo(() => {
    if (!product) return [];
    return getRelatedKits(product.category, product.id, 4);
  }, [product]);

  if (!product) {
    return <Navigate to="/products" replace />;
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
      <SEOSchema type="Product" data={product} />
      <SEOSchema type="BreadcrumbList" data={{
        items: [
          { name: 'Home', url: 'https://dxbiocode.com/' },
          { name: 'Products', url: 'https://dxbiocode.com/products' },
          { name: product.category, url: `https://dxbiocode.com/products/test-kits/${product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` },
          { name: product.name, url: `https://dxbiocode.com/products/${product.slug}` }
        ]
      }} />
      <TopBar />
      <Navbar />
      
      <main className="main-content">
        {/* SECTION 1: Breadcrumbs */}
        <div style={{ background: '#f8fafc', padding: '24px 0 0 0' }}>
          <div className="container">
            <Breadcrumbs />
          </div>
        </div>

        {/* SECTION 2 & 3 & 4: Hero, Contact Us Button, Image Placeholder */}
        <section className="product-detail-hero" style={{ padding: '48px 0 64px 0', background: '#f8fafc' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
              <div className="product-image-container" style={{ background: 'white', padding: '24px', borderRadius: '24px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', aspectRatio: '1/1' }}>
                <ProductImagePlaceholder />
              </div>
              <div className="product-info-container">
                <span className="kit-badge" style={{ display: 'inline-block', marginBottom: '16px' }}>{product.category}</span>
                <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '24px', lineHeight: 1.1 }}>{product.name}</h1>
                <p className="hero-subtitle" style={{ color: '#475569', marginBottom: '32px' }}>{product.shortDescription}</p>
                
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <button onClick={handleAddToCart} className="btn-primary" style={{ flex: 1, padding: '16px 32px', fontSize: '1.125rem' }}>
                    Add to Quote Cart
                  </button>
                  <Link to="/contact" className="btn-outline-primary" style={{ flex: 1, padding: '16px 32px', fontSize: '1.125rem', textAlign: 'center' }}>
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5 & 6: Intended Use and Specifications Table */}
        <section className="kit-details-section" style={{ padding: '80px 0', borderBottom: '1px solid #e2e8f0' }}>
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
                Specifications Table
              </h3>
              <div className="specs-table-container" style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                {product.specifications ? (
                  <table className="specs-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {Object.entries(product.specifications).map(([key, value], index) => (
                        <tr key={key} style={{ borderBottom: index < Object.keys(product.specifications!).length - 1 ? '1px solid #e2e8f0' : 'none', background: index % 2 === 0 ? 'white' : '#f8fafc' }}>
                          <td style={{ padding: '16px', fontWeight: 600, color: '#334155', width: '40%', borderRight: '1px solid #e2e8f0' }}>{key}</td>
                          <td style={{ padding: '16px', color: '#475569' }}>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ fontStyle: 'italic', color: '#94a3b8', padding: '16px' }}>Detailed specifications will be available soon.</p>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 7: Applicable Device */}
        <section className="applicable-device-section" style={{ padding: '64px 0', borderBottom: '1px solid #e2e8f0' }}>
          <div className="container">
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '24px', padding: '48px', display: 'flex', gap: '48px', alignItems: 'center', color: 'white', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '300px', height: '300px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '50%', filter: 'blur(50px)' }}></div>
              <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                <span style={{ color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Applicable Device</span>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 16px 0', color: 'white' }}>DX 101 Immunofluorescence Quantitative Analyzer</h2>
                <p style={{ color: '#cbd5e1', fontSize: '1.125rem', margin: '0 0 32px 0', maxWidth: '500px' }}>
                  This test kit is engineered exclusively for the DX 101 Immunofluorescence Quantitative Analyzer, ensuring rapid, highly accurate point-of-care results.
                </p>
                <Link to="/products/dx-101" className="btn-primary" style={{ background: 'white', color: '#0f172a', fontWeight: 'bold' }}>
                  View DX 101 Details
                </Link>
              </div>
              <div style={{ flex: '0 0 300px', position: 'relative', zIndex: 1, background: 'white', padding: '16px', borderRadius: '16px' }}>
                <ProductImagePlaceholder />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: Related Tags */}
        {product.tags && product.tags.length > 0 && (
          <section className="tags-section" style={{ padding: '40px 0', borderBottom: '1px solid #e2e8f0' }}>
            <div className="container">
              <h3 style={{ fontSize: '1.25rem', color: '#334155', marginBottom: '16px' }}>Related Tags</h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {product.tags.map(tag => {
                  const tagSlug = tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                  return (
                    <Link key={tag} to={`/tag/${tagSlug}`} style={{ 
                      padding: '8px 16px', 
                      background: '#f1f5f9', 
                      color: '#475569', 
                      borderRadius: '99px', 
                      fontSize: '0.875rem', 
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    }}>
                      #{tag}
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 9: Related Products */}
        {relatedKits.length > 0 && (
          <section className="related-kits-section" style={{ padding: '80px 0', background: '#f8fafc' }}>
            <div className="container">
              <div className="section-title-wrap" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
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
        
        {/* SECTION 10: Request Quote Section */}
        <section className="request-quote-cta" style={{ padding: '80px 0', background: 'white', textAlign: 'center' }}>
          <div className="container">
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px', color: '#0f172a' }}>Ready to Elevate Your Diagnostics?</h2>
            <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '600px', margin: '0 auto 32px auto' }}>
              Request a quote for the {product.name} today and experience the speed and precision of DX BIOCODE.
            </p>
            <Link to="/quote" className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.25rem' }}>
              Request a Quote
            </Link>
          </div>
        </section>
      </main>
      
      {/* SECTION 11: Footer */}
      <Footer />
    </div>
  );
};

