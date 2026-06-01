import { create } from "zustand";

interface CartState {
  cart: any[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],

  addToCart: (product) =>
    set((state) => {
      const exists = state.cart.find((item) => item._id === product._id);
      if (exists) return state;
      return { cart: [...state.cart, product] };
    }),

  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item._id !== productId),
    })),

  clearCart: () => set({ cart: [] }),

  isInCart: (productId) => {
    const { cart } = get();
    return cart.some((item) => item._id === productId);
  },
}));