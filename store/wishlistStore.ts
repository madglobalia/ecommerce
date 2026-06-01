import { create } from "zustand";

interface WishlistState {
  wishlist: any[];
  addToWishlist: (product: any) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlist: [],

  addToWishlist: (product) =>
    set((state) => {
      const exists = state.wishlist.find((item) => item._id === product._id);
      if (exists) return state;
      return { wishlist: [...state.wishlist, product] };
    }),

  removeFromWishlist: (productId) =>
    set((state) => ({
      wishlist: state.wishlist.filter((item) => item._id !== productId),
    })),

  isInWishlist: (productId) => {
    const { wishlist } = get();
    return wishlist.some((item) => item._id === productId);
  },
}));