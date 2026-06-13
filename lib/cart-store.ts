import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  productId: string; name: string; slug: string;
  priceCents: number; image?: string; quantity: number;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  subtotalCents: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, qty = 1) => set((s) => {
        const existing = s.items.find((i) => i.productId === item.productId);
        if (existing) {
          return { items: s.items.map((i) =>
            i.productId === item.productId ? { ...i, quantity: i.quantity + qty } : i) };
        }
        return { items: [...s.items, { ...item, quantity: qty }] };
      }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.productId !== id) })),
      setQty: (id, qty) => set((s) => ({
        items: s.items.map((i) => i.productId === id ? { ...i, quantity: Math.max(1, qty) } : i),
      })),
      clear: () => set({ items: [] }),
      subtotalCents: () => get().items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0),
    }),
    { name: 'vami-cart' }
  )
);
