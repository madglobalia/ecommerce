import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistItem {
  _id: string;
  title: string;
  price: number;
  description?: string;
  image?: string;
  stock: number;
  category?: string;
}

interface WishlistState {
  wishlist: WishlistItem[];
  addToWishlist: (product: any) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
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

      isInWishlist: (productId) =>
        get().wishlist.some((item) => item._id === productId),
    }),
    {
      name: "wishlist-storage", // localStorage key
    }
  )
);
