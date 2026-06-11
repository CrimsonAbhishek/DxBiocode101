'use client';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/CartStore';

export default function CartDrawer() {
  const { cart, isOpen, closeCart, removeFromCart } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="cart-panel-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
          />
          {/* Drawer */}
          <motion.div
            className="cart-panel-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            <div className="cart-panel-header">
              <h3>🛒 Your Cart</h3>
              <button className="cart-close-btn" onClick={closeCart}>✕</button>
            </div>

            <div className="cart-items-list">
              {cart.length === 0 ? (
                <div className="cart-empty">
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Your cart is empty</p>
                  <p style={{ fontSize: 13, color: '#6b7280' }}>Add products from the Products page</p>
                  <Link href="/products" onClick={closeCart} className="btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>
                    Browse Products
                  </Link>
                </div>
              ) : cart.map((item, i) => (
                <motion.div
                  key={item.id}
                  className="cart-item"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.05 }}
                  layout
                >
                  <Image src={item.img} alt={item.name} width={60} height={60} style={{ objectFit: 'cover', borderRadius: 10, border: '1px solid #e5e7eb' }} />
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">{item.price}</div>
                  </div>
                  <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>✕</button>
                </motion.div>
              ))}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Items:</span>
                  <span className="cart-total-price">{cart.length}</span>
                </div>
                <Link
                  href="/quote"
                  className="btn-primary"
                  onClick={closeCart}
                  style={{ width: '100%', justifyContent: 'center', textAlign: 'center', display: 'flex', marginTop: 12 }}
                >
                  Request Quote →
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
