import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id?: string;
  name: string;
  price: string;
  img: string;
  category?: string;
  type?: string;
}

interface CartState {
  cart: CartItem[];
  isOpen: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      isOpen: false,
      addToCart: (item) => set((state) => ({ cart: [...state.cart, item], isOpen: true })),
      removeFromCart: (index) =>
        set((state) => ({
          cart: state.cart.filter((_, i) => i !== index),
        })),
      clearCart: () => set({ cart: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: 'dx-cart-storage',
      // only persist cart items, not open state
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
