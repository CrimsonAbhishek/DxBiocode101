import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';

const PRODUCTS_DB = [
  { name: 'DX 101 Immunofluorescence Quantitative Analyzer', category: 'POCT Analyzer', img: 'hero.webp', href: '/products#dx101' },
  { name: 'Cardiac Markers Test Panel', category: 'Test Consumables', img: 'hero.webp', href: '/products#test-menu' },
  { name: 'Thyroid Function Test Panel', category: 'Test Consumables', img: 'hero.webp', href: '/products#test-menu' },
  { name: 'Infectious Disease Panel', category: 'Test Consumables', img: 'hero.webp', href: '/products#test-menu' },
  { name: 'Fertility Panel', category: 'Test Consumables', img: 'hero.webp', href: '/products#test-menu' },
  { name: 'Tumor Markers Panel', category: 'Test Consumables', img: 'hero.webp', href: '/products#test-menu' },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const cart = useCartStore((state) => state.cart);
  const openCart = useCartStore((state) => state.openCart);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsSearchOpen(false);
    setIsMobileOpen(false);
    setSearchQuery('');
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProducts = searchQuery.trim()
    ? PRODUCTS_DB.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const activeClass = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <>
      <nav className={isScrolled ? 'scrolled' : ''}>
        <div className="nav-inner">
          <Link to="/" className="logo">
            <img src="/logo.svg" alt="DX BIOCODE" className="logo-img" width="180" height="80" />
          </Link>

          <ul className="nav-links" id="desktop-nav">
            <li>
              <Link to="/" className={activeClass('/')}>Home</Link>
            </li>
            <li className="nav-dropdown">
              <Link to="/products" className={activeClass('/products')}>Products ▾</Link>
              <div className="nav-dropdown-menu">
                <Link to="/products">All Products</Link>
                <Link to="/products#dx101">DX 101 Analyzer</Link>
              </div>
            </li>
            <li className="nav-dropdown">
              <Link to="/service" className={activeClass('/service')}>Service ▾</Link>
              <div className="nav-dropdown-menu">
                <Link to="/service#overview">Overview</Link>
                <Link to="/service#training">Training</Link>
                <Link to="/service#support">Support</Link>
              </div>
            </li>
            <li>
              <Link to="/contact" className={activeClass('/contact')}>Contact</Link>
            </li>
            <li>
              <Link to="/careers" className={activeClass('/careers')}>Careers</Link>
            </li>
            <li>
              <Link to="/about" className={activeClass('/about')}>About Us</Link>
            </li>
          </ul>

          <div className="nav-actions">
            <div className="nav-search-wrap" ref={searchRef}>
              <button
                className="nav-search-btn"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
              
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    className="nav-search-box open"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      type="search"
                      placeholder="Search products…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                    <div className="search-results-dropdown">
                      {searchQuery.trim() && filteredProducts.length === 0 && (
                        <div className="search-no-results">No products found</div>
                      )}
                      {filteredProducts.map((p, index) => (
                        <Link to={p.href} key={index} className="search-result-item" onClick={() => setIsSearchOpen(false)}>
                          <img src={`/${p.img}`} alt={p.name} />
                          <div>
                            <div className="sri-name">{p.name}</div>
                            <div className="sri-cat">{p.category}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button className="cart-btn" onClick={openCart} aria-label="Shopping cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className="cart-badge">{cart.length}</span>
            </button>

            <button
              className={`hamburger ${isMobileOpen ? 'open' : ''}`}
              onClick={handleMobileToggle}
              aria-label="Open menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileOpen && (
          <div className="mobile-nav open" style={{ display: 'block' }}>
            <motion.div
              className="mobile-nav-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleMobileToggle}
            />
            <motion.div
              className="mobile-nav-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ transform: 'none' }}
            >
              <Link to="/" className="mob-link" onClick={handleMobileToggle}>Home</Link>
              <Link to="/products" className="mob-link" onClick={handleMobileToggle}>Products</Link>
              <Link to="/service" className="mob-link" onClick={handleMobileToggle}>Service</Link>
              <Link to="/contact" className="mob-link" onClick={handleMobileToggle}>Contact</Link>
              <Link to="/careers" className="mob-link" onClick={handleMobileToggle}>Careers</Link>
              <Link to="/about" className="mob-link" onClick={handleMobileToggle}>About Us</Link>
              <a href="/Dx 101 - Analyzer.pdf" download="Dx 101 - Analyzer.pdf" className="mob-brochure">📥 Download Brochure</a>
              <Link to="/contact" className="mob-cta" onClick={handleMobileToggle}>Contact Us</Link>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
