import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';

export const CartDrawer: React.FC = () => {
  const { cart, isOpen, removeFromCart, closeCart } = useCartStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="cart-panel open" style={{ display: 'block' }}>
          <motion.div
            className="cart-panel-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          <motion.div
            className="cart-panel-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{ transform: 'none' }}
          >
            <div className="cart-panel-header">
              <h3>🛒 Your Cart</h3>
              <button className="cart-close-btn" onClick={closeCart}>✕</button>
            </div>

            <div className="cart-items-list">
              {cart.length === 0 ? (
                <div className="cart-empty">
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛒</div>
                  <p>Your cart is empty</p>
                  <Link
                    to="/products"
                    className="btn-primary"
                    style={{ marginTop: '16px', fontSize: '14px', padding: '10px 20px' }}
                    onClick={closeCart}
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div className="cart-item" key={idx}>
                    <img src={item.img.startsWith('/') ? item.img : `/${item.img}`} alt={item.name} />
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-price">{item.price}</div>
                    </div>
                    <button
                      className="cart-item-remove"
                      onClick={() => removeFromCart(idx)}
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer" style={{ display: 'block' }}>
                <div className="cart-total">
                  <span>Total:</span>
                  <span className="cart-total-price">Contact for Pricing</span>
                </div>
                <Link
                  to="/quote"
                  className="btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    textAlign: 'center',
                    display: 'flex',
                    marginTop: '12px'
                  }}
                  onClick={closeCart}
                >
                  Request Quote →
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
