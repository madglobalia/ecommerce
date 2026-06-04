import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  _id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  category: string;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getQuantity: (productId: string) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product) =>
        set((state) => {
          const exists = state.cart.find((item) => item._id === product._id);
          if (exists) return state;
          return { cart: [...state.cart, { ...product, quantity: 1 }] };
        }),

      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item._id !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          const item = state.cart.find((i) => i._id === productId);
          if (!item) return state;
          const maxQty = Math.min(20, item.stock || 20);
          const clamped = Math.max(1, Math.min(quantity, maxQty));
          return {
            cart: state.cart.map((i) =>
              i._id === productId ? { ...i, quantity: clamped } : i
            ),
          };
        }),

      clearCart: () => set({ cart: [] }),

      isInCart: (productId) =>
        get().cart.some((item) => item._id === productId),

      getQuantity: (productId) =>
        get().cart.find((item) => item._id === productId)?.quantity ?? 0,
    }),
    {
      name: "cart-storage", // localStorage key
    }
  )
);
