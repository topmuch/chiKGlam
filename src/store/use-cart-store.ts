import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

export interface LastAddedItem {
  product: Product;
  quantity: number;
  timestamp: number;
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  lastAdded: LastAddedItem | null;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  clearLastAdded: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      lastAdded: null,

      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
              lastAdded: {
                product,
                quantity: existingItem.quantity + quantity,
                timestamp: Date.now(),
              },
            };
          }

          return {
            items: [...state.items, { product, quantity }],
            lastAdded: {
              product,
              quantity,
              timestamp: Date.now(),
            },
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce(
          (count, item) => count + item.quantity,
          0
        );
      },

      toggleCart: () => {
        set((state) => ({ isCartOpen: !state.isCartOpen }));
      },

      setCartOpen: (open: boolean) => {
        set({ isCartOpen: open });
      },

      clearLastAdded: () => {
        set({ lastAdded: null });
      },
    }),
    {
      name: 'chicglam-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
