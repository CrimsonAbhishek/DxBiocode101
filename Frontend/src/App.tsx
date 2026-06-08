import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { TopBar } from './components/TopBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ScrollProgressBar } from './components/ScrollProgressBar';

// Pages
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { Service } from './pages/Service';
import { Contact } from './pages/Contact';
import { About } from './pages/About';
import { Careers } from './pages/Careers';
import { Quote } from './pages/Quote';

// Scroll to top helper
const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ScrollProgressBar />
      <TopBar />
      <Navbar />
      <CartDrawer />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/service" element={<Service />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/quote" element={<Quote />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
