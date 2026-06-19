'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useCartStore } from '@/lib/CartStore';

function sanitizeHref(href: string): string {
  if (href.startsWith('/') && !href.startsWith('//')) {
    return href;
  }
  return '#';
}

function getStaticHref(id: string): string {
  if (id === '1') return '/products#dx101';
  if (id === '2') return '/products#test-menu';
  if (id === '3') return '/products#test-menu';
  if (id === '4') return '/products#test-menu';
  if (id === '5') return '/products#test-menu';
  if (id === '6') return '/products#test-menu';
  return '/';
}

const PRODUCTS_DB = [
  { id: '1', name: 'DX 101 Immunofluorescence Quantitative Analyzer', category: 'POCT Analyzer', img: '/hero.webp', href: '/products#dx101' },
  { id: '2', name: 'Cardiac Markers Test Panel', category: 'Test Consumables', img: '/hero.webp', href: '/products#test-menu' },
  { id: '3', name: 'Thyroid Function Test Panel', category: 'Test Consumables', img: '/hero.webp', href: '/products#test-menu' },
  { id: '4', name: 'Infectious Disease Panel', category: 'Test Consumables', img: '/hero.webp', href: '/products#test-menu' },
  { id: '5', name: 'Fertility Panel', category: 'Test Consumables', img: '/hero.webp', href: '/products#test-menu' },
  { id: '6', name: 'Tumor Markers Panel', category: 'Test Consumables', img: '/hero.webp', href: '/products#test-menu' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { cart, toggleCart, openCart } = useCartStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(PRODUCTS_DB);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const cartCount = cart.length;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const q = searchQuery.toLowerCase().trim();
    setSearchResults(q ? PRODUCTS_DB.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) : PRODUCTS_DB);
  }, [searchQuery]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
  }, [mobileOpen]);

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname?.startsWith(href));

  return (
    <>
      <nav className={scrolled ? 'scrolled' : ''}>
        <div className="nav-inner">
          <Link href="/" className="logo">
            <Image src="/logo.svg" alt="DX BIOCODE" className="logo-img" width={180} height={80} priority />
          </Link>

          <ul className="nav-links" id="desktop-nav">
            <li><Link href="/" className={isActive('/') ? 'active' : ''}>Home</Link></li>
            <li className="nav-dropdown">
              <Link href="/products" className={isActive('/products') ? 'active' : ''}>Products ▾</Link>
              <div className="nav-dropdown-menu">
                <Link href="/products">All Products</Link>
                <Link href="/products#dx101">DX 101 Analyzer</Link>
              </div>
            </li>
            <li className="nav-dropdown">
              <Link href="/service" className={isActive('/service') ? 'active' : ''}>Service ▾</Link>
              <div className="nav-dropdown-menu">
                <Link href="/service#overview">Overview</Link>
                <Link href="/service#training">Training</Link>
                <Link href="/service#support">Support</Link>
              </div>
            </li>
            <li><Link href="/contact" className={isActive('/contact') ? 'active' : ''}>Contact</Link></li>
            <li><Link href="/careers" className={isActive('/careers') ? 'active' : ''}>Careers</Link></li>
            <li><Link href="/about" className={isActive('/about') ? 'active' : ''}>About Us</Link></li>
          </ul>

          <div className="nav-actions">
            <div className="nav-search-wrap">
              <button
                className="nav-search-btn"
                aria-label="Search"
                onClick={() => setSearchOpen(o => !o)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
              <div className={`nav-search-box${searchOpen ? ' open' : ''}`}>
                <input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search products…"
                  autoComplete="off"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                {searchOpen && (
                  <div className="search-results-dropdown">
                    {searchResults.length === 0 ? (
                      <div className="search-no-results">No results found</div>
                    ) : searchResults.map(r => {
                      const safeHref = getStaticHref(r.id);
                      return (
                        <Link key={r.id} href={safeHref} className="search-result-item" onClick={() => setSearchOpen(false)}>
                          <Image src={r.img} alt={r.name} width={40} height={40} style={{ objectFit: 'cover', borderRadius: 8 }} />
                          <div>
                            <div className="sri-name">{r.name}</div>
                            <div className="sri-cat">{r.category}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <button className="cart-btn" aria-label="Shopping cart" onClick={() => openCart()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            <button
              className={`hamburger${mobileOpen ? ' open' : ''}`}
              aria-label="Open menu"
              onClick={() => setMobileOpen(o => !o)}
              style={{ display: 'flex' }}
            >
              <span/><span/><span/>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      {mobileOpen && (
        <>
          <div className="mobile-nav-overlay" onClick={() => setMobileOpen(false)} />
          <div className="mobile-nav-drawer">
            <Link href="/" className="mob-link" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link href="/products" className="mob-link" onClick={() => setMobileOpen(false)}>Products</Link>
            <Link href="/service" className="mob-link" onClick={() => setMobileOpen(false)}>Service</Link>
            <Link href="/contact" className="mob-link" onClick={() => setMobileOpen(false)}>Contact</Link>
            <Link href="/careers" className="mob-link" onClick={() => setMobileOpen(false)}>Careers</Link>
            <Link href="/about" className="mob-link" onClick={() => setMobileOpen(false)}>About Us</Link>
            <a href="/Dx 101 - Analyzer.pdf" download className="mob-brochure" onClick={() => setMobileOpen(false)}>📥 Download Brochure</a>
            <Link href="/contact" className="mob-cta" onClick={() => setMobileOpen(false)}>Contact Us</Link>
          </div>
        </>
      )}
    </>
  );
}
